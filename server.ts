import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { defaultPaymentOrchestrator } from './src/server/paymentOrchestrator';
import { defaultPaymentRepository } from './src/server/paymentRepository';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple in-memory IP Rate Limiter for Payment API endpoints
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function paymentRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'local';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 60;

  const bucket = rateLimitBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + windowMs });
    return next();
  }

  bucket.count += 1;
  if (bucket.count > maxRequests) {
    return res.status(429).json({
      error: 'TOO_MANY_REQUESTS',
      message: 'So‘rovlar soni me’yordan oshdi. Iltimos, birozdan so‘ng qayta urinib ko‘ring.',
    });
  }

  return next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Click sends webhook callbacks as application/x-www-form-urlencoded or application/json
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ==========================================================
  // CLICK MERCHANT API & PAYMENT ENDPOINTS
  // ==========================================================

  /**
   * 1. POST /api/payments/click/create
   * Creates a server-side Payment record with authoritative plan price (19 000 or 149 000 UZS)
   * and returns the Click payment redirect URL if CLICK_* env variables are configured.
   */
  app.post('/api/payments/click/create', paymentRateLimiter, (req: Request, res: Response) => {
    try {
      const origin = `${req.protocol}://${req.get('host')}`;
      const result = defaultPaymentOrchestrator.createClickPayment({
        userId: req.body?.userId,
        email: req.body?.email,
        name: req.body?.name,
        plan: req.body?.plan,
        amount: req.body?.amount, // Ignored on server
        returnUrlBase: process.env.APP_URL || origin,
      });

      return res.status(201).json({
        paymentId: result.payment.id,
        status: result.payment.status,
        plan: result.payment.plan,
        amount: result.payment.amount,
        currency: result.payment.currency,
        provider: result.payment.provider,
        configured: result.configured,
        testMode: result.testMode,
        paymentUrl: result.paymentUrl,
        message: result.message,
        createdAt: result.payment.createdAt,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server xatoligi';
      const status = message.startsWith('UNAUTHENTICATED') ? 401 : 400;
      return res.status(status).json({
        error: status === 401 ? 'UNAUTHENTICATED' : 'BAD_REQUEST',
        message,
      });
    }
  });

  /**
   * 2. POST /api/payments/click/prepare
   * Official Click SHOP-API Prepare webhook (action = 0)
   * Verifies MD5 sign_string, order existence, amount, and idempotency.
   */
  app.post('/api/payments/click/prepare', paymentRateLimiter, (req: Request, res: Response) => {
    const result = defaultPaymentOrchestrator.handleClickPrepare(req.body);
    return res.status(200).json(result);
  });

  /**
   * 3. POST /api/payments/click/complete
   * Official Click SHOP-API Complete webhook (action = 1)
   * Verifies MD5 sign_string, merchant_prepare_id, amount, and activates PRO subscription
   * ONLY when error === 0.
   */
  app.post('/api/payments/click/complete', paymentRateLimiter, (req: Request, res: Response) => {
    const result = defaultPaymentOrchestrator.handleClickComplete(req.body);
    return res.status(200).json(result);
  });

  /**
   * 4. GET /api/payments/:paymentId/status
   * Used by /payment/success and /payment/failure pages to verify authoritative server status.
   */
  app.get('/api/payments/:paymentId/status', paymentRateLimiter, (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;
    const statusInfo = defaultPaymentOrchestrator.getPaymentStatus(paymentId);

    if (!statusInfo) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'To‘lov ma’lumoti topilmadi.',
      });
    }

    return res.status(200).json(statusInfo);
  });

  /**
   * 5. GET /api/users/:userId/subscription
   * Returns authoritative server-side subscription state for a user.
   */
  app.get('/api/users/:userId/subscription', (req: Request, res: Response) => {
    const user = defaultPaymentRepository.getUserById(req.params.userId);
    if (!user) {
      return res.status(200).json({
        userId: req.params.userId,
        plan: 'FREE',
        subscriptionStatus: 'ACTIVE',
        subscriptionStart: null,
        subscriptionEnd: null,
      });
    }
    return res.status(200).json({
      userId: user.id,
      email: user.email,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionStart: user.subscriptionStart,
      subscriptionEnd: user.subscriptionEnd,
    });
  });

  /**
   * 6. GET /api/admin/payments
   * Protected admin service endpoint structure (not exposed to regular unauthenticated users).
   */
  app.get('/api/admin/payments', (req: Request, res: Response) => {
    const adminToken = process.env.ADMIN_API_TOKEN;
    const providedToken = req.headers['x-admin-token'];
    if (!adminToken || providedToken !== adminToken) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Admin huquqi talab qilinadi.',
      });
    }
    return res.status(200).json(defaultPaymentOrchestrator.getAdminOverview());
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ==========================================================
  // VITE MIDDLEWARE (DEVELOPMENT) OR STATIC ASSETS (PRODUCTION)
  // ==========================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Download full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
