import React, { useEffect } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  ShieldAlert,
  Monitor,
  Calendar,
  Building2,
  Globe,
  Tag,
  Cpu,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SoftwareApp } from '../data/softwareData';
import { AppIcon } from './AppIcon';
import { PremiumBadge } from './PremiumBadge';

interface AppDetailsModalProps {
  app: SoftwareApp | null;
  isProUser: boolean;
  onClose: () => void;
  onOpenUpgradeModal: (app: SoftwareApp) => void;
}

export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({
  app,
  isProUser,
  onClose,
  onOpenUpgradeModal,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (app) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [app, onClose]);

  if (!app) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-app-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yopish tugmasi */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Oynani yopish"
          className="absolute top-5 right-5 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dastur ikonasi va nomi */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pr-10">
          <AppIcon iconType={app.iconType} accentColor={app.accentColor} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 id="modal-app-title" className="text-2xl font-bold tracking-tight">
                {app.name}
              </h2>
              <PremiumBadge isPremium={app.isPremium} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Rasmiy manba
              </span>
              <span aria-hidden="true">·</span>
              <span>{app.sourceType}</span>
              <span aria-hidden="true">·</span>
              <span>{app.licenseModel}</span>
            </div>
          </div>
        </div>

        {/* Dastur haqida asosiy ma’lumot (Barcha foydalanuvchilar uchun ochiq) */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Dastur haqida ma’lumot
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {app.fullDescription}
          </p>
        </div>

        {/* Texnik ko‘rsatkichlar */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Ishlab chiqaruvchi</div>
              <div className="font-medium text-slate-900 dark:text-slate-100">{app.developer}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Kategoriya</div>
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {app.category} · {app.licenseModel}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Windows uchun mosligi</div>
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {app.supportedWindows.join(', ')}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Tizim arxitekturasi</div>
              <div className="font-medium font-mono text-xs text-slate-900 dark:text-slate-100 mt-0.5">
                {app.architecture.join(' / ')}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Versiyasi</div>
              <div className="font-mono text-xs text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                {app.version}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Oxirgi tekshirilgan sana
              </div>
              <div className="font-mono text-xs text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                {app.lastCheckedDate}
              </div>
            </div>
          </div>
        </div>

        {/* PRO ACCESS CONTROL: Premium dasturlar uchun PRO Kontent */}
        {app.isPremium && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            {isProUser ? (
              <div className="rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/30 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                  <span>PRO Ekspert Tahlili va Sozlash Yo‘riqnomasi</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {app.proOptimizationGuide}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-slate-800/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>⭐ PREMIUM Kontent: Ekspert sozlash va taqqoslash tahlili</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Ushbu dastur bo‘yicha kengaytirilgan PRO tavsiyalarni ko‘rish uchun PRO tarifiga
                    o‘ting.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenUpgradeModal(app);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>PRO bilan ochish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Rasmiy sayt */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Rasmiy sayt manzili
              </div>
              <div className="mt-1 font-mono text-xs text-blue-600 dark:text-blue-400 break-all">
                {app.officialDownloadUrl}
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Manba tavsifi: {app.officialWebsiteLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Xavfsizlik bo‘yicha eslatma */}
        <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Xavfsizlik va manba shaffofligi</span>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {app.safetyNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">·</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/70 text-[11px] leading-normal text-slate-500 dark:text-slate-400">
            Eslatma: Smart Download dastur o‘rnatuvchilarini (installer) o‘z serverida saqlamaydi va
            hech bir dasturni mutlaq xatosiz deb kafolatlamaydi. Yuklab olishda ishlab
            chiqaruvchining rasmiy sayti hamda raqamli imzosini tekshiring.
          </p>
        </div>

        {/* Pastki tugmalar */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Yopish
          </button>
          <a
            href={app.officialDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold text-white transition-all whitespace-nowrap"
          >
            <span>Rasmiy yuklab olish</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
