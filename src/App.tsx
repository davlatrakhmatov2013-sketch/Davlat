import React, { useState, useMemo, useEffect, Suspense } from 'react';
import {
  Search,
  Sun,
  Moon,
  X,
  CheckCircle2,
  ExternalLink,
  SlidersHorizontal,
  RotateCcw,
  ArrowRight,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Sparkles,
  Bookmark,
  Monitor,
  Music,
  Menu,
} from 'lucide-react';
import {
  CATEGORIES,
  SOFTWARE_CATALOG,
  SoftwareApp,
  SoftwareCategory,
} from './data/softwareData';
import { PlanType, UserProfile, hasProAccess } from './types/subscription';
import { authService } from './services/authService';
import { SoftwareCard } from './components/SoftwareCard';
import { AppDetailsModal } from './components/AppDetailsModal';
import { SafetySection } from './components/SafetySection';
import { InfoModal, InfoModalType } from './components/InfoModal';
import { Pricing } from './components/Pricing';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Profile } from './components/Profile';
import { Payment } from './components/Payment';
import { PaymentResult } from './components/PaymentResult';
import { UpgradeModal } from './components/UpgradeModal';
import { SubscriptionStatus } from './components/SubscriptionStatus';
import { MusicSection } from './components/MusicSection';

type RoutePath =
  | '/'
  | '/pricing'
  | '/login'
  | '/register'
  | '/profile'
  | '/payment'
  | '/payment/success'
  | '/payment/failure';
type NavTab = 'home' | 'software' | 'music' | 'categories' | 'pricing';
type QuickFilter = 'all' | 'free' | 'paid' | 'popular' | 'new' | 'premium';

const FAV_MUSIC_STORAGE_KEY = 'smart_download_fav_music_v1';

function normalizePath(pathname: string): RoutePath {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (
    clean === '/pricing' ||
    clean === '/login' ||
    clean === '/register' ||
    clean === '/profile' ||
    clean === '/payment' ||
    clean === '/payment/success' ||
    clean === '/payment/failure'
  ) {
    return clean;
  }
  return '/';
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentRoute, setCurrentRoute] = useState<RoutePath>(() =>
    normalizePath(window.location.pathname)
  );
  const [activeNav, setActiveNav] = useState<NavTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  const [favoriteTrackIds, setFavoriteTrackIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(FAV_MUSIC_STORAGE_KEY);
      return raw ? JSON.parse(raw) : ['trk-tashkent-nights', 'trk-deep-code-flow'];
    } catch {
      return ['trk-tashkent-nights'];
    }
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<SoftwareCategory | 'Barchasi'>(
    'Barchasi'
  );
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('all');

  const [selectedApp, setSelectedApp] = useState<SoftwareApp | null>(null);
  const [upgradeModalApp, setUpgradeModalApp] = useState<SoftwareApp | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [downloadConfirmApp, setDownloadConfirmApp] = useState<SoftwareApp | null>(null);
  const [infoModal, setInfoModal] = useState<InfoModalType>(null);

  const [selectedCheckoutPlan, setSelectedCheckoutPlan] =
    useState<Exclude<PlanType, 'FREE'>>('PRO_YEARLY');
  const [activePaymentId, setActivePaymentId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('paymentId') || params.get('merchant_trans_id');
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleToggleFavoriteTrack = (trackId: string) => {
    setFavoriteTrackIds((prev) => {
      const next = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      try {
        localStorage.setItem(FAV_MUSIC_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  const navigateTo = (route: RoutePath) => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (elementId: string) => {
    if (currentRoute !== '/') {
      navigateTo('/');
      setTimeout(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (tab: NavTab) => {
    setActiveNav(tab);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);

    if (tab === 'pricing') {
      navigateTo('/pricing');
      return;
    }

    if (currentRoute !== '/') {
      navigateTo('/');
    }

    if (tab === 'home' || tab === 'categories') {
      setSelectedCategory('Barchasi');
      setActiveFilter('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'software') {
      setTimeout(() => scrollToSection('catalog-section'), 40);
    } else if (tab === 'music') {
      setTimeout(() => scrollToSection('music-section'), 40);
    }
  };

  const handleSelectCategoryCard = (categoryName: SoftwareCategory) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory('Barchasi');
    } else {
      setSelectedCategory(categoryName);
      setActiveFilter('all');
      scrollToSection('catalog-section');
    }
  };

  const isProUser = hasProAccess(user);

  const handleViewAppDetails = (app: SoftwareApp) => {
    setSelectedApp(app);
  };

  const handleToggleSaveApp = (app: SoftwareApp) => {
    if (!user) {
      navigateTo('/login');
      return;
    }
    const updated = authService.toggleSavedApp(user, app.id);
    setUser(updated);
  };

  const handleSelectPricingPlan = (plan: PlanType) => {
    if (plan === 'FREE') {
      navigateTo('/');
      return;
    }
    setSelectedCheckoutPlan(plan);
    navigateTo('/payment');
  };

  const filteredApps = useMemo(() => {
    return SOFTWARE_CATALOG.filter((app) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        app.name.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query) ||
        app.developer.toLowerCase().includes(query) ||
        app.shortDescription.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'Barchasi' || app.category === selectedCategory;

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'free' && app.isFree) ||
        (activeFilter === 'paid' && !app.isFree) ||
        (activeFilter === 'popular' && app.isPopular) ||
        (activeFilter === 'new' && app.isNew) ||
        (activeFilter === 'premium' && app.isPremium);

      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [searchQuery, selectedCategory, activeFilter]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Barchasi');
    setActiveFilter('all');
    setActiveNav('home');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'Barchasi' ||
    activeFilter !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* YUQORI MENYU (Top Bar Contract: 3 Zones) */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* 1-zona: Smart Download logosi */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            Smart Download
          </a>

          {/* 2-zona: Asosiy menyu (Bosh sahifa, Dasturlar, Musiqa, Kategoriyalar, PRO) */}
          <nav
            aria-label="Asosiy menyu"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {(
              [
                { id: 'home', label: 'Bosh sahifa' },
                { id: 'software', label: 'Dasturlar' },
                { id: 'music', label: 'Musiqa' },
                { id: 'categories', label: 'Kategoriyalar' },
                { id: 'pricing', label: 'PRO' },
              ] as { id: NavTab; label: string }[]
            ).map((item) => {
              const isCurrent =
                (item.id === 'pricing' && currentRoute === '/pricing') ||
                (currentRoute === '/' && activeNav === item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                    isCurrent
                      ? 'border-blue-600 text-slate-900 dark:text-white font-semibold'
                      : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* 3-zona: Kirish / Ro‘yxatdan o‘tish / PRO bo‘lish + Rejim tugmasi */}
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigateTo('/login')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Kirish
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('/register')}
                  className="hidden lg:inline-flex px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Ro‘yxatdan o‘tish
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('/pricing')}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold text-white transition-all whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PRO bo‘lish</span>
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="max-w-[90px] truncate">{user.name}</span>
                  <SubscriptionStatus
                    plan={user.plan}
                    status={user.subscriptionStatus}
                    compact
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateTo('/profile')}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Shaxsiy profil</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('/profile')}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Saqlangan dasturlar</span>
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {user.savedAppIds.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('/pricing')}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>PRO ga o‘tish</span>
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      type="button"
                      onClick={() => {
                        authService.signOut();
                        setUser(null);
                        setUserMenuOpen(false);
                        navigateTo('/');
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Chiqish</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘i rejimga o‘tish'}
              className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* Mobil menyu tugmasi */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mobil menyuni ochish"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobil menyu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1.5">
            {(
              [
                { id: 'home', label: 'Bosh sahifa' },
                { id: 'software', label: '💻 Dasturlar' },
                { id: 'music', label: '🎵 Musiqa' },
                { id: 'categories', label: 'Kategoriyalar' },
                { id: 'pricing', label: '⭐ PRO Tariflar' },
              ] as { id: NavTab; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            {!user && (
              <button
                type="button"
                onClick={() => navigateTo('/register')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Ro‘yxatdan o‘tish
              </button>
            )}
          </div>
        )}
      </header>

      {/* ASOSIY QISM (ROUTING) */}
      <main id="top" className="flex-1">
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs text-slate-500">Yuklanmoqda...</div>
          }
        >
          {currentRoute === '/pricing' && (
            <Pricing
              user={user}
              onSelectPlan={handleSelectPricingPlan}
              onOpenInfoModal={(type) => setInfoModal(type)}
              onBackToCatalog={() => navigateTo('/')}
            />
          )}

          {currentRoute === '/login' && (
            <Login
              onSuccess={(loggedInUser) => {
                setUser(loggedInUser);
                navigateTo('/profile');
              }}
              onNavigateToRegister={() => navigateTo('/register')}
            />
          )}

          {currentRoute === '/register' && (
            <Register
              onSuccess={(registeredUser) => {
                setUser(registeredUser);
                navigateTo('/profile');
              }}
              onNavigateToLogin={() => navigateTo('/login')}
            />
          )}

          {currentRoute === '/profile' &&
            (user ? (
              <Profile
                user={user}
                onNavigateToPricing={() => navigateTo('/pricing')}
                onNavigateToLogin={() => navigateTo('/login')}
                onSignOut={() => {
                  authService.signOut();
                  setUser(null);
                  navigateTo('/');
                }}
                onRemoveSavedApp={(appId) => {
                  const updated = authService.toggleSavedApp(user, appId);
                  setUser(updated);
                }}
                onViewAppDetails={(app) => setSelectedApp(app)}
              />
            ) : (
              <Login
                onSuccess={(loggedInUser) => {
                  setUser(loggedInUser);
                  navigateTo('/profile');
                }}
                onNavigateToRegister={() => navigateTo('/register')}
              />
            ))}

          {currentRoute === '/payment' && (
            <Payment
              selectedPlan={selectedCheckoutPlan}
              user={user}
              onSelectPlanChange={(plan) => setSelectedCheckoutPlan(plan)}
              onBackToPricing={() => navigateTo('/pricing')}
              onNavigateToLogin={() => navigateTo('/login')}
              onNavigateToPaymentStatus={(paymentId) => {
                setActivePaymentId(paymentId);
                window.history.pushState(
                  {},
                  '',
                  `/payment/success?paymentId=${encodeURIComponent(paymentId)}`
                );
                setCurrentRoute('/payment/success');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {(currentRoute === '/payment/success' || currentRoute === '/payment/failure') && (
            <PaymentResult
              mode={currentRoute === '/payment/success' ? 'success' : 'failure'}
              paymentId={activePaymentId}
              onSyncUserSubscription={(sub) => {
                if (user && sub) {
                  const updated = authService.saveUserSession({
                    ...user,
                    plan: sub.plan,
                    subscriptionStatus: sub.subscriptionStatus,
                    subscriptionStart: sub.subscriptionStart,
                    subscriptionEnd: sub.subscriptionEnd,
                  });
                  setUser(updated);
                }
              }}
              onNavigateToProfile={() => navigateTo('/profile')}
              onNavigateToPricing={() => navigateTo('/pricing')}
              onNavigateToHome={() => navigateTo('/')}
            />
          )}

          {currentRoute === '/' && (
            <>
              {/* BIRINCHI KO‘RINADIGAN ASOSIY BO‘LIM: "Kategoriyalar bo‘yicha ko‘rish" */}
              <section
                id="categories-hero"
                className="relative border-b border-slate-200/80 dark:border-slate-800/80 py-12 sm:py-16"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Markazda WINDOWS belgisi, katta sarlavha va qidiruv oynasi */}
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wide">
                      <Monitor className="w-4 h-4" />
                      <span>WINDOWS 10 / 11 RASMIY DASTURLAR VA MUSIQA PORTALI</span>
                    </div>

                    <h1 className="mt-2.5 text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
                      Kategoriyalar bo‘yicha ko‘rish
                    </h1>

                    <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                      162+ kerakli Windows dasturlarini rasmiy manbadan xavfsiz yuklab oling va
                      ijod uchun litsenziyalangan musiqalarni tinglang.
                    </p>

                    {/* Qidiruv oynasi: "Kerakli dasturni qidiring..." */}
                    <div className="mt-7 max-w-2xl mx-auto">
                      <div className="relative flex items-center">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Kerakli dasturni qidiring..."
                          aria-label="Kerakli dasturni qidiring"
                          className="w-full pl-12 pr-36 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors"
                        />
                        {searchQuery ? (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            Tozalash
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => scrollToSection('catalog-section')}
                            className="hidden sm:inline-flex items-center gap-1.5 absolute right-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold text-white transition-all cursor-pointer"
                          >
                            <span>Dasturlarni ko‘rish</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Tezkor o‘tish tugmalari: Dasturlar | Musiqa | PRO */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => scrollToSection('catalog-section')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500/50 transition-colors cursor-pointer"
                      >
                        <Monitor className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>💻 162+ Windows Dasturlar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => scrollToSection('music-section')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500/50 transition-colors cursor-pointer"
                      >
                        <Music className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>🎵 Musiqa va Audio Pleyer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('/pricing')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/30 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>⭐ PRO Imkoniyatlar</span>
                      </button>
                    </div>
                  </div>

                  {/* Tanlangan kategoriyani tiklash qatori */}
                  {selectedCategory !== 'Barchasi' && (
                    <div className="mt-8 flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/30 px-4 py-2.5">
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        Tanlangan kategoriya:{' '}
                        <strong className="font-semibold text-blue-600 dark:text-blue-400">
                          {selectedCategory}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('Barchasi')}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Barcha kategoriyalarni ko‘rsatish
                      </button>
                    </div>
                  )}

                  {/* 12 ta katta kategoriya kartochkalari */}
                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {CATEGORIES.map((cat) => {
                      const count = SOFTWARE_CATALOG.filter((a) => a.category === cat.name).length;
                      const isSelected = selectedCategory === cat.name;

                      return (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => handleSelectCategoryCard(cat.name)}
                          className={`group text-left rounded-2xl border p-6 transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-slate-900 ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-3">
                              <span
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 shrink-0"
                                aria-hidden="true"
                              >
                                {cat.emoji}
                              </span>
                              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                                {count} ta dastur
                              </span>
                            </div>

                            <h2 className="mt-4 text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {cat.name}
                            </h2>

                            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                              {cat.description}
                            </p>
                          </div>

                          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <span>
                              {isSelected ? 'Tanlangan kategoriya' : 'Dasturlarni ko‘rish'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* 💻 DASTURLAR KATALOGI VA FILTRLAR */}
              <section id="catalog-section" className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* PRO Banner */}
                  {!isProUser && (
                    <div className="mb-8 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          ⭐ SMART DOWNLOAD PRO
                        </div>
                        <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                          Reklamasiz foydalanish, Premium dasturlar tahlili va shaxsiy saqlanganlar
                          ro‘yxati
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                          Oylik 19 000 so‘m yoki yillik 149 000 so‘m (2 oy tejaysiz).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigateTo('/pricing')}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>PRO ga o‘tish</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {selectedCategory === 'Barchasi'
                          ? activeFilter === 'popular'
                            ? 'Mashhur dasturlar'
                            : activeFilter === 'new'
                            ? 'Yangi qo‘shilgan dasturlar'
                            : activeFilter === 'premium'
                            ? '⭐ Premium dasturlar katalogi'
                            : activeFilter === 'free'
                            ? 'Bepul dasturlar'
                            : activeFilter === 'paid'
                            ? 'Pullik dasturlar'
                            : '💻 Mashhur va ishonchli Windows dasturlari'
                          : `${selectedCategory} — Rasmiy dasturlar ro‘yxati`}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        Jami {SOFTWARE_CATALOG.length} ta dasturdan {filteredApps.length} tasi
                        ko‘rsatilmoqda · Barcha havolalar rasmiy ishlab chiqaruvchi manbasiga
                        yo‘naltirilgan
                      </p>
                    </div>

                    {/* FILTRLAR */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Filtrlar:</span>
                      </div>

                      <div
                        className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                        role="group"
                        aria-label="Dasturlarni saralash filtrlari"
                      >
                        {(
                          [
                            { id: 'all', label: 'Barchasi' },
                            { id: 'free', label: 'Bepul' },
                            { id: 'paid', label: 'Pullik' },
                            { id: 'popular', label: 'Mashhur' },
                            { id: 'new', label: 'Yangi qo‘shilgan' },
                            { id: 'premium', label: '⭐ Premium' },
                          ] as { id: QuickFilter; label: string }[]
                        ).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveFilter(item.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                              activeFilter === item.id
                                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-2xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={resetAllFilters}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Barchasini ko‘rsatish</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dasturlar kartochkalari */}
                  {filteredApps.length > 0 ? (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredApps.map((app) => (
                        <SoftwareCard
                          key={app.id}
                          app={app}
                          isSaved={Boolean(user?.savedAppIds.includes(app.id))}
                          onToggleSave={handleToggleSaveApp}
                          onViewDetails={handleViewAppDetails}
                          onOfficialDownload={(targetApp) => setDownloadConfirmApp(targetApp)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center max-w-lg mx-auto">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Qidiruv bo‘yicha dastur topilmadi
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Tanlangan kategoriya yoki qidiruv so‘rovi bo‘yicha dastur topilmadi.
                        Filtrlarni tozalab, barcha dasturlarni ko‘rishingiz mumkin.
                      </p>
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Barcha dasturlarni ko‘rsatish</span>
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* 🎵 MUSIQA VA AUDIO BO‘LIMI */}
              <MusicSection
                isProUser={isProUser}
                favoriteTrackIds={favoriteTrackIds}
                onToggleFavoriteTrack={handleToggleFavoriteTrack}
                onRequireUpgrade={() => {
                  setUpgradeModalApp(null);
                  setIsUpgradeModalOpen(true);
                }}
              />

              {/* XAVFSIZLIK BO‘LIMI */}
              <SafetySection />
            </>
          )}
        </Suspense>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Smart Download
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Windows noutbuk va kompyuterlar uchun {SOFTWARE_CATALOG.length}+ ishonchli
                dasturlar katalogi va litsenziyalangan musiqa studiyasi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
              <button
                type="button"
                onClick={() => navigateTo('/pricing')}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                PRO ga o‘tish
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('music')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Musiqa
              </button>
              <button
                type="button"
                onClick={() => setInfoModal('about')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Biz haqimizda
              </button>
              <button
                type="button"
                onClick={() => setInfoModal('safety')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Xavfsizlik
              </button>
              <button
                type="button"
                onClick={() => setInfoModal('contact')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Aloqa
              </button>
              <button
                type="button"
                onClick={() => setInfoModal('privacy')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Maxfiylik siyosati
              </button>
              <button
                type="button"
                onClick={() => setInfoModal('terms')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Foydalanish shartlari
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div>© 2026 Smart Download. Barcha huquqlar himoyalangan.</div>
            <div>Rasmiy manba · Shaffof yo‘naltirish tizimi</div>
          </div>
        </div>
      </footer>

      {/* "BATAFSIL" OYNASI */}
      <AppDetailsModal
        app={selectedApp}
        isProUser={isProUser}
        onClose={() => setSelectedApp(null)}
        onOpenUpgradeModal={(app) => {
          setUpgradeModalApp(app);
          setIsUpgradeModalOpen(true);
        }}
      />

      {/* PRO UPGRADE MODAL */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        app={upgradeModalApp}
        onClose={() => {
          setIsUpgradeModalOpen(false);
          setUpgradeModalApp(null);
        }}
        onNavigateToPricing={() => navigateTo('/pricing')}
        onOpenBasicDetails={(app) => setSelectedApp(app)}
      />

      {/* RASMIY MANBAGA O‘TISHNI TASDIQLASH OYNASI */}
      {downloadConfirmApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setDownloadConfirmApp(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDownloadConfirmApp(null)}
              aria-label="Oynani yopish"
              className="absolute top-4 right-4 inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Rasmiy manbaga yo‘naltirish</span>
            </div>

            <h3 className="mt-2 text-lg font-bold tracking-tight">
              {downloadConfirmApp.name} — Rasmiy yuklab olish
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Smart Download dastur o‘rnatuvchilarini o‘z serverida saqlamaydi. Siz{' '}
              <strong className="font-semibold text-slate-900 dark:text-white">
                {downloadConfirmApp.developer}
              </strong>{' '}
              tomonidan boshqariladigan rasmiy sahifaga yo‘naltirilmoqdasiz.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3.5 space-y-1.5 text-xs">
              <div className="text-slate-500 dark:text-slate-400">Rasmiy manzil:</div>
              <div className="font-mono text-blue-600 dark:text-blue-400 break-all">
                {downloadConfirmApp.officialDownloadUrl}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Windows uchun mosligi: {downloadConfirmApp.supportedWindows.join(', ')}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDownloadConfirmApp(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Bekor qilish
              </button>
              <a
                href={downloadConfirmApp.officialDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDownloadConfirmApp(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold text-white transition-all"
              >
                <span>Rasmiy saytga o‘tish</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* QO‘SHIMCHA MA’LUMOT OYNALARI */}
      <InfoModal type={infoModal} onClose={() => setInfoModal(null)} />
    </div>
  );
}
