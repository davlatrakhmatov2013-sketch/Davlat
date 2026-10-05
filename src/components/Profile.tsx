import React from 'react';
import {
  User,
  Mail,
  Bookmark,
  ArrowRight,
  LogOut,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { UserProfile, hasProAccess } from '../types/subscription';
import { SOFTWARE_CATALOG, SoftwareApp } from '../data/softwareData';
import { SubscriptionStatus } from './SubscriptionStatus';
import { AppIcon } from './AppIcon';
import { PremiumBadge } from './PremiumBadge';

interface ProfileProps {
  user: UserProfile;
  onNavigateToPricing: () => void;
  onNavigateToLogin: () => void;
  onSignOut: () => void;
  onRemoveSavedApp: (appId: string) => void;
  onViewAppDetails: (app: SoftwareApp) => void;
}

export const Profile: React.FC<ProfileProps> = ({
  user,
  onNavigateToPricing,
  onSignOut,
  onRemoveSavedApp,
  onViewAppDetails,
}) => {
  const isPro = hasProAccess(user);
  const savedApps = SOFTWARE_CATALOG.filter((app) => user.savedAppIds.includes(app.id));

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          {/* Yuqori qism: Profil sarlavhasi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {user.name}
                  </h1>
                  {isPro ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-xs font-bold">
                      PRO ACTIVE
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                      FREE
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!isPro && (
                <button
                  type="button"
                  onClick={onNavigateToPricing}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <span>PRO ga o‘tish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>

          {/* Foydalanuvchi ma’lumotlari va Obuna holati */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Shaxsiy ma’lumotlar
              </h2>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Ism:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400">Tarif:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {isPro ? 'PRO' : 'FREE'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400">Foydalanuvchi ID:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                    {user.userId}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Obuna holati va muddati
              </h2>
              <SubscriptionStatus
                plan={user.plan}
                status={user.subscriptionStatus}
                subscriptionEnd={user.subscriptionEnd}
              />
            </div>
          </div>

          {/* Saqlangan dasturlar */}
          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Saqlangan dasturlar ({savedApps.length})
                </h2>
              </div>
            </div>

            {savedApps.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedApps.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-800/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <AppIcon iconType={app.iconType} accentColor={app.accentColor} size="sm" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onViewAppDetails(app)}
                            className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate cursor-pointer"
                          >
                            {app.name}
                          </button>
                          <PremiumBadge isPremium={app.isPremium} />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {app.category} · {app.developer}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={app.officialDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                      >
                        <span>Rasmiy manba</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => onRemoveSavedApp(app.id)}
                        aria-label="Ro‘yxatdan o‘chirish"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                Hozircha saqlangan dasturlar yo‘q. Katalogdagi dasturlar kartochkasidan sevimli
                dasturlaringizni saqlab qo‘yishingiz mumkin.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
