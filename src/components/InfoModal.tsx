import React from 'react';
import { X, Shield, Lock, FileText, Mail, Info, CheckCircle2 } from 'lucide-react';

export type InfoModalType = 'about' | 'safety' | 'contact' | 'privacy' | 'terms' | null;

interface InfoModalProps {
  type: InfoModalType;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const renderContent = () => {
    switch (type) {
      case 'about':
        return {
          title: 'Biz haqimizda',
          icon: Info,
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                <strong>Smart Download</strong> — Windows noutbuk va kompyuterlar uchun ishonchli
                dasturlarni topish va ularning rasmiy yuklab olish manbalariga o‘tish imkonini
                beruvchi zamonaviy platforma.
              </p>
              <p>
                Internetda kerakli dasturni qidirganda ko‘pincha soxta reklama sahifalari yoki
                zararli qo‘shimchalar biriktirilgan fayllarga duch kelish mumkin. Smart Download
                foydalanuvchilarga faqat dastur muallifining rasmiy veb-sayti yoki rasmiy Microsoft
                Store sahifasini ko‘rsatish orqali ushbu muammoni hal qiladi.
              </p>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs mb-1.5">
                  Kelajakda kengaytirishga mos arxitektura
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Loyiha ma’lumotlar tuzilmasi keyinchalik ma’lumotlar bazasi (Database) va
                  boshqaruv paneli (Admin panel) bilan oson integratsiya qilish uchun maxsus
                  modulli shaklda ishlab chiqilgan.
                </p>
              </div>
            </div>
          ),
        };
      case 'safety':
        return {
          title: 'Xavfsizlik qoidalari',
          icon: Shield,
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Smart Download dasturlarni o‘z serverida tarqatmaydi. Foydalanuvchini imkon qadar
                dastur ishlab chiqaruvchisining rasmiy manbasiga yo‘naltiradi.
              </p>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Rasmiy manba:</strong> Barcha havolalar faqat rasmiy ishlab chiqaruvchi
                    domenlariga yo‘naltiriladi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Shaffof ma’lumot:</strong> Dasturning Windows bilan mosligi, versiyasi va
                    oxirgi tekshirilgan sanasi ochiq ko‘rsatiladi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Demo havola belgisi:</strong> Namoyish rejimidagi barcha havolalar aniq
                    ravishda &ldquo;Demo havola&rdquo; sifatida belgilangan.
                  </span>
                </li>
              </ul>
            </div>
          ),
        };
      case 'contact':
        return {
          title: 'Aloqa',
          icon: Mail,
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Yangi rasmiy dastur qo‘shish bo‘yicha takliflaringiz bormi yoki havolada xatolik
                payqadingizmi? Biz bilan bog‘laning:
              </p>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 font-mono text-xs space-y-2">
                <div>Elektron pochta: info@smartdownload.uz (Demo manzil)</div>
                <div>Xavfsizlik bo‘limi: xavfsizlik@smartdownload.uz (Demo manzil)</div>
                <div>Murojaatlarni ko‘rib chiqish vaqti: Du–Ju, 09:00 dan 18:00 gacha</div>
              </div>
            </div>
          ),
        };
      case 'privacy':
        return {
          title: 'Maxfiylik siyosati',
          icon: Lock,
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Smart Download foydalanuvchilarning shaxsiy ma’lumotlarini yashirincha yig‘maydi.
                Qidiruv so‘rovlari, tanlangan kategoriyalar hamda yorug‘/qorong‘i rejim sozlamalari
                faqat sizning brauzeringizda ishlaydi.
              </p>
              <p>
                &ldquo;Rasmiy yuklab olish&rdquo; tugmasini bosganingizda siz dastur ishlab
                chiqaruvchisining rasmiy saytiga o‘tasiz va u yerda o‘sha tashkilotning maxfiylik
                siyosati amal qiladi.
              </p>
            </div>
          ),
        };
      case 'terms':
        return {
          title: 'Foydalanish shartlari',
          icon: FileText,
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Smart Download — ma’lumot beruvchi va rasmiy manbalarga yo‘naltiruvchi katalogdir.
                Saytda keltirilgan barcha dastur nomlari va savdo belgilari ularning qonuniy
                egalariga tegishli.
              </p>
              <p>
                Biz o‘rnatish fayllarini o‘z serverimizda saqlamaymiz. Har bir dasturni o‘rnatishdan
                avval rasmiy ishlab chiqaruvchi tomonidan taqdim etilgan litsenziya shartlari bilan
                tanishib chiqing.
              </p>
            </div>
          ),
        };
    }
  };

  const content = renderContent();
  const IconComponent = content.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
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

        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <IconComponent className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">{content.title}</h2>
        </div>

        <div className="mt-5">{content.body}</div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Tushunarli
          </button>
        </div>
      </div>
    </div>
  );
};
