import React from 'react';

interface PremiumBadgeProps {
  isPremium: boolean;
  showFreeFallback?: boolean;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  isPremium,
  showFreeFallback = false,
}) => {
  if (isPremium) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wide text-amber-600 dark:text-amber-400 whitespace-nowrap">
        <span aria-hidden="true">⭐</span>
        <span>PREMIUM</span>
      </span>
    );
  }

  if (showFreeFallback) {
    return (
      <span className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
        FREE
      </span>
    );
  }

  return null;
};
