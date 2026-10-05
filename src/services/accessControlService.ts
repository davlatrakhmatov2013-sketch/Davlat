import { PlanType, SubscriptionStatusType, UserProfile } from '../types/subscription';
import { SOFTWARE_CATALOG } from '../data/softwareData';

export interface AuthorizationCheckResult {
  allowed: boolean;
  reason?: 'NOT_AUTHENTICATED' | 'SUBSCRIPTION_EXPIRED' | 'UPGRADE_REQUIRED';
  effectivePlan: PlanType;
  effectiveStatus: SubscriptionStatusType;
  message: string;
}

/**
 * Server-side & Client-side Access Control Guard Structure.
 * Can be imported directly in Express/Node API routes (e.g. /api/pro-content/:appId)
 * as well as frontend guards to verify subscription validity and expiration.
 */
export function verifyProContentAccess(
  user: Pick<UserProfile, 'userId' | 'plan' | 'subscriptionStatus' | 'subscriptionEnd'> | null,
  appId?: string
): AuthorizationCheckResult {
  const targetApp = appId ? SOFTWARE_CATALOG.find((a) => a.id === appId) : null;

  // Non-premium apps are always accessible to everyone
  if (targetApp && !targetApp.isPremium) {
    return {
      allowed: true,
      effectivePlan: user?.plan || 'FREE',
      effectiveStatus: user?.subscriptionStatus || 'ACTIVE',
      message: 'Bepul dastur tafsilotlari barcha uchun ochiq.',
    };
  }

  if (!user) {
    return {
      allowed: false,
      reason: 'NOT_AUTHENTICATED',
      effectivePlan: 'FREE',
      effectiveStatus: 'EXPIRED',
      message: 'Premium kontentni ochish uchun tizimga kiring va PRO tarifiga o‘ting.',
    };
  }

  // Check expiration timestamp
  if (user.subscriptionEnd) {
    const endMs = new Date(user.subscriptionEnd).getTime();
    if (Date.now() > endMs) {
      return {
        allowed: false,
        reason: 'SUBSCRIPTION_EXPIRED',
        effectivePlan: 'FREE',
        effectiveStatus: 'EXPIRED',
        message: 'PRO obuna muddati tugagan. Avtomatik ravishda FREE holatiga qaytarildi.',
      };
    }
  }

  const isProActive =
    (user.plan === 'PRO_MONTHLY' || user.plan === 'PRO_YEARLY') &&
    user.subscriptionStatus === 'ACTIVE';

  if (!isProActive) {
    return {
      allowed: false,
      reason: 'UPGRADE_REQUIRED',
      effectivePlan: user.plan,
      effectiveStatus: user.subscriptionStatus,
      message: 'Ushbu Premium imkoniyat faqat PRO obunachilar uchun ochiq.',
    };
  }

  return {
    allowed: true,
    effectivePlan: user.plan,
    effectiveStatus: 'ACTIVE',
    message: 'PRO ruxsat tasdiqlandi.',
  };
}
