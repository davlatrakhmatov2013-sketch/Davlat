export type PlanType = 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY';

export type SubscriptionStatusType = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  plan: PlanType;
  subscriptionStatus: SubscriptionStatusType;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  savedAppIds: string[];
  isDemoSession: boolean;
}

export interface PricingTier {
  id: PlanType;
  name: string;
  priceFormatted: string;
  priceAmount: number;
  billingPeriod: string;
  badge?: string;
  savingsNote?: string;
  description: string;
  features: string[];
  isRecommended?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'FREE',
    name: 'FREE',
    priceFormatted: '0 so‘m',
    priceAmount: 0,
    billingPeriod: 'Doimiy bepul',
    description: 'Asosiy dasturlarni qidirish va rasmiy manbalarga o‘tish uchun.',
    features: [
      '161+ dastur katalogi',
      'Qidiruv tizimi',
      '12 ta asosiy kategoriyalar',
      'Dastur tafsilotlari',
      'Rasmiy yuklab olish havolalari',
      'Reklama ko‘rsatilishi mumkin',
    ],
  },
  {
    id: 'PRO_MONTHLY',
    name: 'PRO MONTHLY',
    priceFormatted: '19 000 so‘m / oy',
    priceAmount: 19000,
    billingPeriod: 'Har oy yangilanadi',
    description: 'Barcha PRO imkoniyatlardan oylik moslashuvchan foydalanish.',
    features: [
      'Reklamasiz foydalanish',
      'Premium dasturlar va Premium kontentga kirish',
      'Kengaytirilgan filtrlar',
      'Dasturlarni taqqoslash',
      'AI dastur tavsiyasi',
      'Saqlangan dasturlar ro‘yxati',
      'Yangi dasturlar haqida bildirishnomalar',
    ],
  },
  {
    id: 'PRO_YEARLY',
    name: 'PRO YEARLY',
    priceFormatted: '149 000 so‘m / yil',
    priceAmount: 149000,
    billingPeriod: 'Yillik to‘lov',
    badge: 'ENG MASHHUR',
    savingsNote: 'Eng foydali · 2 oy tejaysiz (79 000 so‘m tejamkorlik)',
    description: 'Doimiy foydalanuvchilar va mutaxassislar uchun eng tavsiya etiladigan yillik tarif.',
    features: [
      'Barcha PRO funksiyalar to‘liq ochiq',
      'Reklamasiz toza interfeys',
      'Premium dasturlar va maxsus tahlillarga kirish',
      'Dasturlarni yonma-yon taqqoslash',
      'Cheksiz saqlangan dasturlar',
      'Yangi versiyalar haqida tezkor bildirishnomalar',
      '2 oydan ortiq mablag‘ni tejash imkoniyati',
    ],
    isRecommended: true,
  },
];

/**
 * Checks whether a user's subscription has expired and automatically downgrades to FREE if needed.
 */
export function evaluateUserSubscription(user: UserProfile): UserProfile {
  if (user.plan === 'FREE') {
    return user;
  }

  if (user.subscriptionEnd) {
    const endTimestamp = new Date(user.subscriptionEnd).getTime();
    const nowTimestamp = Date.now();

    if (nowTimestamp > endTimestamp) {
      return {
        ...user,
        plan: 'FREE',
        subscriptionStatus: 'EXPIRED',
      };
    }
  }

  return user;
}

/**
 * Returns true if the user currently holds an active PRO subscription.
 */
export function hasProAccess(user: UserProfile | null): boolean {
  if (!user) return false;
  const evaluated = evaluateUserSubscription(user);
  return (
    (evaluated.plan === 'PRO_MONTHLY' || evaluated.plan === 'PRO_YEARLY') &&
    evaluated.subscriptionStatus === 'ACTIVE'
  );
}
