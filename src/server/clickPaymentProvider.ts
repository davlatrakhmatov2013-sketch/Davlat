import crypto from 'crypto';
import {
  ClickWebhookPayload,
  ClickWebhookResponse,
  CreatePaymentSessionInput,
  CreatePaymentSessionResult,
  PaymentProvider,
  PaymentRecord,
} from './paymentTypes';
import { PaymentSubscriptionRepository } from './paymentRepository';

export interface ClickEnvConfig {
  serviceId: string;
  merchantId: string;
  merchantUserId: string;
  secretKey: string;
  testMode: boolean;
}

/**
 * Official Click Error Codes per Click SHOP-API specification:
 *  0   : Success
 * -1   : SIGN CHECK FAILED!
 * -2   : Incorrect parameter amount
 * -3   : Action not found
 * -4   : Already paid
 * -5   : User does not exist / Order not found
 * -6   : Transaction does not exist
 * -7   : Failed to update user
 * -8   : Error in request from click
 * -9   : Transaction cancelled
 */
export const CLICK_ERRORS = {
  SUCCESS: { error: 0, note: 'Success' },
  SIGN_CHECK_FAILED: { error: -1, note: 'SIGN CHECK FAILED!' },
  INVALID_AMOUNT: { error: -2, note: 'Incorrect parameter amount' },
  ACTION_NOT_FOUND: { error: -3, note: 'Action not found' },
  ALREADY_PAID: { error: -4, note: 'Already paid' },
  ORDER_NOT_FOUND: { error: -5, note: 'Order does not exist or expired' },
  TRANSACTION_NOT_FOUND: { error: -6, note: 'Transaction does not exist' },
  REQUEST_ERROR: { error: -8, note: 'Error in request from click' },
  TRANSACTION_CANCELLED: { error: -9, note: 'Transaction cancelled' },
};

export function getClickEnvConfig(): ClickEnvConfig {
  return {
    serviceId: (process.env.CLICK_SERVICE_ID || '').trim(),
    merchantId: (process.env.CLICK_MERCHANT_ID || '').trim(),
    merchantUserId: (process.env.CLICK_MERCHANT_USER_ID || '').trim(),
    secretKey: (process.env.CLICK_SECRET_KEY || '').trim(),
    testMode: process.env.CLICK_TEST_MODE !== 'false',
  };
}

/**
 * Computes official Click MD5 signature string:
 * Prepare (action = 0):
 *   md5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + amount + action + sign_time)
 * Complete (action = 1):
 *   md5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + merchant_prepare_id + amount + action + sign_time)
 */
export function computeClickSignature(params: {
  clickTransId: string | number;
  serviceId: string | number;
  secretKey: string;
  merchantTransId: string;
  merchantPrepareId?: string | number;
  amount: string | number;
  action: string | number;
  signTime: string;
}): string {
  const isComplete = String(params.action) === '1';
  const raw = isComplete
    ? `${params.clickTransId}${params.serviceId}${params.secretKey}${params.merchantTransId}${params.merchantPrepareId ?? ''}${params.amount}${params.action}${params.signTime}`
    : `${params.clickTransId}${params.serviceId}${params.secretKey}${params.merchantTransId}${params.amount}${params.action}${params.signTime}`;

  return crypto.createHash('md5').update(raw).digest('hex');
}

export class ClickPaymentProvider implements PaymentProvider {
  readonly providerName = 'CLICK' as const;

  constructor(
    private readonly repo: PaymentSubscriptionRepository,
    private readonly configOverride?: ClickEnvConfig
  ) {}

  private getConfig(): ClickEnvConfig {
    return this.configOverride || getClickEnvConfig();
  }

  isConfigured(): boolean {
    const cfg = this.getConfig();
    return Boolean(cfg.serviceId && cfg.merchantId && cfg.secretKey);
  }

  createPaymentSession(
    input: CreatePaymentSessionInput,
    payment: PaymentRecord
  ): CreatePaymentSessionResult {
    const cfg = this.getConfig();
    const configured = this.isConfigured();

    if (!configured) {
      return {
        payment,
        configured: false,
        testMode: cfg.testMode,
        paymentUrl: null,
        message:
          'Click Merchant API kalitlari (CLICK_SERVICE_ID, CLICK_MERCHANT_ID, CLICK_SECRET_KEY) server .env muhitiga hali ulanmagan. To‘lov yozuvi PENDING holatida yaratildi.',
      };
    }

    const returnUrl = `${input.returnUrlBase.replace(/\/$/, '')}/payment/success?paymentId=${encodeURIComponent(payment.id)}`;

    const query = new URLSearchParams({
      service_id: cfg.serviceId,
      merchant_id: cfg.merchantId,
      amount: payment.amount.toFixed(2),
      transaction_param: payment.id,
      return_url: returnUrl,
    });
    if (cfg.merchantUserId) {
      query.set('merchant_user_id', cfg.merchantUserId);
    }

    const paymentUrl = `https://my.click.uz/services/pay?${query.toString()}`;

    return {
      payment,
      configured: true,
      testMode: cfg.testMode,
      paymentUrl,
      message: 'Click to‘lov sahifasiga yo‘naltirilmoqda.',
    };
  }

  /**
   * Handles Click SHOP-API Prepare (action = 0)
   */
  handlePrepare(payload: ClickWebhookPayload): ClickWebhookResponse {
    const cfg = this.getConfig();
    const clickTransId = String(payload.click_trans_id || '');
    const merchantTransId = String(payload.merchant_trans_id || '');
    const action = Number(payload.action);

    if (!clickTransId || !merchantTransId) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.REQUEST_ERROR.error,
        error_note: CLICK_ERRORS.REQUEST_ERROR.note,
      };
    }

    if (action !== 0) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.ACTION_NOT_FOUND.error,
        error_note: CLICK_ERRORS.ACTION_NOT_FOUND.note,
      };
    }

    // 1. Verify MD5 Signature
    if (!cfg.secretKey) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.SIGN_CHECK_FAILED.error,
        error_note: 'Server CLICK_SECRET_KEY not configured',
      };
    }

    const expectedSign = computeClickSignature({
      clickTransId: payload.click_trans_id,
      serviceId: payload.service_id,
      secretKey: cfg.secretKey,
      merchantTransId,
      amount: payload.amount,
      action: payload.action,
      signTime: payload.sign_time,
    });

    if (
      String(payload.service_id) !== cfg.serviceId ||
      expectedSign.toLowerCase() !== String(payload.sign_string || '').toLowerCase()
    ) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.SIGN_CHECK_FAILED.error,
        error_note: CLICK_ERRORS.SIGN_CHECK_FAILED.note,
      };
    }

    // 2. Lookup Payment Record
    const payment = this.repo.getPaymentById(merchantTransId);
    if (!payment || payment.status === 'EXPIRED') {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.ORDER_NOT_FOUND.error,
        error_note: CLICK_ERRORS.ORDER_NOT_FOUND.note,
      };
    }

    // 3. Check if already paid
    if (payment.status === 'PAID') {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        merchant_prepare_id: payment.merchantPrepareId || 0,
        error: CLICK_ERRORS.ALREADY_PAID.error,
        error_note: CLICK_ERRORS.ALREADY_PAID.note,
      };
    }

    if (payment.status === 'CANCELLED' || payment.status === 'FAILED') {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.TRANSACTION_CANCELLED.error,
        error_note: CLICK_ERRORS.TRANSACTION_CANCELLED.note,
      };
    }

    // 4. Verify Click Transaction Uniqueness across different orders
    const existingTxPayment = this.repo.findPaymentByProviderTxId('CLICK', clickTransId);
    if (existingTxPayment && existingTxPayment.id !== payment.id) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.REQUEST_ERROR.error,
        error_note: 'Duplicate click_trans_id for another order',
      };
    }

    // 5. Strict Amount Verification
    const numericAmount = Number(payload.amount);
    if (!Number.isFinite(numericAmount) || Math.round(numericAmount) !== payment.amount) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.INVALID_AMOUNT.error,
        error_note: CLICK_ERRORS.INVALID_AMOUNT.note,
      };
    }

    // 6. Check if Click sent an error in prepare
    if (Number(payload.error) < 0) {
      this.repo.updatePaymentStatus(payment.id, 'CANCELLED', {
        clickPrepareError: payload.error,
        clickPrepareNote: payload.error_note,
      });
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.TRANSACTION_CANCELLED.error,
        error_note: CLICK_ERRORS.TRANSACTION_CANCELLED.note,
      };
    }

    // 7. Mark Prepared (Idempotent if called multiple times for same payment + clickTransId)
    const { prepareId } = this.repo.markPaymentPrepared(payment.id, clickTransId);

    return {
      click_trans_id: clickTransId,
      merchant_trans_id: merchantTransId,
      merchant_prepare_id: prepareId,
      error: CLICK_ERRORS.SUCCESS.error,
      error_note: CLICK_ERRORS.SUCCESS.note,
    };
  }

  /**
   * Handles Click SHOP-API Complete (action = 1)
   */
  handleComplete(payload: ClickWebhookPayload): ClickWebhookResponse {
    const cfg = this.getConfig();
    const clickTransId = String(payload.click_trans_id || '');
    const merchantTransId = String(payload.merchant_trans_id || '');
    const action = Number(payload.action);

    if (!clickTransId || !merchantTransId) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.REQUEST_ERROR.error,
        error_note: CLICK_ERRORS.REQUEST_ERROR.note,
      };
    }

    if (action !== 1) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.ACTION_NOT_FOUND.error,
        error_note: CLICK_ERRORS.ACTION_NOT_FOUND.note,
      };
    }

    // 1. Verify MD5 Signature
    if (!cfg.secretKey) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.SIGN_CHECK_FAILED.error,
        error_note: 'Server CLICK_SECRET_KEY not configured',
      };
    }

    const expectedSign = computeClickSignature({
      clickTransId: payload.click_trans_id,
      serviceId: payload.service_id,
      secretKey: cfg.secretKey,
      merchantTransId,
      merchantPrepareId: payload.merchant_prepare_id,
      amount: payload.amount,
      action: payload.action,
      signTime: payload.sign_time,
    });

    if (
      String(payload.service_id) !== cfg.serviceId ||
      expectedSign.toLowerCase() !== String(payload.sign_string || '').toLowerCase()
    ) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.SIGN_CHECK_FAILED.error,
        error_note: CLICK_ERRORS.SIGN_CHECK_FAILED.note,
      };
    }

    // 2. Lookup Payment Record
    const payment = this.repo.getPaymentById(merchantTransId);
    if (!payment) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.ORDER_NOT_FOUND.error,
        error_note: CLICK_ERRORS.ORDER_NOT_FOUND.note,
      };
    }

    if (payment.status === 'EXPIRED') {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.TRANSACTION_CANCELLED.error,
        error_note: 'Payment expired',
      };
    }

    // 3. Idempotency / Duplicate Complete Check:
    // If already PAID, do NOT grant a second subscription extension; return ALREADY_PAID (-4)
    if (payment.status === 'PAID') {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        merchant_confirm_id: payment.merchantPrepareId || 0,
        error: CLICK_ERRORS.ALREADY_PAID.error,
        error_note: CLICK_ERRORS.ALREADY_PAID.note,
      };
    }

    // 4. Verify prepare ID matches what was prepared
    if (
      !payment.merchantPrepareId ||
      Number(payload.merchant_prepare_id) !== payment.merchantPrepareId
    ) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.TRANSACTION_NOT_FOUND.error,
        error_note: CLICK_ERRORS.TRANSACTION_NOT_FOUND.note,
      };
    }

    // 5. Verify Amount matches expected server amount
    const numericAmount = Number(payload.amount);
    if (!Number.isFinite(numericAmount) || Math.round(numericAmount) !== payment.amount) {
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        error: CLICK_ERRORS.INVALID_AMOUNT.error,
        error_note: CLICK_ERRORS.INVALID_AMOUNT.note,
      };
    }

    // 6. Handle Click Error / Cancellation (error < 0)
    // Failed or cancelled payment MUST NEVER activate PRO
    if (Number(payload.error) < 0) {
      const targetStatus = Number(payload.error) === -9 ? 'CANCELLED' : 'FAILED';
      this.repo.updatePaymentStatus(payment.id, targetStatus, {
        clickCompleteError: payload.error,
        clickCompleteNote: payload.error_note,
      });
      return {
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        merchant_confirm_id: payment.merchantPrepareId,
        error: CLICK_ERRORS.TRANSACTION_CANCELLED.error,
        error_note: CLICK_ERRORS.TRANSACTION_CANCELLED.note,
      };
    }

    // 7. Mark Payment PAID and Activate User PRO Subscription
    this.repo.updatePaymentStatus(payment.id, 'PAID', {
      clickPaydocId: payload.click_paydoc_id,
      completedAt: new Date().toISOString(),
    });

    this.repo.activateUserProSubscription(payment.userId, payment.plan);

    return {
      click_trans_id: clickTransId,
      merchant_trans_id: merchantTransId,
      merchant_confirm_id: payment.merchantPrepareId,
      error: CLICK_ERRORS.SUCCESS.error,
      error_note: CLICK_ERRORS.SUCCESS.note,
    };
  }
}

/**
 * Payme Provider Skeleton implementing PaymentProvider interface
 * Ready for future Payme Merchant API (CheckPerformTransaction, CreateTransaction, PerformTransaction)
 */
export class PaymePaymentProvider implements PaymentProvider {
  readonly providerName = 'PAYME' as const;

  isConfigured(): boolean {
    return Boolean(process.env.PAYME_MERCHANT_ID && process.env.PAYME_SECRET_KEY);
  }

  createPaymentSession(
    _input: CreatePaymentSessionInput,
    payment: PaymentRecord
  ): CreatePaymentSessionResult {
    return {
      payment,
      configured: false,
      testMode: true,
      paymentUrl: null,
      message: 'Payme integratsiyasi keyingi bosqichda ulanadi. Hozircha Click orqali to‘lov faol.',
    };
  }
}
