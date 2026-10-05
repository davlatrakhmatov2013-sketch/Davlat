import React, { useState } from 'react';
import {
  CreditCard,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Calendar,
  Lock,
  ExternalLink,
  LogIn,
} from 'lucide-react';
import { PRICING_TIERS, PlanType, UserProfile } from '../types/subscription';
import {
  paymentService,
  ClickCreatePaymentApiResponse,
} from '../services/paymentService';

interface PaymentProps {
  selectedPlan: Exclude<PlanType, 'FREE'>;
  user: UserProfile | null;
  onSelectPlanChange: (plan: Exclude<PlanType, 'FREE'>) => void;
  onBackToPricing: () => void;
  onNavigateToLogin: () => void;
  onNavigateToPaymentStatus: (paymentId: string) => void;
}

export const Payment: React.FC<PaymentProps> = ({
  selectedPlan,
  user,
  onSelectPlanChange,
  onBackToPricing,
  onNavigateToLogin,
  onNavigateToPaymentStatus,
}) => {
  const [email, setEmail] = useState(user?.email || '');
  const [createdOrder, setCreatedOrder] =
    useState<ClickCreatePaymentApiResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const tierInfo =
    PRICING_TIERS.find((t) => t.id === selectedPlan) || PRICING_TIERS[2];

  const handleClickPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setCreatedOrder(null);

    if (!user) {
      setErrorMsg('To‘lovni amalga oshirish uchun avval akkauntingizga kiring.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Iltimos, buyurtma tasdig‘i uchun email manzilingizni kiriting.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await paymentService.createPayment({
        userId: user.userId,
        email: email.trim(),
        name: user.name,
        plan: selectedPlan,
      });

      setCreatedOrder(result);

      // If Click Merchant credentials are configured on server and paymentUrl is returned, redirect
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'To‘lov yaratishda xatolik yuz berdi.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackToPricing}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tariflarga qaytish</span>
        </button>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Click / Payme orqali to‘lov (Demo rejim)
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Haqiqiy Click/Payme payment gateway hali ulanmagan · Soxta to‘lov tasdiqlanmaydi
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 text-[11px] font-bold text-amber-700 dark:text-amber-300 whitespace-nowrap">
              DEMO REJIM
            </span>
          </div>

          {/* Agar foydalanuvchi login qilmagan bo'lsa */}
          {!user && (
            <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-amber-800 dark:text-amber-300">
                <strong className="font-semibold block">Avtorizatsiya talab qilinadi:</strong>
                PRO obunani foydalanuvchi hisobiga biriktirish uchun avval tizimga kiring.
              </div>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Kirish</span>
              </button>
            </div>
          )}

          {/* Tarifni almashtirish tugmalari */}
          <div className="mt-6">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Tanlangan tarif rejasi:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  onSelectPlanChange('PRO_MONTHLY');
                  setCreatedOrder(null);
                  setErrorMsg(null);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPlan === 'PRO_MONTHLY'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  PRO Monthly — 19 000 so‘m / oy
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Oylik obuna (1 oy muddatga)
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectPlanChange('PRO_YEARLY');
                  setCreatedOrder(null);
                  setErrorMsg(null);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPlan === 'PRO_YEARLY'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    PRO Yearly — 149 000 so‘m / yil
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    2 OY TEJAYSIZ
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Yillik obuna (1 yil muddatga · Eng foydali)
                </div>
              </button>
            </div>
          </div>

          {/* Buyurtma xulosasi */}
          <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5 space-y-3 text-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Buyurtma xulosasi
            </h2>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-200/70 dark:border-slate-700/70">
              <span className="text-slate-500 dark:text-slate-400">Tanlangan tarif:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedPlan === 'PRO_YEARLY'
                  ? 'PRO Yearly — 149 000 so‘m / yil'
                  : 'PRO Monthly — 19 000 so‘m / oy'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-200/70 dark:border-slate-700/70">
              <span className="text-slate-500 dark:text-slate-400">To‘lov provayderi:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Click Merchant API (UZS)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-200/70 dark:border-slate-700/70">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Billing period (Obuna davri):
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {tierInfo.billingPeriod}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 text-sm">
              <span className="font-bold text-slate-900 dark:text-white">
                Server tomonidan tasdiqlangan narx:
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {tierInfo.priceFormatted}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs font-medium text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Click orqali to‘lash formasi */}
          <form onSubmit={handleClickPay} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="payment-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Foydalanuvchi emaili
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="payment-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ism@misol.uz"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Smart Download karta ma’lumotlari yoki Click maxfiy kalitlarini frontendda
                saqlamaydi. To‘lov holati faqat Click webhook (Prepare / Complete) imzosi serverda
                tekshirilgandan keyin o‘zgaradi.
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs sm:text-sm font-semibold text-white inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isProcessing ? 'Click sessiyasi yaratilmoqda...' : 'Click orqali to‘lash'}
              </span>
            </button>
          </form>

          {/* Server javobi: Payment yozuvi yaratildi, lekin real Click env o'zgaruvchilari hali kiritilmagan bo'lsa */}
          {createdOrder && !createdOrder.paymentUrl && (
            <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-50/70 dark:bg-amber-950/30 p-5 text-slate-900 dark:text-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>Payment gateway hali ulanmagan (PENDING)</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {createdOrder.message}
              </p>
              <div className="mt-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20 p-3 font-mono text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
                <div>Payment ID: {createdOrder.paymentId}</div>
                <div>Status: {createdOrder.status} (PRO aktivlashtirilmadi)</div>
                <div>Amount: {createdOrder.amount} {createdOrder.currency}</div>
                <div>Endpoint: POST /api/payments/click/create</div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateToPaymentStatus(createdOrder.paymentId)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
                >
                  <span>To‘lov status sahifasini tekshirish (/payment/success)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Kiritilgan PRO imkoniyatlar */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
              Tanlangan tarifga kiruvchi PRO imkoniyatlar:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              {tierInfo.features.slice(0, 6).map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
