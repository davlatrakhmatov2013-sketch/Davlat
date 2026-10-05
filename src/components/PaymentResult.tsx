import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import {
  paymentService,
  PaymentStatusApiResponse,
} from '../services/paymentService';

interface PaymentResultProps {
  mode: 'success' | 'failure';
  paymentId: string | null;
  onSyncUserSubscription: (plan: PaymentStatusApiResponse['userSubscription']) => void;
  onNavigateToProfile: () => void;
  onNavigateToPricing: () => void;
  onNavigateToHome: () => void;
}

export const PaymentResult: React.FC<PaymentResultProps> = ({
  mode,
  paymentId,
  onSyncUserSubscription,
  onNavigateToProfile,
  onNavigateToPricing,
  onNavigateToHome,
}) => {
  const [statusData, setStatusData] = useState<PaymentStatusApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(paymentId));
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentStatus = async () => {
    if (!paymentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.getPaymentStatus(paymentId);
      setStatusData(result);
      if (result.status === 'PAID' && result.userSubscription) {
        onSyncUserSubscription(result.userSubscription);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Serverdan to‘lov holatini olishda xatolik yuz berdi.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentStatus();
  }, [paymentId]);

  const renderStatusCard = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <RefreshCw className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
          <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            To‘lov holati serverdan tekshirilmoqda...
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            GET /api/payments/{paymentId}/status orqali haqiqiy tasdiq olinmoqda.
          </p>
        </div>
      );
    }

    if (mode === 'failure' && !statusData) {
      return (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
            <XCircle className="w-7 h-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            To‘lov amalga oshmadi
          </h1>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            To‘lov jarayoni bekor qilindi yoki xatolik yuz berdi. Hisobingiz FREE holatida qoldi.
          </p>
        </div>
      );
    }

    if (error || !statusData) {
      return (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            To‘lov hali tasdiqlanmadi
          </h1>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {error || 'To‘lov identifikatori topilmadi yoki to‘lov hali yakunlanmagan.'}
          </p>
        </div>
      );
    }

    if (statusData.status === 'PAID') {
      return (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            PRO muvaffaqiyatli faollashtirildi
          </h1>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Click Merchant orqali to‘lovingiz server tomonidan tasdiqlandi va PRO obunangiz
            faollashtirildi.
          </p>
        </div>
      );
    }

    if (statusData.status === 'PENDING') {
      return (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            To‘lov hali tasdiqlanmadi
          </h1>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Buyurtma holati: <strong>PENDING</strong>. PRO faqat Click serveridan tasdiqlovchi
            webhook (Prepare & Complete) kelgandan so‘ng avtomatik faollashadi.
          </p>
        </div>
      );
    }

    // FAILED, CANCELLED, or EXPIRED
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
          <XCircle className="w-7 h-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          To‘lov amalga oshmadi
        </h1>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          To‘lov holati: <strong>{statusData.status}</strong>. PRO obuna faollashtirilmadi va
          hisobingiz FREE tarifida qoldi.
        </p>
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          {renderStatusCard()}

          {statusData && (
            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Payment ID:</span>
                <span className="text-slate-900 dark:text-white">{statusData.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Provider:</span>
                <span className="text-slate-900 dark:text-white">{statusData.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Plan:</span>
                <span className="text-slate-900 dark:text-white">{statusData.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="text-slate-900 dark:text-white tabular-nums">
                  {statusData.amount.toLocaleString('uz-UZ')} {statusData.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Server Status:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {statusData.status}
                </span>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {paymentId && (
              <button
                type="button"
                onClick={fetchPaymentStatus}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Statusni qayta tekshirish</span>
              </button>
            )}

            {statusData?.status === 'PAID' ? (
              <button
                type="button"
                onClick={onNavigateToProfile}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-semibold text-white cursor-pointer"
              >
                <span>Shaxsiy profilga o‘tish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onNavigateToPricing}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Tariflarga qaytish</span>
                </button>
                <button
                  type="button"
                  onClick={onNavigateToHome}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span>Bosh sahifaga</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
