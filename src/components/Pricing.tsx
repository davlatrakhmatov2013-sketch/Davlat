import React from 'react';
import { Check, ArrowRight, ShieldCheck, FileText, Lock, RotateCcw } from 'lucide-react';
import { PRICING_TIERS, PlanType, UserProfile, hasProAccess } from '../types/subscription';
import { InfoModalType } from './InfoModal';

interface PricingProps {
  user: UserProfile | null;
  onSelectPlan: (plan: PlanType) => void;
  onOpenInfoModal: (type: InfoModalType) => void;
  onBackToCatalog: () => void;
}

export const Pricing: React.FC<PricingProps> = ({
  user,
  onSelectPlan,
  onOpenInfoModal,
  onBackToCatalog,
}) => {
  const isUserPro = hasProAccess(user);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-bold tracking-wide text-blue-600 dark:text-blue-400">
            SMART DOWNLOAD PRO TARIF TIZIMI
          </div>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
            O‘zingizga mos tarifni tanlang
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            161+ rasmiy Windows dasturlari katalogidan bepul foydalaning yoki PRO obuna orqali
            reklamasiz muhit, kengaytirilgan filtrlar va Premium tahlillarga ega bo‘ling.
          </p>
        </div>

        {/* 3 ta Tarif Kartalari */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const isCurrentPlan = user?.plan === tier.id && user?.subscriptionStatus === 'ACTIVE';
            const isYearly = tier.id === 'PRO_YEARLY';

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  isYearly
                    ? 'border-blue-600 dark:border-blue-500 bg-white dark:bg-slate-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  {/* Yuqori qism va Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                      {tier.name}
                    </h2>
                    {tier.badge && (
                      <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-[11px] font-bold text-white tracking-wide">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  {/* Narx */}
                  <div className="mt-4">
                    <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {tier.priceFormatted}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {tier.billingPeriod}
                    </div>
                  </div>

                  {/* Tejamkorlik eslatmasi (PRO YEARLY uchun) */}
                  {tier.savingsNote && (
                    <div className="mt-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      ✓ {tier.savingsNote}
                    </div>
                  )}

                  <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {tier.description}
                  </p>

                  {/* Imkoniyatlar ro‘yxati */}
                  <ul className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Tugmasi */}
                <div className="mt-8 pt-4">
                  {tier.id === 'FREE' ? (
                    <button
                      type="button"
                      onClick={onBackToCatalog}
                      className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      {isCurrentPlan || !isUserPro
                        ? 'Katalogdan bepul foydalanish'
                        : 'Bepul katalogga qaytish'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectPlan(tier.id)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isYearly
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                      }`}
                    >
                      <span>{isCurrentPlan ? 'Joriy tarifingiz' : 'PRO ga o‘tish'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 12. TRUST / TRANSPARENCY SECTION */}
        <div className="mt-14 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  To‘lov va obuna shartlari
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Barcha narxlar O‘zbekiston so‘mida (UZS) ko‘rsatilgan. Yashirin komissiyalar yo‘q.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Obunani istalgan vaqtda bekor qilish
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Obunani shaxsiy profilingiz orqali istalgan paytda to‘xtatishingiz mumkin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Maxfiylik siyosati
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Karta raqami va CVV ma’lumotlari bizning serverimizda saqlanmaydi.{' '}
                  <button
                    type="button"
                    onClick={() => onOpenInfoModal('privacy')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Batafsil
                  </button>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Foydalanish shartlari
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Rasmiy dasturlar katalogi va obuna qoidalari bilan tanishing.{' '}
                  <button
                    type="button"
                    onClick={() => onOpenInfoModal('terms')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Ko‘rish
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
