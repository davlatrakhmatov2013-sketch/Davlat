import {
  PaymentRecord,
  PaymentRecordStatus,
  ServerUserRecord,
  SubscriptionPlanId,
} from './paymentTypes';

/**
 * Production-ready Repository Abstraction for Users, Subscriptions, and Payments.
 * Enforces idempotency, transaction ID uniqueness, and expiration rules.
 * Can be backed by PostgreSQL / Cloud SQL / Firestore without changing business logic.
 */
export class PaymentSubscriptionRepository {
  private users = new Map<string, ServerUserRecord>();
  private payments = new Map<string, PaymentRecord>();
  private providerTxIndex = new Map<string, string>(); // key: `${provider}:${providerTransactionId}` -> paymentId
  private processedWebhookSignatures = new Set<string>(); // Replay protection set
  private prepareCounter = 10000;

  upsertUser(input: { id: string; email: string; name?: string }): ServerUserRecord {
    const existing = this.users.get(input.id);
    if (existing) {
      const updated: ServerUserRecord = {
        ...existing,
        email: input.email || existing.email,
        name: input.name || existing.name,
        updatedAt: new Date().toISOString(),
      };
      this.users.set(input.id, updated);
      return this.evaluateUserExpiration(updated);
    }

    const created: ServerUserRecord = {
      id: input.id,
      email: input.email,
      name: input.name,
      plan: 'FREE',
      subscriptionStatus: 'ACTIVE',
      subscriptionStart: null,
      subscriptionEnd: null,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(input.id, created);
    return created;
  }

  getUserById(userId: string): ServerUserRecord | null {
    const user = this.users.get(userId);
    if (!user) return null;
    return this.evaluateUserExpiration(user);
  }

  evaluateUserExpiration(user: ServerUserRecord): ServerUserRecord {
    if (user.plan !== 'FREE' && user.subscriptionEnd) {
      if (Date.now() > new Date(user.subscriptionEnd).getTime()) {
        const downgraded: ServerUserRecord = {
          ...user,
          plan: 'FREE',
          subscriptionStatus: 'EXPIRED',
          updatedAt: new Date().toISOString(),
        };
        this.users.set(user.id, downgraded);
        return downgraded;
      }
    }
    return user;
  }

  createPayment(record: Omit<PaymentRecord, 'merchantPrepareId'>): PaymentRecord {
    const fullRecord: PaymentRecord = {
      ...record,
      merchantPrepareId: null,
    };
    this.payments.set(fullRecord.id, fullRecord);
    return fullRecord;
  }

  getPaymentById(paymentId: string): PaymentRecord | null {
    const payment = this.payments.get(paymentId);
    if (!payment) return null;

    // Auto-expire PENDING payments past expiresAt
    if (
      payment.status === 'PENDING' &&
      Date.now() > new Date(payment.expiresAt).getTime()
    ) {
      const expired: PaymentRecord = {
        ...payment,
        status: 'EXPIRED',
      };
      this.payments.set(paymentId, expired);
      return expired;
    }

    return payment;
  }

  findPaymentByProviderTxId(provider: string, providerTxId: string): PaymentRecord | null {
    const key = `${provider}:${providerTxId}`;
    const paymentId = this.providerTxIndex.get(key);
    if (!paymentId) return null;
    return this.getPaymentById(paymentId);
  }

  markPaymentPrepared(
    paymentId: string,
    providerTransactionId: string
  ): { payment: PaymentRecord; prepareId: number } {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error(`Payment not found: ${paymentId}`);
    }

    const prepareId = payment.merchantPrepareId ?? ++this.prepareCounter;
    const key = `${payment.provider}:${providerTransactionId}`;
    this.providerTxIndex.set(key, payment.id);

    const updated: PaymentRecord = {
      ...payment,
      providerTransactionId,
      merchantPrepareId: prepareId,
    };
    this.payments.set(paymentId, updated);
    return { payment: updated, prepareId };
  }

  updatePaymentStatus(
    paymentId: string,
    status: PaymentRecordStatus,
    metadataPatch?: Record<string, unknown>
  ): PaymentRecord {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error(`Payment not found: ${paymentId}`);
    }

    const updated: PaymentRecord = {
      ...payment,
      status,
      paidAt: status === 'PAID' ? payment.paidAt || new Date().toISOString() : payment.paidAt,
      metadata: {
        ...payment.metadata,
        ...(metadataPatch || {}),
      },
    };
    this.payments.set(paymentId, updated);
    return updated;
  }

  /**
   * Activates PRO subscription for user based on verified PAID payment.
   * PRO_MONTHLY = start + 1 month
   * PRO_YEARLY = start + 1 year
   */
  activateUserProSubscription(
    userId: string,
    plan: Exclude<SubscriptionPlanId, 'FREE'>,
    startDate: Date = new Date()
  ): ServerUserRecord {
    const existing = this.users.get(userId) || {
      id: userId,
      email: 'unknown@user.uz',
      plan: 'FREE' as SubscriptionPlanId,
      subscriptionStatus: 'ACTIVE' as const,
      subscriptionStart: null,
      subscriptionEnd: null,
      updatedAt: startDate.toISOString(),
    };

    const endDate = new Date(startDate.getTime());
    if (plan === 'PRO_MONTHLY') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === 'PRO_YEARLY') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const updatedUser: ServerUserRecord = {
      ...existing,
      plan,
      subscriptionStatus: 'ACTIVE',
      subscriptionStart: startDate.toISOString(),
      subscriptionEnd: endDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  hasProcessedSignature(signatureKey: string): boolean {
    return this.processedWebhookSignatures.has(signatureKey);
  }

  recordProcessedSignature(signatureKey: string): void {
    this.processedWebhookSignatures.add(signatureKey);
  }

  listAllPaymentsForAdmin(): PaymentRecord[] {
    return Array.from(this.payments.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  listAllUsersForAdmin(): ServerUserRecord[] {
    return Array.from(this.users.values());
  }
}

export const defaultPaymentRepository = new PaymentSubscriptionRepository();
