import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const SafetySection: React.FC = () => {
  const pillars = [
    {
      title: 'Rasmiy manba',
      description:
        'Har bir dastur tugmasi foydalanuvchini bevosita ishlab chiqaruvchining rasmiy veb-sayti yoki rasmiy Microsoft Store sahifasiga yo‘naltiradi.',
    },
    {
      title: 'Windows bilan moslik',
      description:
        'Dasturlarning Windows 10 va Windows 11 tizimlari hamda x64 / ARM64 protsessor arxitekturalari bilan mosligi ochiq ko‘rsatiladi.',
    },
    {
      title: 'Dastur haqida batafsil ma’lumot',
      description:
        'Ishlab chiqaruvchi nomi, dastur vazifasi, litsenziya turi (bepul yoki pullik), versiyasi va oxirgi tekshirilgan sana aniq taqdim etiladi.',
    },
    {
      title: 'Yuklab olish manbasi ochiq ko‘rsatiladi',
      description:
        'Foydalanuvchi tugmani bosishidan oldin qaysi rasmiy domenga o‘tayotganini aniq ko‘radi. Biz shubhali o‘rnatuvchilarni tarqatmaymiz.',
    },
  ];

  return (
    <section
      id="safety-section"
      className="py-16 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Chap ustun: Asosiy xavfsizlik bayonoti */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Ishonchli yo‘naltirish tizimi</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Xavfsizlik — biz uchun muhim
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Smart Download dasturlarni o‘z serverida tarqatmaydi. Foydalanuvchini imkon qadar
              dastur ishlab chiqaruvchisining rasmiy manbasiga yo‘naltiradi.
            </p>
            <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <strong className="font-semibold text-slate-900 dark:text-slate-200 block mb-1">
                Mas’uliyatli xavfsizlik qoidasi
              </strong>
              Biz dastur o‘rnatuvchilarini (installer) o‘z serverimizda saqlamaymiz va hech qachon
              uchinchi tomon dasturlari bo‘yicha asossiz kafolatlar bermaymiz. Dasturni yuklab
              olgach, Windows Defender himoya tizimi hamda ishlab chiqaruvchining rasmiy raqamli
              imzosini tekshirish tavsiya etiladi.
            </div>
          </div>

          {/* O‘ng ustun: 4 ta asosiy tamoyil */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 text-base font-semibold text-slate-900 dark:text-slate-100">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      ✓
                    </span>
                    <span>{pillar.title}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
