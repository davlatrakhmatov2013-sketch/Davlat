import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { authService } from '../services/authService';
import { UserProfile } from '../types/subscription';

interface LoginProps {
  onSuccess: (user: UserProfile) => void;
  onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isProdAuth = authService.isProductionAuthConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Iltimos, to‘g‘ri elektron pochta manzilini kiriting.');
      return;
    }
    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo‘lishi kerak.');
      return;
    }

    const loggedInUser = await authService.signInDemo({ email, password });
    onSuccess(loggedInUser);
  };

  const handleForgotPassword = () => {
    if (!email.trim() || !email.includes('@')) {
      setStatusMessage('Parolni tiklash uchun avval Email maydoniga manzilingizni yozing.');
      return;
    }
    setStatusMessage(
      `Parolni tiklash bo‘yicha ko‘rsatma (${email}) uchun: Haqiqiy Firebase/SMTP provayderi ulangandan so‘ng tiklash havolasi yuboriladi.`
    );
  };

  const handleGoogleLoginPlaceholder = () => {
    setStatusMessage(
      'Google OAuth 2.0 orqali kirish: Firebase Authentication yoki Google Client ID ulangandan so‘ng faollashadi.'
    );
  };

  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Akkauntga kirish
            </h1>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Saqlangan dasturlar va obuna holatini boshqarish uchun tizimga kiring.
            </p>
          </div>

          {!isProdAuth && (
            <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/30 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Arxitektura holati (Local Demo State):</strong>
                Haqiqiy Firebase Authentication serveri hali ulanmagan. Hozirgi kirish ma’lumotlari
                faqat brauzeringizda demo sessiya sifatida ishlaydi.
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-medium text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {statusMessage && (
            <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-50 dark:bg-blue-950/40 p-3 text-xs text-blue-700 dark:text-blue-300">
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ism@misol.uz"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Parol
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Parolni unutdingizmi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold text-white inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Kirish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Google orqali kirish uchun joy */}
          <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleGoogleLoginPlaceholder}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Google orqali kirish</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Akkauntingiz yo‘qmi?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Ro‘yxatdan o‘tish
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
