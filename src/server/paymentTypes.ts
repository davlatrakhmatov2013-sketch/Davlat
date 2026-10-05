export type PaymentProviderName = 'CLICK' | 'PAYME';

export type PaymentRecordStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

export type SubscriptionPlanId = 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY';

export type UserSubscriptionState = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';

/**
 * Server-authoritative pricing catalog in UZS.
 * Frontend amount is NEVER trusted.
 */
export const SERVER_PLAN_PRICES_UZS: Record<Exclude<SubscriptionPlanId, 'FREE'>, number> = {
  PRO_MONTHLY: 19000,
  PRO_YEARLY: 149000,
};

export interface ServerUserRecord {
  id: string;
  email: string;
  name?: string;
  plan: SubscriptionPlanId;
  subscriptionStatus: UserSubscriptionState;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  email: string;
  provider: PaymentProviderName;
  plan: Exclude<SubscriptionPlanId, 'FREE'>;
  amount: number;
  currency: 'UZS';
  status: PaymentRecordStatus;
  providerTransactionId: string | null;
  merchantPrepareId: number | null;
  createdAt: string;
  paidAt: string | null;
  expiresAt: string;
  metadata: Record<string, unknown>;
}

export interface CreatePaymentSessionInput {
  userId: string;
  email: string;
  plan: Exclude<SubscriptionPlanId, 'FREE'>;
  returnUrlBase: string;
}

export interface CreatePaymentSessionResult {
  payment: PaymentRecord;
  configured: boolean;
  testMode: boolean;
  paymentUrl: string | null;
  message: string;
}

/**
 * Click Merchant API (SHOP-API) Prepare & Complete Payload
 * Official Click specification parameters:
 * click_trans_id, service_id, click_paydoc_id, merchant_trans_id,
 * merchant_prepare_id (in complete), amount, action, error, error_note,
 * sign_time, sign_string
 */
export interface ClickWebhookPayload {
  click_trans_id: string | number;
  service_id: string | number;
  click_paydoc_id?: string | number;
  merchant_trans_id: string; // Maps to our internal Payment.id
  merchant_prepare_id?: string | number;
  amount: string | number;
  action: string | number; // 0 = Prepare, 1 = Complete
  error: string | number; // 0 = Success, < 0 = Cancelled/Error from Click
  error_note?: string;
  sign_time: string;
  sign_string: string;
}

export interface ClickWebhookResponse {
  click_trans_id: string | number;
  merchant_trans_id: string;
  merchant_prepare_id?: number;
  merchant_confirm_id?: number;
  error: number;
  error_note: string;
}

export interface PaymentProvider {
  readonly providerName: PaymentProviderName;
  isConfigured(): boolean;
  createPaymentSession(input: CreatePaymentSessionInput, payment: PaymentRecord): CreatePaymentSessionResult;
}
