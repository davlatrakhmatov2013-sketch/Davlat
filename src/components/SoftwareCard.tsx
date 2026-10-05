import React from 'react';
import { ExternalLink, CheckCircle2, Info, Monitor, Bookmark } from 'lucide-react';
import { SoftwareApp } from '../data/softwareData';
import { AppIcon } from './AppIcon';
import { PremiumBadge } from './PremiumBadge';

interface SoftwareCardProps {
  app: SoftwareApp;
  isSaved?: boolean;
  onToggleSave?: (app: SoftwareApp) => void;
  onViewDetails: (app: SoftwareApp) => void;
  onOfficialDownload: (app: SoftwareApp) => void;
}

export const SoftwareCard: React.FC<SoftwareCardProps> = ({
  app,
  isSaved = false,
  onToggleSave,
  onViewDetails,
  onOfficialDownload,
}) => {
  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-150 hover:border-blue-500/50 dark:hover:border-blue-500/50">
      <div>
        {/* Dastur ikonasi, nomi va ⭐ PREMIUM badge */}
        <div className="flex items-start gap-4">
          <AppIcon iconType={app.iconType} accentColor={app.accentColor} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                {app.name}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <PremiumBadge isPremium={app.isPremium} />
                {onToggleSave && (
                  <button
                    type="button"
                    onClick={() => onToggleSave(app)}
                    aria-label={isSaved ? 'Saqlanganlardan olib tashlash' : 'Dasturni saqlash'}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      isSaved
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                )}
              </div>
            </div>

            {/* Kategoriya, Windows 10/11 mosligi va Litsenziya */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">{app.category}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Monitor className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span>Windows 10/11</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{app.licenseModel}</span>
            </div>
          </div>
        </div>

        {/* Qisqa tavsif */}
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
          {app.shortDescription}
        </p>

        {/* Rasmiy manba belgisi va Ishlab chiqaruvchi */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Rasmiy manba</span>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
              ·
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-normal truncate">
              {app.developer}
            </span>
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate tabular-nums">
            Manba: {app.officialWebsiteLabel}
          </div>
        </div>
      </div>

      {/* Tugmalar: Batafsil va Rasmiy yuklab olish */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onViewDetails(app)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Batafsil</span>
        </button>

        <button
          type="button"
          onClick={() => onOfficialDownload(app)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3.5 py-2 text-xs font-semibold text-white transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span>Rasmiy yuklab olish</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </article>
  );
};
