import crypto from 'crypto';
import {
  ClickWebhookPayload,
  ClickWebhookResponse,
  CreatePaymentSessionResult,
  SERVER_PLAN_PRICES_UZS,
  SubscriptionPlanId,
} from './paymentTypes';
import {
  PaymentSubscriptionRepository,
  defaultPaymentRepository,
} from './paymentRepository';
import {
  ClickEnvConfig,
  ClickPaymentProvider,
  PaymePaymentProvider,
} from './clickPaymentProvider';

export interface CreateClickOrderRequest {
  userId?: string;
  email?: string;
  name?: string;
  plan?: string;
  amount?: number; // Untrusted client field — ignored in favor of SERVER_PLAN_PRICES_UZS
  returnUrlBase?: string;
}

export class PaymentOrchestratorService {
  private readonly clickProvider: ClickPaymentProvider;
  private readonly paymeProvider: PaymePaymentProvider;

  constructor(
    private readonly repo: PaymentSubscriptionRepository = defaultPaymentRepository,
    clickConfigOverride?: ClickEnvConfig
  ) {
    this.clickProvider = new ClickPaymentProvider(this.repo, clickConfigOverride);
    this.paymeProvider = new PaymePaymentProvider();
  }

  /**
   * 1. Validates authenticated user (userId & email required).
   * 2. Determines authoritative server-side price from plan (ignores client amount).
   * 3. Creates PENDING Payment record in repository.
   * 4. Generates Click payment session URL if credentials exist.
   */
  createClickPayment(req: CreateClickOrderRequest): CreatePaymentSessionResult {
    const userId = (req.userId || '').trim();
    const email = (req.email || '').trim();

    if (!userId || !email || !email.includes('@')) {
      throw new Error('UNAUTHENTICATED: To‘lovni boshlash uchun tizimga kirgan bo‘lishingiz shart.');
    }

    const plan = req.plan as Exclude<SubscriptionPlanId, 'FREE'>;
    if (plan !== 'PRO_MONTHLY' && plan !== 'PRO_YEARLY') {
      throw new Error('INVALID_PLAN: Noto‘g‘ri PRO tarif tanlandi.');
    }

    // Server-side authoritative amount in UZS (never trust req.amount)
    const authoritativeAmount = SERVER_PLAN_PRICES_UZS[plan];

    // Ensure user exists in repository
    this.repo.upsertUser({
      id: userId,
      email,
      name: req.name,
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes expiration window
    const paymentId = `pay_${now.getTime()}_${crypto.randomBytes(4).toString('hex')}`;

    const payment = this.repo.createPayment({
      id: paymentId,
      userId,
      email,
      provider: 'CLICK',
      plan,
      amount: authoritativeAmount,
      currency: 'UZS',
      status: 'PENDING',
      providerTransactionId: null,
      createdAt: now.toISOString(),
      paidAt: null,
      expiresAt: expiresAt.toISOString(),
      metadata: {
        clientIgnoredAmount: req.amount ?? null,
        createdVia: 'CLICK_MERCHANT_API',
      },
    });

    return this.clickProvider.createPaymentSession(
      {
        userId,
        email,
        plan,
        returnUrlBase: req.returnUrlBase || process.env.APP_URL || 'http://localhost:3000',
      },
      payment
    );
  }

  handleClickPrepare(payload: ClickWebhookPayload): ClickWebhookResponse {
    return this.clickProvider.handlePrepare(payload);
  }

  handleClickComplete(payload: ClickWebhookPayload): ClickWebhookResponse {
    return this.clickProvider.handleComplete(payload);
  }

  getPaymentStatus(paymentId: string) {
    const payment = this.repo.getPaymentById(paymentId);
    if (!payment) {
      return null;
    }
    const user = this.repo.getUserById(payment.userId);
    return {
      paymentId: payment.id,
      userId: payment.userId,
      provider: payment.provider,
      plan: payment.plan,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      providerTransactionId: payment.providerTransactionId,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
      expiresAt: payment.expiresAt,
      clickConfigured: this.clickProvider.isConfigured(),
      userSubscription: user
        ? {
            plan: user.plan,
            subscriptionStatus: user.subscriptionStatus,
            subscriptionStart: user.subscriptionStart,
            subscriptionEnd: user.subscriptionEnd,
          }
        : null,
    };
  }

  getAdminOverview() {
    return {
      payments: this.repo.listAllPaymentsForAdmin(),
      users: this.repo.listAllUsersForAdmin(),
      providers: {
        clickConfigured: this.clickProvider.isConfigured(),
        paymeConfigured: this.paymeProvider.isConfigured(),
      },
    };
  }
}

export const defaultPaymentOrchestrator = new PaymentOrchestratorService();
