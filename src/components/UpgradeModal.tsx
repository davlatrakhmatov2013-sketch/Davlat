import React from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { SoftwareApp } from '../data/softwareData';

interface UpgradeModalProps {
  isOpen: boolean;
  app?: SoftwareApp | null;
  onClose: () => void;
  onNavigateToPricing: () => void;
  onOpenBasicDetails?: (app: SoftwareApp) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  app,
  onClose,
  onNavigateToPricing,
  onOpenBasicDetails,
}) => {
  if (!isOpen) return null;

  const proBenefits = [
    'Reklamasiz toza va tezkor interfeys',
    'Premium dasturlar tahlili, sozlash yo‘riqnomalari va ekspert tavsiyalari',
    'Kengaytirilgan filtrlar va dasturlarni yonma-yon taqqoslash',
    'Sevimli dasturlarni shaxsiy profilga saqlab qo‘yish',
    'Yangi dasturlar va xavfsizlik yangilanishlari haqida bildirishnomalar',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          className="absolute top-5 right-5 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
          <span>⭐ PREMIUM IMKONIYAT</span>
        </div>

        <h2 id="upgrade-modal-title" className="mt-2 text-2xl font-bold tracking-tight">
          {app ? `${app.name} — Premium tahlil va PRO imkoniyatlar` : 'Smart Download PRO tarifiga o‘ting'}
        </h2>

        {app && (
          <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Asosiy ma’lumot ({app.developer} · {app.category}):
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {app.shortDescription}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Mosligi: {app.supportedWindows.join(', ')}</span>
              <span>·</span>
              <span>Litsenziya: {app.licenseModel}</span>
            </div>
          </div>
        )}

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          PRO obunachilari barcha Premium dasturlar bo‘yicha kengaytirilgan ekspert tavsiyalari,
          dasturlarni o‘zaro solishtirish va reklamasiz muhitga ega bo‘ladilar:
        </p>

        <ul className="mt-4 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
          {proBenefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/30 p-3.5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              PRO Monthly — 19 000 so‘m / oy
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              Yillik tarifda 149 000 so‘m / yil (2 oy tejaysiz)
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          {app && onOpenBasicDetails && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBasicDetails(app);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Asosiy ma’lumotga qaytish
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToPricing();
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <span>PRO bilan ochish · PRO ga o‘tish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Rasmiy yuklab olish havolalari barcha foydalanuvchilar uchun doimo ochiq.</span>
        </div>
      </div>
    </div>
  );
};
