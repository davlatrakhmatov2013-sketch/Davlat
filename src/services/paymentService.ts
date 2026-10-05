import { PlanType, SubscriptionStatusType } from '../types/subscription';

export type ServerPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

export interface CreatePaymentRequest {
  userId?: string;
  email: string;
  name?: string;
  plan: Exclude<PlanType, 'FREE'>;
}

export interface ClickCreatePaymentApiResponse {
  paymentId: string;
  status: ServerPaymentStatus;
  plan: Exclude<PlanType, 'FREE'>;
  amount: number;
  currency: 'UZS';
  provider: 'CLICK' | 'PAYME';
  configured: boolean;
  testMode: boolean;
  paymentUrl: string | null;
  message: string;
  createdAt: string;
}

export interface PaymentStatusApiResponse {
  paymentId: string;
  userId: string;
  provider: 'CLICK' | 'PAYME';
  plan: Exclude<PlanType, 'FREE'>;
  amount: number;
  currency: 'UZS';
  status: ServerPaymentStatus;
  providerTransactionId: string | null;
  createdAt: string;
  paidAt: string | null;
  expiresAt: string;
  clickConfigured: boolean;
  userSubscription: {
    plan: PlanType;
    subscriptionStatus: SubscriptionStatusType;
    subscriptionStart: string | null;
    subscriptionEnd: string | null;
  } | null;
}

/**
 * Frontend Payment Service
 * Calls backend server-side Click Merchant API endpoints.
 * NEVER handles secret keys, merchant passwords, or card numbers on the client.
 * NEVER simulates fake payment success.
 */
export const paymentService = {
  async createPayment(request: CreatePaymentRequest): Promise<ClickCreatePaymentApiResponse> {
    const response = await fetch('/api/payments/click/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: request.userId,
        email: request.email,
        name: request.name,
        plan: request.plan,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'To‘lov sessiyasini yaratishda xatolik yuz berdi.');
    }

    return data as ClickCreatePaymentApiResponse;
  },

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusApiResponse> {
    const response = await fetch(
      `/api/payments/${encodeURIComponent(paymentId)}/status`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'To‘lov holatini tekshirishda xatolik yuz berdi.');
    }

    return data as PaymentStatusApiResponse;
  },

  async verifyPayment(paymentId: string): Promise<PaymentStatusApiResponse> {
    return this.getPaymentStatus(paymentId);
  },
};
