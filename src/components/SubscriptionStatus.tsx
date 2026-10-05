import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Shield } from 'lucide-react';
import { PlanType, SubscriptionStatusType } from '../types/subscription';

interface SubscriptionStatusProps {
  plan: PlanType;
  status: SubscriptionStatusType;
  subscriptionEnd?: string | null;
  compact?: boolean;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  plan,
  status,
  subscriptionEnd,
  compact = false,
}) => {
  const isPro = (plan === 'PRO_MONTHLY' || plan === 'PRO_YEARLY') && status === 'ACTIVE';

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-bold tracking-wide whitespace-nowrap ${
          isPro
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400'
        }`}
      >
        {isPro ? 'PRO ACTIVE' : 'FREE'}
      </span>
    );
  }

  const planLabel =
    plan === 'PRO_YEARLY'
      ? 'PRO YEARLY (149 000 so‘m / yil)'
      : plan === 'PRO_MONTHLY'
      ? 'PRO MONTHLY (19 000 so‘m / oy)'
      : 'FREE (0 so‘m)';

  const statusConfig = {
    ACTIVE: {
      label: isPro ? 'PRO ACTIVE — Faol obuna' : 'Faol (Bepul tarif)',
      icon: CheckCircle2,
      color: isPro
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-slate-600 dark:text-slate-300',
    },
    EXPIRED: {
      label: 'Muddati tugagan (Avtomatik FREE holatiga qaytarilgan)',
      icon: AlertCircle,
      color: 'text-amber-600 dark:text-amber-400',
    },
    CANCELLED: {
      label: 'Bekor qilingan',
      icon: AlertCircle,
      color: 'text-rose-600 dark:text-rose-400',
    },
    PENDING: {
      label: 'To‘lov kutilmoqda',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Joriy tarif rejasi</div>
            <div className="text-base font-bold text-slate-900 dark:text-white">{planLabel}</div>
          </div>
        </div>

        {isPro ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PRO ACTIVE</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
            <span>FREE TARIF</span>
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 block">Obuna holati:</span>
          <span className={`mt-1 inline-flex items-center gap-1.5 font-semibold ${statusConfig.color}`}>
            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{statusConfig.label}</span>
          </span>
        </div>

        <div>
          <span className="text-slate-500 dark:text-slate-400 block">Obuna tugash sanasi:</span>
          <span className="mt-1 font-mono font-medium text-slate-900 dark:text-slate-100 block tabular-nums">
            {subscriptionEnd
              ? new Date(subscriptionEnd).toLocaleDateString('uz-UZ')
              : 'Muddatsiz (FREE)'}
          </span>
        </div>
      </div>
    </div>
  );
};
