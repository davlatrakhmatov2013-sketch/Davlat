export type SoftwareCategory =
  | 'Ofis dasturlari'
  | 'Brauzerlar'
  | 'Dizayn'
  | 'Video montaj'
  | 'Dasturlash'
  | 'Xavfsizlik'
  | 'Musiqa va audio'
  | 'Ta’lim'
  | 'Kompyuter uchun foydali dasturlar'
  | 'Aloqa'
  | 'O‘yinlar'
  | 'Fayllar bilan ishlash';

export type LicenseModel = 'Bepul' | 'Bepul / Ochiq kodli' | 'Bepul va pullik rejalar' | 'Pullik';

export interface CategoryInfo {
  name: SoftwareCategory;
  emoji: string;
  description: string;
  accentColor: string;
}

/**
 * Admin-ready Software Application Schema
 * Includes all required fields: id, name, developer, description, category, platform,
 * license, officialUrl, downloadUrl, isPremium, logo, rating + existing fields.
 */
export interface SoftwareApp {
  id: string;
  name: string;
  developer: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  category: SoftwareCategory;
  platform: 'Windows';
  license: LicenseModel;
  licenseModel: LicenseModel;
  officialUrl: string;
  downloadUrl: string;
  officialDownloadUrl: string;
  officialWebsiteLabel: string;
  isPremium: boolean;
  logo: string;
  iconType: string;
  rating: number;
  supportedWindows: string[];
  architecture: string[];
  isFree: boolean;
  isPopular: boolean;
  isNew: boolean;
  version: string;
  lastCheckedDate: string;
  sourceType: 'Ishlab chiqaruvchining rasmiy sayti' | 'Rasmiy Microsoft Store sahifasi';
  safetyNotes: string[];
  accentColor: string;
  proOptimizationGuide?: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'Ofis dasturlari',
    emoji: '💻',
    description: 'Matn muharrirlari, elektron jadvallar, taqdimotlar va PDF hujjatlar bilan ishlash.',
    accentColor: '#16A34A',
  },
  {
    name: 'Brauzerlar',
    emoji: '🌐',
    description: 'Internetda tez, xavfsiz va qulay ishlash uchun zamonaviy veb-brauzerlar.',
    accentColor: '#2563EB',
  },
  {
    name: 'Dizayn',
    emoji: '🎨',
    description: 'Fotosuratlarni qayta ishlash, vektor grafikasi va 3D modellashtirish dasturlari.',
    accentColor: '#7C3AED',
  },
  {
    name: 'Video montaj',
    emoji: '🎬',
    description: 'Professional video tahrirlash, ekran yozib olish va jonli efir uzatish vositalari.',
    accentColor: '#0284C7',
  },
  {
    name: 'Dasturlash',
    emoji: '💻',
    description: 'Kod muharrirlari, interpretatorlar, versiyalarni boshqarish va dasturchi asboblari.',
    accentColor: '#4F46E5',
  },
  {
    name: 'Xavfsizlik',
    emoji: '🛡️',
    description: 'Parol menejerlari, shifrlash vositalari va tizim xavfsizligini himoyalash dasturlari.',
    accentColor: '#0D9488',
  },
  {
    name: 'Musiqa va audio',
    emoji: '🎵',
    description: 'Musiqa tinglash, audio yozib olish, tahrirlash va universal media pleyerlar.',
    accentColor: '#EA580C',
  },
  {
    name: 'Ta’lim',
    emoji: '📚',
    description: 'Chet tillarini o‘rganish, ilmiy adabiyotlar va xotirani mustahkamlash dasturlari.',
    accentColor: '#6366F1',
  },
  {
    name: 'Kompyuter uchun foydali dasturlar',
    emoji: '🧰',
    description: 'Tizim unumdorligini oshirish, oynalarni boshqarish va texnik yordamchi vositalar.',
    accentColor: '#0284C7',
  },
  {
    name: 'Aloqa',
    emoji: '💬',
    description: 'Tezkor xabar almashish, guruhli video muloqot va jamoaviy suhbat dasturlari.',
    accentColor: '#2563EB',
  },
  {
    name: 'O‘yinlar',
    emoji: '🎮',
    description: 'Windows kompyuterlari uchun rasmiy o‘yin kataloglari va o‘yin platformalari.',
    accentColor: '#7C3AED',
  },
  {
    name: 'Fayllar bilan ishlash',
    emoji: '📁',
    description: 'Fayllarni arxivlash, siqish, qidirish va tezkor nusxalash dasturlari.',
    accentColor: '#D97706',
  },
];

interface CompactSeedItem {
  id: string;
  name: string;
  dev: string;
  cat: SoftwareCategory;
  short: string;
  url: string;
  lic: LicenseModel;
  ver: string;
  isPop?: boolean;
  isNew?: boolean;
  isPrem?: boolean;
  icon: string;
  color: string;
  rating: number;
}

const COMPACT_SEEDS: CompactSeedItem[] = [
  // 1. BRAUZERLAR (14)
  { id: 'google-chrome', name: 'Google Chrome', dev: 'Google LLC', cat: 'Brauzerlar', short: 'Zamonaviy veb-ilovalar va yuqori tezlikda ishlash uchun mo‘ljallangan mashhur veb-brauzer.', url: 'https://www.google.com/chrome/', lic: 'Bepul', ver: '130.0.6723.70', isPop: true, icon: 'chrome', color: '#2563EB', rating: 4.9 },
  { id: 'mozilla-firefox', name: 'Mozilla Firefox', dev: 'Mozilla Foundation', cat: 'Brauzerlar', short: 'Foydalanuvchi maxfiyligini himoya qiluvchi mustaqil va ochiq kodli veb-brauzer.', url: 'https://www.mozilla.org/firefox/new/', lic: 'Bepul / Ochiq kodli', ver: '132.0', isPop: true, icon: 'firefox', color: '#EA580C', rating: 4.8 },
  { id: 'microsoft-edge', name: 'Microsoft Edge', dev: 'Microsoft Corporation', cat: 'Brauzerlar', short: 'Windows 10 va Windows 11 tizimlari bilan chuqur integratsiyalashgan tejamkor brauzer.', url: 'https://www.microsoft.com/edge', lic: 'Bepul', ver: '130.0.2849.56', isPop: true, icon: 'edge', color: '#0284C7', rating: 4.7 },
  { id: 'brave-browser', name: 'Brave Browser', dev: 'Brave Software Inc.', cat: 'Brauzerlar', short: 'Reklama va trekerlarni avtomatik bloklovchi maxfiylikka yo‘naltirilgan brauzer.', url: 'https://brave.com/download/', lic: 'Bepul / Ochiq kodli', ver: '1.71.114', isPop: true, isPrem: true, icon: 'chrome', color: '#EA580C', rating: 4.8 },
  { id: 'opera-browser', name: 'Opera Browser', dev: 'Opera Norway AS', cat: 'Brauzerlar', short: 'Ichki messenjerlar paneli va quvvat tejash rejimiga ega tezkor veb-brauzer.', url: 'https://www.opera.com/download', lic: 'Bepul', ver: '114.0.5282.115', icon: 'chrome', color: '#DC2626', rating: 4.6 },
  { id: 'opera-gx', name: 'Opera GX', dev: 'Opera Norway AS', cat: 'Brauzerlar', short: 'Geymerlar uchun RAM va protsessor sarfini cheklash funksiyasiga ega maxsus brauzer.', url: 'https://www.opera.com/gx', lic: 'Bepul', ver: '114.0', isNew: true, isPrem: true, icon: 'chrome', color: '#7C3AED', rating: 4.7 },
  { id: 'vivaldi-browser', name: 'Vivaldi', dev: 'Vivaldi Technologies', cat: 'Brauzerlar', short: 'Keng moslashtiriladigan interfeys va oynalarni guruhlash tizimiga ega brauzer.', url: 'https://vivaldi.com/download/', lic: 'Bepul', ver: '7.0.3495.6', isNew: true, icon: 'compass', color: '#E11D48', rating: 4.7 },
  { id: 'tor-browser', name: 'Tor Browser', dev: 'The Tor Project', cat: 'Brauzerlar', short: 'Anonim internet aloqasi va shifrlangan tarmoq trafigini ta’minlovchi himoyalangan brauzer.', url: 'https://www.torproject.org/download/', lic: 'Bepul / Ochiq kodli', ver: '14.0', isPrem: true, icon: 'firefox', color: '#7C3AED', rating: 4.8 },
  { id: 'librewolf', name: 'LibreWolf', dev: 'LibreWolf Community', cat: 'Brauzerlar', short: 'Telemetriyasiz va kuchaytirilgan maxfiylik sozlamalariga ega mustaqil Firefox talqini.', url: 'https://librewolf.net/installation/windows/', lic: 'Bepul / Ochiq kodli', ver: '132.0.1', icon: 'firefox', color: '#0284C7', rating: 4.7 },
  { id: 'waterfox', name: 'Waterfox', dev: 'BrowserWorks', cat: 'Brauzerlar', short: '64-bitli Windows tizimlari uchun tezlik va muvozanatga moslashtirilgan ochiq kodli brauzer.', url: 'https://www.waterfox.net/download/', lic: 'Bepul / Ochiq kodli', ver: 'G6.0.20', icon: 'firefox', color: '#2563EB', rating: 4.5 },
  { id: 'arc-windows', name: 'Arc for Windows', dev: 'The Browser Company', cat: 'Brauzerlar', short: 'Ish maydonlari (Spaces) va vertikal yon panelga ega yangi avlod ishchi brauzeri.', url: 'https://arc.net/', lic: 'Bepul', ver: '1.25.0', isNew: true, isPrem: true, icon: 'compass', color: '#4F46E5', rating: 4.6 },
  { id: 'duckduckgo-windows', name: 'DuckDuckGo Windows Browser', dev: 'DuckDuckGo Inc.', cat: 'Brauzerlar', short: 'Kuzatuvchilardan himoyalangan qidiruv va o‘rnatilgan Duck Player video pleyeriga ega brauzer.', url: 'https://duckduckgo.com/windows', lic: 'Bepul', ver: '0.92.1', isNew: true, icon: 'chrome', color: '#EA580C', rating: 4.6 },
  { id: 'floorp-browser', name: 'Floorp Browser', dev: 'Ablaze Community', cat: 'Brauzerlar', short: 'Yaponiya dasturchilari tomonidan Firefox asosida yaratilgan ikki panelli qulay brauzer.', url: 'https://floorp.app/en/download', lic: 'Bepul / Ochiq kodli', ver: '11.19.1', icon: 'compass', color: '#0284C7', rating: 4.7 },
  { id: 'pale-moon', name: 'Pale Moon', dev: 'Moonchild Productions', cat: 'Brauzerlar', short: 'Goanna dvigateli asosida ishlovchi, klassik interfeys va kam resurs talab qiluvchi brauzer.', url: 'https://www.palemoon.org/download.shtml', lic: 'Bepul / Ochiq kodli', ver: '33.4.0', icon: 'chrome', color: '#2563EB', rating: 4.4 },

  // 2. OFIS DASTURLARI (14)
  { id: 'libreoffice', name: 'LibreOffice', dev: 'The Document Foundation', cat: 'Ofis dasturlari', short: 'Matn, elektron jadval va taqdimotlar tayyorlash uchun to‘liq bepul ofis dasturlari to‘plami.', url: 'https://www.libreoffice.org/download/download-libreoffice/', lic: 'Bepul / Ochiq kodli', ver: '24.8.2', isPop: true, icon: 'libreoffice', color: '#16A34A', rating: 4.8 },
  { id: 'onlyoffice-desktop', name: 'ONLYOFFICE Desktop Editors', dev: 'Ascensio System SIA', cat: 'Ofis dasturlari', short: 'DOCX, XLSX va PPTX formatlari bilan yuqori moslikda ishlovchi zamonaviy ofis paketi.', url: 'https://www.onlyoffice.com/en/download-desktop.aspx', lic: 'Bepul / Ochiq kodli', ver: '8.2.0', isPop: true, isPrem: true, icon: 'libreoffice', color: '#EA580C', rating: 4.8 },
  { id: 'wps-office', name: 'WPS Office', dev: 'Kingsoft Office Software', cat: 'Ofis dasturlari', short: 'Yengil hajmli matn muharriri, jadval, taqdimot va PDF vositalarini birlashtirgan ofis dasturi.', url: 'https://www.wps.com/download/', lic: 'Bepul va pullik rejalar', ver: '12.2.0', icon: 'libreoffice', color: '#E11D48', rating: 4.6 },
  { id: 'apache-openoffice', name: 'Apache OpenOffice', dev: 'Apache Software Foundation', cat: 'Ofis dasturlari', short: 'Hujjatlar, jadvallar va ma’lumotlar bazalari bilan ishlash uchun klassik ochiq kodli paket.', url: 'https://www.openoffice.org/download/', lic: 'Bepul / Ochiq kodli', ver: '4.1.15', icon: 'libreoffice', color: '#0284C7', rating: 4.5 },
  { id: 'sumatra-pdf', name: 'Sumatra PDF', dev: 'Krzysztof Kowalczyk', cat: 'Ofis dasturlari', short: 'Windows uchun juda tez ochiluvchi, yengil PDF, ePub, MOBI va DjVu o‘quvchi dastur.', url: 'https://www.sumatrapdfreader.org/download-free-pdf-viewer', lic: 'Bepul / Ochiq kodli', ver: '3.5.2', isPop: true, icon: 'libreoffice', color: '#D97706', rating: 4.9 },
  { id: 'adobe-acrobat-reader', name: 'Adobe Acrobat Reader', dev: 'Adobe Inc.', cat: 'Ofis dasturlari', short: 'PDF hujjatlarni ko‘rish, izoh qoldirish, imzolash va chop etish uchun rasmiy standart dastur.', url: 'https://get.adobe.com/reader/', lic: 'Bepul va pullik rejalar', ver: '2024.003', isPrem: true, icon: 'libreoffice', color: '#DC2626', rating: 4.7 },
  { id: 'foxit-pdf-reader', name: 'Foxit PDF Reader', dev: 'Foxit Software Inc.', cat: 'Ofis dasturlari', short: 'Korporativ darajadagi PDF hujjatlarni o‘qish, shakllarni to‘ldirish va raqamli imzolash dasturi.', url: 'https://www.foxit.com/pdf-reader/', lic: 'Bepul va pullik rejalar', ver: '2024.3', icon: 'libreoffice', color: '#EA580C', rating: 4.6 },
  { id: 'pdf24-creator', name: 'PDF24 Creator', dev: 'geek Software GmbH', cat: 'Ofis dasturlari', short: 'PDF fayllarni birlashtirish, bo‘lish, siqish va konvertatsiya qilish uchun bepul vositalar to‘plami.', url: 'https://tools.pdf24.org/en/creator', lic: 'Bepul', ver: '11.20.1', isNew: true, isPrem: true, icon: 'libreoffice', color: '#2563EB', rating: 4.9 },
  { id: 'notion-windows', name: 'Notion Desktop', dev: 'Notion Labs Inc.', cat: 'Ofis dasturlari', short: 'Qaydlar, vazifalar, loyihalar boshqaruvi va jamoaviy bilimlar bazasi uchun yagona ish maydoni.', url: 'https://www.notion.so/desktop', lic: 'Bepul va pullik rejalar', ver: '3.14.0', isPop: true, isPrem: true, icon: 'libreoffice', color: '#4F46E5', rating: 4.8 },
  { id: 'obsidian-md', name: 'Obsidian', dev: 'Dynalist Inc.', cat: 'Ofis dasturlari', short: 'Markdown fayllar asosida shaxsiy bilimlar bazasi va o‘zaro bog‘langan qaydlar yaratish dasturi.', url: 'https://obsidian.md/download', lic: 'Bepul va pullik rejalar', ver: '1.7.4', isNew: true, isPrem: true, icon: 'libreoffice', color: '#7C3AED', rating: 4.9 },
  { id: 'joplin-notes', name: 'Joplin', dev: 'Laurent Cozic & Community', cat: 'Ofis dasturlari', short: 'Shifrlangan sinxronizatsiyaga ega ochiq kodli qaydlar va vazifalar ro‘yxati dasturi.', url: 'https://joplinapp.org/help/install/', lic: 'Bepul / Ochiq kodli', ver: '3.1.20', icon: 'libreoffice', color: '#2563EB', rating: 4.7 },
  { id: 'logseq', name: 'Logseq', dev: 'Logseq Inc.', cat: 'Ofis dasturlari', short: 'Maxfiylikni birinchi o‘ringa qo‘yuvchi mahalliy bilimlar grafigi va kundalik rejalashtiruvchi.', url: 'https://logseq.com/downloads', lic: 'Bepul / Ochiq kodli', ver: '0.10.9', icon: 'libreoffice', color: '#0D9488', rating: 4.7 },
  { id: 'calibre-ebook', name: 'Calibre', dev: 'Kovid Goyal', cat: 'Ofis dasturlari', short: 'Elektron kitoblarni boshqarish, o‘qish va EPUB, MOBI, PDF formatlariga o‘girish dasturi.', url: 'https://calibre-ebook.com/download_windows', lic: 'Bepul / Ochiq kodli', ver: '7.20.0', icon: 'libreoffice', color: '#16A34A', rating: 4.8 },
  { id: 'scribus-dtp', name: 'Scribus', dev: 'The Scribus Team', cat: 'Ofis dasturlari', short: 'Kitoblar, jurnallar va bosma nashrlarni sahifalash (Desktop Publishing) uchun ochiq kodli dastur.', url: 'https://www.scribus.net/downloads/', lic: 'Bepul / Ochiq kodli', ver: '1.6.2', icon: 'libreoffice', color: '#0284C7', rating: 4.6 },

  // 3. DIZAYN (14)
  { id: 'gimp', name: 'GIMP', dev: 'GIMP ishlab chiquvchilar jamoasi', cat: 'Dizayn', short: 'Fotosuratlarni qayta ishlash, retush qilish va grafik dizayn yaratish uchun kuchli muharrir.', url: 'https://www.gimp.org/downloads/', lic: 'Bepul / Ochiq kodli', ver: '2.10.38', isPop: true, isNew: true, icon: 'gimp', color: '#7C3AED', rating: 4.8 },
  { id: 'affinity-photo', name: 'Affinity Photo 2', dev: 'Serif (Europe) Ltd / Canva', cat: 'Dizayn', short: 'Fotograflar va dizaynerlar uchun yuqori aniqlikdagi professional grafik dizayn dasturi.', url: 'https://affinity.serif.com/en-us/photo/', lic: 'Pullik', ver: '2.5.5', isPrem: true, icon: 'design', color: '#7C3AED', rating: 4.9 },
  { id: 'inkscape', name: 'Inkscape', dev: 'Inkscape Project', cat: 'Dizayn', short: 'SVG formatidagi vektor grafika, logotiplar va illyustratsiyalar yaratish uchun professional muharrir.', url: 'https://inkscape.org/release/', lic: 'Bepul / Ochiq kodli', ver: '1.4', isPop: true, icon: 'design', color: '#4F46E5', rating: 4.8 },
  { id: 'krita', name: 'Krita', dev: 'Krita Foundation', cat: 'Dizayn', short: 'Raqamli rassomlik, konsept-art, komikslar va 2D animatsiya chizish uchun bepul studiya.', url: 'https://krita.org/en/download/', lic: 'Bepul / Ochiq kodli', ver: '5.2.6', isPop: true, isPrem: true, icon: 'gimp', color: '#EC4899', rating: 4.9 },
  { id: 'blender-3d', name: 'Blender', dev: 'Blender Foundation', cat: 'Dizayn', short: '3D modellashtirish, animatsiya, vizual effektlar va renderlash uchun dunyodagi eng mashhur ochiq paket.', url: 'https://www.blender.org/download/', lic: 'Bepul / Ochiq kodli', ver: '4.2.3 LTS', isPop: true, isPrem: true, icon: 'design', color: '#EA580C', rating: 4.9 },
  { id: 'figma-desktop', name: 'Figma Desktop', dev: 'Figma Inc.', cat: 'Dizayn', short: 'Veb va mobil interfeyslar (UI/UX) dizaynini jamoaviy loyihalash va prototiplash dasturi.', url: 'https://www.figma.com/downloads/', lic: 'Bepul va pullik rejalar', ver: '124.5.0', isPop: true, isPrem: true, icon: 'design', color: '#7C3AED', rating: 4.9 },
  { id: 'paint-net', name: 'Paint.NET', dev: 'dotPDN LLC', cat: 'Dizayn', short: 'Windows uchun qatlamlar va maxsus effektlarni qo‘llab-quvvatlovchi yengil rastr muharrir.', url: 'https://www.getpaint.net/download.html', lic: 'Bepul', ver: '5.1', isNew: true, icon: 'gimp', color: '#2563EB', rating: 4.8 },
  { id: 'darktable', name: 'darktable', dev: 'darktable Team', cat: 'Dizayn', short: 'Professional fotograflar uchun RAW formatdagi suratlarni qayta ishlash va rang korreksiyasi laboratoriyasi.', url: 'https://www.darktable.org/install/', lic: 'Bepul / Ochiq kodli', ver: '4.8.1', isPrem: true, icon: 'gimp', color: '#475569', rating: 4.7 },
  { id: 'rawtherapee', name: 'RawTherapee', dev: 'RawTherapee Team', cat: 'Dizayn', short: 'Raqamli fotoapparatlardan olingan RAW tasvirlarni yo‘qotishlarsiz qayta ishlovchi kuchli dastur.', url: 'https://www.rawtherapee.com/downloads/', lic: 'Bepul / Ochiq kodli', ver: '5.11', icon: 'gimp', color: '#D97706', rating: 4.7 },
  { id: 'freecad', name: 'FreeCAD', dev: 'FreeCAD Community', cat: 'Dizayn', short: 'Muhandislik, arxitektura va mexanik detallarni 3D parametrik loyihalash (CAD) tizimi.', url: 'https://www.freecad.org/downloads.php', lic: 'Bepul / Ochiq kodli', ver: '1.0', isNew: true, isPrem: true, icon: 'design', color: '#0284C7', rating: 4.7 },
  { id: 'librecad', name: 'LibreCAD', dev: 'LibreCAD Community', cat: 'Dizayn', short: '2D chizmalar, sxemalar va texnik loyihalarni DXF formatida tayyorlash uchun bepul CAD dasturi.', url: 'https://librecad.org/#download', lic: 'Bepul / Ochiq kodli', ver: '2.2.0.2', icon: 'design', color: '#16A34A', rating: 4.5 },
  { id: 'sweet-home-3d', name: 'Sweet Home 3D', dev: 'eTeks', cat: 'Dizayn', short: 'Uy va xonadon interyerini 2D rejada chizish hamda 3D ko‘rinishda mebellarni joylashtirish dasturi.', url: 'https://www.sweethome3d.com/download.jsp', lic: 'Bepul / Ochiq kodli', ver: '7.5', icon: 'design', color: '#2563EB', rating: 4.6 },
  { id: 'aseprite-pixel', name: 'Aseprite', dev: 'Igara Studio', cat: 'Dizayn', short: '2D o‘yinlar uchun piksel-art (Pixel Art) grafika va sprayt animatsiyalar yaratish dasturi.', url: 'https://www.aseprite.org/', lic: 'Pullik', ver: '1.3.9', isPrem: true, icon: 'gimp', color: '#7C3AED', rating: 4.9 },
  { id: 'canva-windows', name: 'Canva Desktop', dev: 'Canva Pty Ltd', cat: 'Dizayn', short: 'Taqdimotlar, ijtimoiy tarmoq postlari va grafik bannerlarni tayyor shablonlar yordamida yaratish.', url: 'https://www.canva.com/download/windows/', lic: 'Bepul va pullik rejalar', ver: '1.96.0', isPop: true, icon: 'design', color: '#0284C7', rating: 4.8 },

  // 4. VIDEO MONTAJ (14)
  { id: 'obs-studio', name: 'OBS Studio', dev: 'OBS Project hamjamiyati', cat: 'Video montaj', short: 'Kompyuter ekranini yuqori sifatda yozib olish va jonli efir uzatish uchun professional dastur.', url: 'https://obsproject.com/download', lic: 'Bepul / Ochiq kodli', ver: '30.2.3', isPop: true, isNew: true, icon: 'obs', color: '#3B82F6', rating: 4.9 },
  { id: 'kdenlive', name: 'Kdenlive', dev: 'KDE hamjamiyati', cat: 'Video montaj', short: 'Ko‘p yo‘lakli video montaj, rang korreksiyasi va titrlar bilan ishlash uchun ochiq kodli dastur.', url: 'https://kdenlive.org/en/download/', lic: 'Bepul / Ochiq kodli', ver: '24.08.2', isNew: true, isPrem: true, icon: 'obs', color: '#0284C7', rating: 4.8 },
  { id: 'davinci-resolve', name: 'DaVinci Resolve', dev: 'Blackmagic Design', cat: 'Video montaj', short: 'Gollivud darajasidagi video montaj, professional rang korreksiyasi, VFX va Fairlight audio studiyasi.', url: 'https://www.blackmagicdesign.com/products/davinciresolve', lic: 'Bepul va pullik rejalar', ver: '19.0.3', isPop: true, isPrem: true, icon: 'obs', color: '#4F46E5', rating: 4.9 },
  { id: 'shotcut-video', name: 'Shotcut', dev: 'Meltytech LLC', cat: 'Video montaj', short: '4K ruxsatdagi videolarni kesish, birlashtirish va effektlar qo‘shish uchun bepul video muharrir.', url: 'https://www.shotcut.org/download/', lic: 'Bepul / Ochiq kodli', ver: '24.10.29', isPop: true, icon: 'obs', color: '#0D9488', rating: 4.7 },
  { id: 'openshot-video', name: 'OpenShot Video Editor', dev: 'OpenShot Studios LLC', cat: 'Video montaj', short: 'Boshlovchilar uchun tushunarli interfeysga ega animatsiya va video montaj dasturi.', url: 'https://www.openshot.org/download/', lic: 'Bepul / Ochiq kodli', ver: '3.2.1', icon: 'obs', color: '#2563EB', rating: 4.5 },
  { id: 'handbrake', name: 'HandBrake', dev: 'The HandBrake Team', cat: 'Video montaj', short: 'Videolarni MP4 va MKV formatlariga sifatni saqlagan holda siqish va konvertatsiya qilish dasturi.', url: 'https://handbrake.fr/downloads.php', lic: 'Bepul / Ochiq kodli', ver: '1.8.2', isPop: true, isPrem: true, icon: 'obs', color: '#EA580C', rating: 4.9 },
  { id: 'capcut-windows', name: 'CapCut Desktop', dev: 'Bytedance Pte. Ltd.', cat: 'Video montaj', short: 'Avtomatik subtitrlar, zamonaviy effektlar va tezkor montaj imkoniyatlariga ega video dastur.', url: 'https://www.capcut.com/', lic: 'Bepul va pullik rejalar', ver: '4.8.0', isPop: true, icon: 'obs', color: '#0284C7', rating: 4.7 },
  { id: 'avidemux', name: 'Avidemux', dev: 'Mean & Contributors', cat: 'Video montaj', short: 'Videolarni tez kesish, filtrlash va qayta kodlash uchun sodda hamda tezkor vosita.', url: 'https://avidemux.sourceforge.net/download.html', lic: 'Bepul / Ochiq kodli', ver: '2.8.1', icon: 'obs', color: '#4F46E5', rating: 4.5 },
  { id: 'losslesscut', name: 'LosslessCut', dev: 'Mikael Finstad', cat: 'Video montaj', short: 'Katta hajmli video va audio fayllarni qayta kodlashsiz (sifatni yo‘qotmay) soniyalar ichida kesish.', url: 'https://github.com/mifi/lossless-cut/releases', lic: 'Bepul / Ochiq kodli', ver: '3.62.0', isNew: true, isPrem: true, icon: 'obs', color: '#16A34A', rating: 4.8 },
  { id: 'shutter-encoder', name: 'Shutter Encoder', dev: 'Paul Pacifico', cat: 'Video montaj', short: 'Video montajchilar uchun professional kodeklar (ProRes, DNxHR, H.265) bilan ishlovchi konverter.', url: 'https://www.shutterencoder.com/en/', lic: 'Bepul / Ochiq kodli', ver: '18.5', isPrem: true, icon: 'obs', color: '#6366F1', rating: 4.9 },
  { id: 'screentogif', name: 'ScreenToGif', dev: 'Nicke Manarin', cat: 'Video montaj', short: 'Kompyuter ekranini yozib olib, uni tahrirlab GIF yoki MP4 formatida saqlash dasturi.', url: 'https://www.screentogif.com/', lic: 'Bepul / Ochiq kodli', ver: '2.41', icon: 'obs', color: '#2563EB', rating: 4.8 },
  { id: 'natron-vfx', name: 'Natron', dev: 'Natron GitHub Community', cat: 'Video montaj', short: 'Vizual effektlar (VFX), yashil fonni kesish (Chroma Key) va kompoziting uchun ochiq dastur.', url: 'https://natrongithub.github.io/', lic: 'Bepul / Ochiq kodli', ver: '2.5.0', icon: 'obs', color: '#475569', rating: 4.6 },
  { id: 'subtitle-edit', name: 'Subtitle Edit', dev: 'Nikse', cat: 'Video montaj', short: 'Videolar uchun subtitrlarni yaratish, vaqt bo‘yicha sinxronlashtirish va tarjima qilish dasturi.', url: 'https://www.nikse.dk/subtitleedit', lic: 'Bepul / Ochiq kodli', ver: '4.0.8', icon: 'obs', color: '#0284C7', rating: 4.8 },
  { id: 'olive-video', name: 'Olive Video Editor', dev: 'Olive Team', cat: 'Video montaj', short: 'Tezkor renderlash va chiziqli bo‘lmagan video tahrirlash uchun ochiq kodli loyiha.', url: 'https://www.olivevideoeditor.org/download.php', lic: 'Bepul / Ochiq kodli', ver: '0.2.0', icon: 'obs', color: '#D97706', rating: 4.4 },

  // 5. DASTURLASH (15)
  { id: 'vscode', name: 'Visual Studio Code', dev: 'Microsoft Corporation', cat: 'Dasturlash', short: 'Dasturchilar uchun yengil, kuchli va kengaytiriladigan zamonaviy kod muharriri.', url: 'https://code.visualstudio.com/Download', lic: 'Bepul', ver: '1.95.0', isPop: true, isPrem: true, icon: 'vscode', color: '#0284C7', rating: 4.9 },
  { id: 'python', name: 'Python', dev: 'Python Software Foundation', cat: 'Dasturlash', short: 'Dasturlash, sun’iy intellekt va ma’lumotlar tahlili uchun rasmiy Python interpretatori.', url: 'https://www.python.org/downloads/windows/', lic: 'Bepul / Ochiq kodli', ver: '3.13.0', isPop: true, isNew: true, icon: 'python', color: '#2563EB', rating: 4.9 },
  { id: 'git-windows', name: 'Git for Windows', dev: 'The Git Development Community', cat: 'Dasturlash', short: 'Kod versiyalarini nazorat qilish uchun rasmiy Git tizimi va Git Bash terminali.', url: 'https://git-scm.com/download/win', lic: 'Bepul / Ochiq kodli', ver: '2.47.0', isPop: true, icon: 'python', color: '#EA580C', rating: 4.9 },
  { id: 'nodejs', name: 'Node.js LTS', dev: 'OpenJS Foundation', cat: 'Dasturlash', short: 'Server va veb-ilovalarni JavaScript hamda TypeScript tillarida ishga tushirish muhiti.', url: 'https://nodejs.org/en/download/', lic: 'Bepul / Ochiq kodli', ver: '22.11.0 LTS', isPop: true, isPrem: true, icon: 'python', color: '#16A34A', rating: 4.9 },
  { id: 'notepad-plus-plus', name: 'Notepad++', dev: 'Don Ho', cat: 'Dasturlash', short: 'Windows uchun juda tezkor, sintaksisni ajratib ko‘rsatuvchi engil matn va kod muharriri.', url: 'https://notepad-plus-plus.org/downloads/', lic: 'Bepul / Ochiq kodli', ver: '8.7', isPop: true, icon: 'vscode', color: '#16A34A', rating: 4.8 },
  { id: 'sublime-text', name: 'Sublime Text 4', dev: 'Sublime HQ Pty Ltd', cat: 'Dasturlash', short: 'Katta hajmdagi kod fayllari bilan lahzada ishlovchi yuqori unumdorlikdagi matn muharriri.', url: 'https://www.sublimetext.com/download', lic: 'Bepul va pullik rejalar', ver: 'Build 4180', isPrem: true, icon: 'vscode', color: '#D97706', rating: 4.8 },
  { id: 'intellij-idea', name: 'IntelliJ IDEA Community', dev: 'JetBrains s.r.o.', cat: 'Dasturlash', short: 'Java, Kotlin va JVM dasturlarini yaratish uchun intellektual integratsiyalashgan muhit (IDE).', url: 'https://www.jetbrains.com/idea/download/', lic: 'Bepul / Ochiq kodli', ver: '2024.2.4', isPrem: true, icon: 'vscode', color: '#4F46E5', rating: 4.9 },
  { id: 'pycharm-community', name: 'PyCharm Community Edition', dev: 'JetBrains s.r.o.', cat: 'Dasturlash', short: 'Python dasturchilari uchun kod tahlili, vizual debagger va virtual muhit boshqaruviga ega IDE.', url: 'https://www.jetbrains.com/pycharm/download/', lic: 'Bepul / Ochiq kodli', ver: '2024.2.4', isPop: true, isPrem: true, icon: 'python', color: '#16A34A', rating: 4.9 },
  { id: 'docker-desktop', name: 'Docker Desktop', dev: 'Docker Inc.', cat: 'Dasturlash', short: 'Konteynerlashtirilgan ilovalarni Windows WSL2 muhitida yaratish va sinovdan o‘tkazish tizimi.', url: 'https://www.docker.com/products/docker-desktop/', lic: 'Bepul va pullik rejalar', ver: '4.35.1', isPrem: true, icon: 'python', color: '#0284C7', rating: 4.8 },
  { id: 'postman-api', name: 'Postman', dev: 'Postman Inc.', cat: 'Dasturlash', short: 'REST, GraphQL va WebSocket API so‘rovlarini loyihalash hamda tekshirish platformasi.', url: 'https://www.postman.com/downloads/', lic: 'Bepul va pullik rejalar', ver: '11.18.0', isPrem: true, icon: 'vscode', color: '#EA580C', rating: 4.8 },
  { id: 'dbeaver-ce', name: 'DBeaver Community', dev: 'DBeaver Corp', cat: 'Dasturlash', short: 'PostgreSQL, MySQL, SQLite, Oracle va boshqa ma’lumotlar bazalarini boshqarish uchun universal mijoz.', url: 'https://dbeaver.io/download/', lic: 'Bepul / Ochiq kodli', ver: '24.2.3', isNew: true, isPrem: true, icon: 'python', color: '#4F46E5', rating: 4.8 },
  { id: 'github-desktop', name: 'GitHub Desktop', dev: 'GitHub Inc.', cat: 'Dasturlash', short: 'Buyruqlar satrisiz vizual interfeys orqali Git va GitHub repozitoriylari bilan ishlash dasturi.', url: 'https://desktop.github.com/', lic: 'Bepul / Ochiq kodli', ver: '3.4.8', icon: 'vscode', color: '#7C3AED', rating: 4.7 },
  { id: 'android-studio', name: 'Android Studio', dev: 'Google LLC', cat: 'Dasturlash', short: 'Android operatsion tizimi uchun mobil ilovalar yaratish va emulyatorda tekshirishning rasmiy muhiti.', url: 'https://developer.android.com/studio', lic: 'Bepul', ver: '2024.2.1 Ladybug', isPrem: true, icon: 'vscode', color: '#16A34A', rating: 4.8 },
  { id: 'vscodium', name: 'VSCodium', dev: 'VSCodium Community', cat: 'Dasturlash', short: 'VS Code muharririning telemetriya va kuzatuv kodlaridan tozalangan to‘liq ochiq kodli talqini.', url: 'https://vscodium.com/#install', lic: 'Bepul / Ochiq kodli', ver: '1.95.1', icon: 'vscode', color: '#2563EB', rating: 4.8 },
  { id: 'cmake-build', name: 'CMake', dev: 'Kitware Inc.', cat: 'Dasturlash', short: 'C va C++ loyihalarini yig‘ish, testlash va paketlash uchun kross-platforma tizimi.', url: 'https://cmake.org/download/', lic: 'Bepul / Ochiq kodli', ver: '3.31.0', icon: 'python', color: '#0284C7', rating: 4.7 },

  // 6. XAVFSIZLIK (13)
  { id: 'bitwarden', name: 'Bitwarden', dev: 'Bitwarden Inc.', cat: 'Xavfsizlik', short: 'Parollar va maxfiy ma’lumotlarni shifrlangan holda saqlash uchun ishonchli parol menejeri.', url: 'https://bitwarden.com/download/', lic: 'Bepul va pullik rejalar', ver: '2024.10.0', isPop: true, isNew: true, isPrem: true, icon: 'security', color: '#0D9488', rating: 4.9 },
  { id: 'keepassxc', name: 'KeePassXC', dev: 'KeePassXC Team', cat: 'Xavfsizlik', short: 'Parollar bazasini internetga ulanmasdan kompyuterning o‘zida AES-256 bilan shifrlab saqlovchi menejer.', url: 'https://keepassxc.org/download/', lic: 'Bepul / Ochiq kodli', ver: '2.7.9', isPop: true, icon: 'security', color: '#16A34A', rating: 4.9 },
  { id: 'veracrypt', name: 'VeraCrypt', dev: 'IDRIX', cat: 'Xavfsizlik', short: 'Qattiq disk bo‘limlari va USB xotiralarni shifrlash hamda maxfiy konteynerlar yaratish dasturi.', url: 'https://www.veracrypt.fr/en/Downloads.html', lic: 'Bepul / Ochiq kodli', ver: '1.26.14', isPrem: true, icon: 'security', color: '#0284C7', rating: 4.9 },
  { id: 'malwarebytes', name: 'Malwarebytes for Windows', dev: 'Malwarebytes Inc.', cat: 'Xavfsizlik', short: 'Kompyuterni zararli dasturlar, josuslik kodlari va reklama viruslaridan tozalovchi skaner.', url: 'https://www.malwarebytes.com/mwb-download', lic: 'Bepul va pullik rejalar', ver: '5.2.1', isPop: true, isPrem: true, icon: 'security', color: '#2563EB', rating: 4.7 },
  { id: 'wireshark', name: 'Wireshark', dev: 'Wireshark Foundation', cat: 'Xavfsizlik', short: 'Tarmoq paketlarini tahlil qilish va tarmoq xavfsizligi diagnostikasi uchun jahon standarti.', url: 'https://www.wireshark.org/download.html', lic: 'Bepul / Ochiq kodli', ver: '4.4.1', isPrem: true, icon: 'security', color: '#0284C7', rating: 4.9 },
  { id: 'protonvpn', name: 'Proton VPN', dev: 'Proton AG', cat: 'Xavfsizlik', short: 'Shveysariya maxfiylik qonunlari asosida ishlovchi, trafik cheklovisiz xavfsiz VPN mijozi.', url: 'https://protonvpn.com/download-windows', lic: 'Bepul va pullik rejalar', ver: '3.3.2', isNew: true, isPrem: true, icon: 'security', color: '#6366F1', rating: 4.8 },
  { id: 'cryptomator', name: 'Cryptomator', dev: 'Skymatic GmbH', cat: 'Xavfsizlik', short: 'Google Drive, OneDrive va Dropbox bulutli xotiralariga yuklanadigan fayllarni shifrlash dasturi.', url: 'https://cryptomator.org/downloads/', lic: 'Bepul / Ochiq kodli', ver: '1.14.0', icon: 'security', color: '#0D9488', rating: 4.8 },
  { id: 'kleopatra-gpg4win', name: 'Gpg4win (Kleopatra)', dev: 'g10 Code GmbH', cat: 'Xavfsizlik', short: 'Fayllar va elektron xatlarni OpenPGP hamda S/MIME kriptografik kalitlari bilan imzolash va shifrlash.', url: 'https://www.gpg4win.org/download.html', lic: 'Bepul / Ochiq kodli', ver: '4.3.1', icon: 'security', color: '#4F46E5', rating: 4.7 },
  { id: 'simplewall', name: 'simplewall', dev: 'Henry++', cat: 'Xavfsizlik', short: 'Windows Filtering Platform (WFP) asosida qaysi dastur internetga chiqishini boshqaruvchi yengil xavfsizlik devori.', url: 'https://github.com/henrypp/simplewall/releases', lic: 'Bepul / Ochiq kodli', ver: '3.8.5', isPrem: true, icon: 'security', color: '#2563EB', rating: 4.8 },
  { id: 'portmaster-firewall', name: 'Portmaster', dev: 'Safing ICS Technologies', cat: 'Xavfsizlik', short: 'Kompyuterdagi barcha tarmoq ulanishlarini kuzatish va trekerlarni bloklash uchun maxfiylik xavfsizlik devori.', url: 'https://safing.io/download/', lic: 'Bepul / Ochiq kodli', ver: '1.6.10', isNew: true, icon: 'security', color: '#0D9488', rating: 4.7 },
  { id: 'clamwin-antivirus', name: 'ClamWin Free Antivirus', dev: 'ClamWin Pty Ltd', cat: 'Xavfsizlik', short: 'ClamAV dvigateli asosida fayllarni talab bo‘yicha tekshiruvchi ochiq kodli antivirus skaneri.', url: 'https://www.clamwin.com/content/view/18/46/', lic: 'Bepul / Ochiq kodli', ver: '0.103.2', icon: 'security', color: '#DC2626', rating: 4.4 },
  { id: 'openssl-win', name: 'OpenSSL Kriptografiya Kutubxonasi', dev: 'OpenSSL Project', cat: 'Xavfsizlik', short: 'TLS/SSL sertifikatlarini yaratish va kriptografik tekshiruvlar o‘tkazish uchun konsol vositasi.', url: 'https://www.openssl.org/source/', lic: 'Bepul / Ochiq kodli', ver: '3.4.0', icon: 'security', color: '#475569', rating: 4.8 },
  { id: 'eraser-secure', name: 'Eraser', dev: 'Garrett Trant & Team', cat: 'Xavfsizlik', short: 'Maxfiy fayllarni qattiq diskdan qayta tiklab bo‘lmaydigan darajada butunlay o‘chirish dasturi.', url: 'https://eraser.heidi.ie/download/', lic: 'Bepul / Ochiq kodli', ver: '6.2.0.2994', icon: 'security', color: '#E11D48', rating: 4.6 },

  // 7. MUSIQA VA AUDIO (13)
  { id: 'vlc-media-player', name: 'VLC Media Player', dev: 'VideoLAN notijorat tashkiloti', cat: 'Musiqa va audio', short: 'Barcha turdagi audio va video formatlarni qo‘shimcha kodeklarsiz ochuvchi erkin media pleyer.', url: 'https://www.videolan.org/vlc/download-windows.html', lic: 'Bepul / Ochiq kodli', ver: '3.0.21', isPop: true, icon: 'vlc', color: '#EA580C', rating: 4.9 },
  { id: 'audacity', name: 'Audacity', dev: 'Muse Group & Audacity Team', cat: 'Musiqa va audio', short: 'Ovoz yozib olish, podkastlarni montaj qilish va audio treklarni tahrirlash uchun bepul dastur.', url: 'https://www.audacityteam.org/download/windows/', lic: 'Bepul / Ochiq kodli', ver: '3.6.4', isPop: true, isNew: true, isPrem: true, icon: 'vlc', color: '#2563EB', rating: 4.8 },
  { id: 'foobar2000', name: 'foobar2000', dev: 'Peter Pawlowski', cat: 'Musiqa va audio', short: 'Yuqori sifatli (Lossless FLAC, WAV, DSD) musiqa tinglash uchun minimalistik va yengil audio pleyer.', url: 'https://www.foobar2000.org/download', lic: 'Bepul', ver: '2.1.6', isPop: true, icon: 'vlc', color: '#475569', rating: 4.9 },
  { id: 'aimp-player', name: 'AIMP', dev: 'Artem Izmaylov', cat: 'Musiqa va audio', short: '32-bitli ovoz qayta ishlash, 20-polosali ekvalayzer va internet-radio yozib olishga ega audio pleyer.', url: 'https://www.aimp.ru/?do=download&os=windows', lic: 'Bepul', ver: '5.30.2563', isPop: true, icon: 'vlc', color: '#D97706', rating: 4.9 },
  { id: 'musicbee', name: 'MusicBee', dev: 'Steven Mayall', cat: 'Musiqa va audio', short: 'Katta hajmdagi musiqa kolleksiyalarini tartiblash, teglarni tahrirlash va podkastlar tinglash dasturi.', url: 'https://getmusicbee.com/downloads/', lic: 'Bepul', ver: '3.5.8698', isPrem: true, icon: 'vlc', color: '#EA580C', rating: 4.9 },
  { id: 'spotify-windows', name: 'Spotify Desktop', dev: 'Spotify AB', cat: 'Musiqa va audio', short: 'Millionlab qo‘shiqlar, albomlar va podkastlarni onlayn tinglash uchun rasmiy striming dasturi.', url: 'https://www.spotify.com/download/windows/', lic: 'Bepul va pullik rejalar', ver: '1.2.48', isPop: true, icon: 'vlc', color: '#16A34A', rating: 4.8 },
  { id: 'lmms-studio', name: 'LMMS', dev: 'LMMS Developers', cat: 'Musiqa va audio', short: 'Kompyuterda musiqa bastalash, bitlar yaratish va MIDI sintezatorlar bilan ishlash uchun bepul DAW studiya.', url: 'https://lmms.io/download#windows', lic: 'Bepul / Ochiq kodli', ver: '1.2.2', isPrem: true, icon: 'vlc', color: '#16A34A', rating: 4.7 },
  { id: 'ardour-daw', name: 'Ardour', dev: 'Paul Davis & Ardour Community', cat: 'Musiqa va audio', short: 'Professional ovoz yozish muhandislari va musiqachilar uchun ko‘p kanalli raqamli audio stansiya.', url: 'https://ardour.org/download.html', lic: 'Bepul / Ochiq kodli', ver: '8.10', isPrem: true, icon: 'vlc', color: '#DC2626', rating: 4.7 },
  { id: 'musescore-studio', name: 'MuseScore Studio', dev: 'MuseScore BVBA', cat: 'Musiqa va audio', short: 'Musiqa notalarini yozish, partituralar yaratish va ularni simfonik ovozda tinglash dasturi.', url: 'https://musescore.org/en/download', lic: 'Bepul / Ochiq kodli', ver: '4.4.3', isNew: true, icon: 'vlc', color: '#2563EB', rating: 4.9 },
  { id: 'mixxx-dj', name: 'Mixxx', dev: 'Mixxx Development Team', cat: 'Musiqa va audio', short: 'DJ mikslar tayyorlash va jonli musiqa boshqaruvi uchun professional ochiq kodli dastur.', url: 'https://mixxx.org/download/', lic: 'Bepul / Ochiq kodli', ver: '2.4.1', icon: 'vlc', color: '#7C3AED', rating: 4.7 },
  { id: 'mpv-player', name: 'mpv Media Player', dev: 'mpv Community', cat: 'Musiqa va audio', short: 'Yuqori aniqlikdagi video va audio shkalalash algoritmlariga ega tezkor va minimalistik pleyer.', url: 'https://mpv.io/installation/', lic: 'Bepul / Ochiq kodli', ver: '0.39.0', icon: 'vlc', color: '#4F46E5', rating: 4.8 },
  { id: 'strawberry-music', name: 'Strawberry Music Player', dev: 'Jonas Kvinge', cat: 'Musiqa va audio', short: 'Audiofillar uchun WAV, FLAC, ALAC formatlarini buzilishsiz (bit-perfect) ijro etuvchi pleyer.', url: 'https://www.strawberrymusicplayer.org/', lic: 'Bepul / Ochiq kodli', ver: '1.1.3', icon: 'vlc', color: '#E11D48', rating: 4.6 },
  { id: 'equalizer-apo', name: 'Equalizer APO', dev: 'Jonas Thedering', cat: 'Musiqa va audio', short: 'Windows tizimi uchun past kechikishda ishlovchi kuchli parametrik ovoz ekvalayzeri.', url: 'https://sourceforge.net/projects/equalizerapo/', lic: 'Bepul / Ochiq kodli', ver: '1.3.2', isPrem: true, icon: 'vlc', color: '#0284C7', rating: 4.8 },

  // 8. TA’LIM (13)
  { id: 'anki', name: 'Anki', dev: 'Damien Elmes va hamjamiyat', cat: 'Ta’lim', short: 'Chet tillari, atamalar va imtihon savollarini samarali yodlash uchun intellektual kartochkalar dasturi.', url: 'https://apps.ankiweb.net/', lic: 'Bepul / Ochiq kodli', ver: '24.06.3', isPop: true, isNew: true, isPrem: true, icon: 'education', color: '#6366F1', rating: 4.9 },
  { id: 'zotero-research', name: 'Zotero', dev: 'Corporation for Digital Scholarship', cat: 'Ta’lim', short: 'Ilmiy maqolalar, kitoblar va iqtiboslarni yig‘ish hamda bibliografiya shakllantirish uchun tadqiqot vositasi.', url: 'https://www.zotero.org/download/', lic: 'Bepul / Ochiq kodli', ver: '7.0.8', isPop: true, isPrem: true, icon: 'education', color: '#DC2626', rating: 4.9 },
  { id: 'geogebra-classic', name: 'GeoGebra Classic', dev: 'International GeoGebra Institute', cat: 'Ta’lim', short: 'Geometriya, algebra, funksiyalar grafigi, statistika va matematik tahlilni interaktiv o‘rganish dasturi.', url: 'https://www.geogebra.org/download', lic: 'Bepul', ver: '6.0.864', isPop: true, icon: 'education', color: '#2563EB', rating: 4.9 },
  { id: 'stellarium-astronomy', name: 'Stellarium', dev: 'Stellarium Developers', cat: 'Ta’lim', short: 'Kompyuter ekranida 600 mingdan ortiq yulduz va sayyoralarni 3D formatda ko‘rsatuvchi planetariy.', url: 'https://stellarium.org/', lic: 'Bepul / Ochiq kodli', ver: '24.3', isNew: true, isPrem: true, icon: 'education', color: '#4F46E5', rating: 4.9 },
  { id: 'celestia-space', name: 'Celestia', dev: 'Celestia Development Team', cat: 'Ta’lim', short: 'Quyosh tizimi va galaktikamiz bo‘ylab uch o‘lchamli kosmik sayohat qilish simulyatori.', url: 'https://celestiaproject.space/download.html', lic: 'Bepul / Ochiq kodli', ver: '1.6.4', icon: 'education', color: '#0284C7', rating: 4.7 },
  { id: 'kiwix-offline', name: 'Kiwix Desktop', dev: 'Kiwix Association', cat: 'Ta’lim', short: 'Vikipediya va boshqa ta’lim ensiklopediyalarini internet bo‘lmaganda (oflayn) o‘qish dasturi.', url: 'https://kiwix.org/en/applications/', lic: 'Bepul / Ochiq kodli', ver: '2.4.1', isPrem: true, icon: 'education', color: '#0D9488', rating: 4.8 },
  { id: 'scratch-desktop', name: 'Scratch Desktop', dev: 'MIT Media Lab / Scratch Foundation', cat: 'Ta’lim', short: 'Maktab o‘quvchilari va bolalar uchun vizual bloklar yordamida algoritmlash hamda o‘yin yaratish dasturi.', url: 'https://scratch.mit.edu/download', lic: 'Bepul / Ochiq kodli', ver: '3.29.1', isPop: true, icon: 'education', color: '#D97706', rating: 4.9 },
  { id: 'gcompris-edu', name: 'GCompris', dev: 'KDE Community', cat: 'Ta’lim', short: '2 yoshdan 10 yoshgacha bo‘lgan bolalar uchun matematika, o‘qish va mantiqiy mashqlar to‘plami.', url: 'https://www.gcompris.net/downloads-en.html', lic: 'Bepul / Ochiq kodli', ver: '4.2', icon: 'education', color: '#16A34A', rating: 4.8 },
  { id: 'GoldenDict-ng', name: 'GoldenDict-ng', dev: 'GoldenDict Community', cat: 'Ta’lim', short: 'Bir vaqtning o‘zida o‘nlab oflayn lug‘atlar va ensiklopediyalardan so‘z tarjimasini qidiruvchi dastur.', url: 'https://github.com/xiaoyifang/goldendict-ng/releases', lic: 'Bepul / Ochiq kodli', ver: '24.09', isPrem: true, icon: 'education', color: '#D97706', rating: 4.8 },
  { id: 'jabref-bib', name: 'JabRef', dev: 'JabRef Development Team', cat: 'Ta’lim', short: 'LaTeX va BibTeX foydalanuvchilari uchun ilmiy adabiyotlar ro‘yxatini boshqarish dasturi.', url: 'https://www.jabref.org/#downloads', lic: 'Bepul / Ochiq kodli', ver: '5.15', icon: 'education', color: '#4F46E5', rating: 4.7 },
  { id: 'maxima-cas', name: 'Maxima (wxMaxima)', dev: 'Maxima Project', cat: 'Ta’lim', short: 'Simvolik algebra, integrallar, differensial tenglamalar va matritsalarni yechish uchun matematik tizim.', url: 'https://maxima.sourceforge.io/download.html', lic: 'Bepul / Ochiq kodli', ver: '5.47.0', icon: 'education', color: '#2563EB', rating: 4.7 },
  { id: 'gnu-octave', name: 'GNU Octave', dev: 'John W. Eaton & Community', cat: 'Ta’lim', short: 'Ilmiy hisob-kitoblar, sonli usullar va muhandislik simulyatsiyalari uchun yuqori darajali dasturlash tili.', url: 'https://octave.org/download', lic: 'Bepul / Ochiq kodli', ver: '9.2.0', isPrem: true, icon: 'education', color: '#0284C7', rating: 4.8 },
  { id: 'avogadro-chem', name: 'Avogadro 2', dev: 'Open Chemistry Project', cat: 'Ta’lim', short: 'Kimyo va molekulyar biologiya o‘rganuvchilari uchun 3D molekulalar konstruktori va vizualizatori.', url: 'https://two.avogadro.cc/', lic: 'Bepul / Ochiq kodli', ver: '1.99.0', icon: 'education', color: '#16A34A', rating: 4.7 },

  // 9. KOMPYUTER UCHUN FOYDALI DASTURLAR (14)
  { id: 'powertoys', name: 'Microsoft PowerToys', dev: 'Microsoft Corporation', cat: 'Kompyuter uchun foydali dasturlar', short: 'Windows oynalarini boshqarish va kundalik ishlarni tezlashtirish uchun rasmiy vositalar to‘plami.', url: 'https://learn.microsoft.com/en-us/windows/powertoys/install', lic: 'Bepul / Ochiq kodli', ver: '0.85.1', isPop: true, isNew: true, isPrem: true, icon: 'utilities', color: '#6366F1', rating: 4.9 },
  { id: 'rufus-usb', name: 'Rufus', dev: 'Pete Batard', cat: 'Kompyuter uchun foydali dasturlar', short: 'ISO obrazlaridan Windows va Linux o‘rnatish uchun yuklanuvchi (bootable) USB fleshkalar tayyorlash.', url: 'https://rufus.ie/en/', lic: 'Bepul / Ochiq kodli', ver: '4.6', isPop: true, icon: 'utilities', color: '#2563EB', rating: 4.9 },
  { id: 'bleachbit', name: 'BleachBit', dev: 'Andrew Ziem', cat: 'Kompyuter uchun foydali dasturlar', short: 'Kompyuter diskini kesh va vaqtinchalik keraksiz fayllardan tozalab xotirani bo‘shatish dasturi.', url: 'https://www.bleachbit.org/download/windows', lic: 'Bepul / Ochiq kodli', ver: '4.6.2', isPop: true, icon: 'utilities', color: '#DC2626', rating: 4.8 },
  { id: 'sharex-screen', name: 'ShareX', dev: 'ShareX Team', cat: 'Kompyuter uchun foydali dasturlar', short: 'Ekranning istalgan qismini rasmga olish, izoh yozish, OCR matn ajratish va video yozish vositasi.', url: 'https://getsharex.com/', lic: 'Bepul / Ochiq kodli', ver: '16.1.0', isPop: true, isPrem: true, icon: 'utilities', color: '#0284C7', rating: 4.9 },
  { id: 'greenshot', name: 'Greenshot', dev: 'Greenshot Project', cat: 'Kompyuter uchun foydali dasturlar', short: 'Tezkor skrinshot olish va rasm ustiga ko‘rsatkichlar chizish uchun juda yengil yordamchi dastur.', url: 'https://getgreenshot.org/downloads/', lic: 'Bepul / Ochiq kodli', ver: '1.2.10', icon: 'utilities', color: '#16A34A', rating: 4.8 },
  { id: 'cpu-z', name: 'CPU-Z', dev: 'CPUID', cat: 'Kompyuter uchun foydali dasturlar', short: 'Protsessor, anakart, tezkor xotira (RAM) va videokarta haqida aniq texnik ma’lumot beruvchi dastur.', url: 'https://www.cpuid.com/softwares/cpu-z.html', lic: 'Bepul', ver: '2.11', isPop: true, icon: 'utilities', color: '#4F46E5', rating: 4.9 },
  { id: 'hwmonitor', name: 'HWMonitor', dev: 'CPUID', cat: 'Kompyuter uchun foydali dasturlar', short: 'Kompyuter qismlarining harorati (temperatura), kuchlanishi va ventilyatorlar tezligini kuzatish.', url: 'https://www.cpuid.com/softwares/hwmonitor.html', lic: 'Bepul', ver: '1.54', isPrem: true, icon: 'utilities', color: '#475569', rating: 4.8 },
  { id: 'crystaldiskinfo', name: 'CrystalDiskInfo', dev: 'Noriyuki Miyazaki', cat: 'Kompyuter uchun foydali dasturlar', short: 'SSD va HDD xotira disklarining salomatlik holati (S.M.A.R.T.) hamda haroratini nazorat qilish.', url: 'https://crystalmark.info/en/software/crystaldiskinfo/', lic: 'Bepul / Ochiq kodli', ver: '9.4.4', isNew: true, isPrem: true, icon: 'utilities', color: '#0284C7', rating: 4.9 },
  { id: 'crystaldiskmark', name: 'CrystalDiskMark', dev: 'Noriyuki Miyazaki', cat: 'Kompyuter uchun foydali dasturlar', short: 'SSD, NVMe va flesh-xotiralarning o‘qish hamda yozish tezligini o‘lchash uchun etalon test dasturi.', url: 'https://crystalmark.info/en/software/crystaldiskmark/', lic: 'Bepul / Ochiq kodli', ver: '8.0.5', icon: 'utilities', color: '#16A34A', rating: 4.9 },
  { id: 'ventoy-boot', name: 'Ventoy', dev: 'Hailong Sun', cat: 'Kompyuter uchun foydali dasturlar', short: 'Fleshkani qayta formatlamasdan turib bir nechta ISO fayllarni to‘g‘ridan-to‘g‘ri yuklash vositasi.', url: 'https://www.ventoy.net/en/download.html', lic: 'Bepul / Ochiq kodli', ver: '1.0.99', isPrem: true, icon: 'utilities', color: '#2563EB', rating: 4.9 },
  { id: 'balena-etcher', name: 'balenaEtcher', dev: 'Balena Inc.', cat: 'Kompyuter uchun foydali dasturlar', short: 'Operatsion tizim obrazlarini SD karta va USB fleshkalarga xatosiz yozish uchun zamonaviy dastur.', url: 'https://etcher.balena.io/', lic: 'Bepul / Ochiq kodli', ver: '1.19.25', icon: 'utilities', color: '#0D9488', rating: 4.7 },
  { id: 'autohotkey', name: 'AutoHotkey', dev: 'AutoHotkey Foundation LLC', cat: 'Kompyuter uchun foydali dasturlar', short: 'Klaviatura tugmalari kombinatsiyasini sozlash va takrorlanuvchi ishlarni avtomatlashtirish skript tili.', url: 'https://www.autohotkey.com/', lic: 'Bepul / Ochiq kodli', ver: '2.0.18', isPrem: true, icon: 'utilities', color: '#16A34A', rating: 4.9 },
  { id: 'flux-screen', name: 'f.lux', dev: 'f.lux Software LLC', cat: 'Kompyuter uchun foydali dasturlar', short: 'Kechki vaqtda monitorning ko‘k nurlarini kamaytirib ko‘z charchashining oldini oluvchi dastur.', url: 'https://justgetflux.com/', lic: 'Bepul', ver: '4.136', icon: 'utilities', color: '#EA580C', rating: 4.8 },
  { id: 'bulk-crap-uninstaller', name: 'BCUninstaller', dev: 'Marcin Szeniak', cat: 'Kompyuter uchun foydali dasturlar', short: 'Ko‘p sonli dasturlarni qoldiq fayllari va reyestr yozuvlari bilan birga toza o‘chirish vositasi.', url: 'https://www.bcuninstaller.com/', lic: 'Bepul / Ochiq kodli', ver: '5.8.2', icon: 'utilities', color: '#7C3AED', rating: 4.8 },

  // 10. ALOQA (12)
  { id: 'telegram-desktop', name: 'Telegram Desktop', dev: 'Telegram FZ-LLC', cat: 'Aloqa', short: 'Windows kompyuterlari uchun tezkor, qulay va bulutli sinxronizatsiyaga ega muloqot dasturi.', url: 'https://desktop.telegram.org/', lic: 'Bepul', ver: '5.6.3', isPop: true, isNew: true, icon: 'communication', color: '#0284C7', rating: 4.9 },
  { id: 'signal-desktop', name: 'Signal Desktop', dev: 'Signal Messenger LLC', cat: 'Aloqa', short: 'Shaxsiy suhbatlar va video qo‘ng‘iroqlarni uchdan-uchga (E2EE) shifrlovchi maxfiy messenjer.', url: 'https://signal.org/download/windows/', lic: 'Bepul / Ochiq kodli', ver: '7.28.0', isPrem: true, icon: 'communication', color: '#2563EB', rating: 4.9 },
  { id: 'discord-windows', name: 'Discord', dev: 'Discord Inc.', cat: 'Aloqa', short: 'Hamjamiyatlar, dasturchilar va geymerlar uchun ovozli, video hamda matnli muloqot platformasi.', url: 'https://discord.com/download', lic: 'Bepul va pullik rejalar', ver: '1.0.9168', isPop: true, icon: 'communication', color: '#4F46E5', rating: 4.8 },
  { id: 'zoom-workplace', name: 'Zoom Workplace', dev: 'Zoom Video Communications Inc.', cat: 'Aloqa', short: 'Onlayn uchrashuvlar, vebinarlar va masofaviy darslar o‘tkazish uchun video konferensiya dasturi.', url: 'https://zoom.us/download', lic: 'Bepul va pullik rejalar', ver: '6.2.6', isPop: true, isPrem: true, icon: 'communication', color: '#2563EB', rating: 4.7 },
  { id: 'slack-desktop', name: 'Slack', dev: 'Salesforce / Slack Technologies', cat: 'Aloqa', short: 'IT kompaniyalari va ishchi jamoalar uchun kanallarga asoslangan korporativ muloqot muhiti.', url: 'https://slack.com/downloads/windows', lic: 'Bepul va pullik rejalar', ver: '4.41.97', isPrem: true, icon: 'communication', color: '#7C3AED', rating: 4.8 },
  { id: 'microsoft-teams', name: 'Microsoft Teams', dev: 'Microsoft Corporation', cat: 'Aloqa', short: 'Korxonalar va ta’lim muassasalari uchun video qo‘ng‘iroqlar hamda hujjatlar almashinuvi tizimi.', url: 'https://www.microsoft.com/en-us/microsoft-teams/download-app', lic: 'Bepul va pullik rejalar', ver: '24277.3502', icon: 'communication', color: '#4F46E5', rating: 4.6 },
  { id: 'thunderbird-mail', name: 'Mozilla Thunderbird', dev: 'MZLA Technologies / Mozilla', cat: 'Aloqa', short: 'Bir nechta elektron pochta qutilarini, taqvim va kontaktlarni boshqarish uchun bepul pochta mijozi.', url: 'https://www.thunderbird.net/en-US/download/', lic: 'Bepul / Ochiq kodli', ver: '128.4.0 ESR', isPop: true, isPrem: true, icon: 'communication', color: '#0284C7', rating: 4.8 },
  { id: 'whatsapp-desktop', name: 'WhatsApp Desktop', dev: 'Meta Platforms Inc.', cat: 'Aloqa', short: 'Kompyuter orqali xabar yozish, fayl yuborish va audio/video qo‘ng‘iroqlarni amalga oshirish.', url: 'https://www.whatsapp.com/download', lic: 'Bepul', ver: '2.2440.9', icon: 'communication', color: '#16A34A', rating: 4.7 },
  { id: 'viber-desktop', name: 'Rakuten Viber', dev: 'Viber Media S.à r.l.', cat: 'Aloqa', short: 'Xalqaro qo‘ng‘iroqlar, stikerlar va guruhli suhbatlar uchun kompyuter messenjeri.', url: 'https://www.viber.com/en/download/', lic: 'Bepul', ver: '23.9.0', icon: 'communication', color: '#7C3AED', rating: 4.5 },
  { id: 'element-matrix', name: 'Element', dev: 'New Vector Ltd', cat: 'Aloqa', short: 'Markazlashmagan Matrix protokoli asosida ishlovchi xavfsiz va mustaqil muloqot mijozi.', url: 'https://element.io/download', lic: 'Bepul / Ochiq kodli', ver: '1.11.82', isPrem: true, icon: 'communication', color: '#0D9488', rating: 4.7 },
  { id: 'jami-comm', name: 'Jami', dev: 'Savoir-faire Linux (GNU Package)', cat: 'Aloqa', short: 'Markaziy serversiz (peer-to-peer) to‘g‘ridan-to‘g‘ri video qo‘ng‘iroq va fayl uzatish dasturi.', url: 'https://jami.net/download-jami-windows/', lic: 'Bepul / Ochiq kodli', ver: '20240930', icon: 'communication', color: '#0284C7', rating: 4.6 },
  { id: 'mumble-voice', name: 'Mumble', dev: 'Mumble Contributors', cat: 'Aloqa', short: 'Juda past kechikish (low-latency) va yuqori ovoz sifatiga ega ochiq kodli ovozli chat dasturi.', url: 'https://www.mumble.info/downloads/', lic: 'Bepul / Ochiq kodli', ver: '1.5.634', icon: 'communication', color: '#2563EB', rating: 4.7 },

  // 11. O‘YINLAR (13)
  { id: 'steam', name: 'Steam', dev: 'Valve Corporation', cat: 'O‘yinlar', short: 'Kompyuter o‘yinlarini rasmiy xarid qilish, yangilash va do‘stlar bilan o‘ynash platformasi.', url: 'https://store.steampowered.com/about/', lic: 'Bepul', ver: '2026.10', isPop: true, isNew: true, icon: 'utilities', color: '#4F46E5', rating: 4.9 },
  { id: 'epic-games-launcher', name: 'Epic Games Launcher', dev: 'Epic Games Inc.', cat: 'O‘yinlar', short: 'Rasmiy o‘yinlar do‘koni, haftalik bepul o‘yinlar tarqatish tizimi va Unreal Engine dvigateli markazi.', url: 'https://store.epicgames.com/en-US/download', lic: 'Bepul', ver: '16.12.1', isPop: true, icon: 'utilities', color: '#475569', rating: 4.7 },
  { id: 'gog-galaxy', name: 'GOG GALAXY 2.0', dev: 'GOG sp. z o.o. (CD PROJEKT)', cat: 'O‘yinlar', short: 'DRM himoyasisiz klassik va zamonaviy o‘yinlarni yagona kutubxonada birlashtiruvchi mijoz.', url: 'https://www.gogalaxy.com/en/', lic: 'Bepul', ver: '2.0.77', isPrem: true, icon: 'utilities', color: '#7C3AED', rating: 4.8 },
  { id: 'playnite-manager', name: 'Playnite', dev: 'Josef Nemec', cat: 'O‘yinlar', short: 'Steam, Epic, GOG va emulyator o‘yinlarini bitta chiroyli interfeysda boshqaruvchi ochiq kodli menejer.', url: 'https://playnite.link/', lic: 'Bepul / Ochiq kodli', ver: '10.35', isNew: true, isPrem: true, icon: 'utilities', color: '#EA580C', rating: 4.9 },
  { id: 'heroic-launcher', name: 'Heroic Games Launcher', dev: 'Heroic Games Team', cat: 'O‘yinlar', short: 'Epic Games, GOG va Amazon Prime o‘yinlari uchun yengil hamda ochiq kodli muqobil ishga tushirgich.', url: 'https://heroicgameslauncher.com/downloads', lic: 'Bepul / Ochiq kodli', ver: '2.15.2', icon: 'utilities', color: '#0284C7', rating: 4.8 },
  { id: 'retroarch', name: 'RetroArch', dev: 'Libretro Team', cat: 'O‘yinlar', short: 'Klassik o‘yin konsollari emulyatorlari va o‘yin dvigatellarini yagona qobiqda ishlatish tizimi.', url: 'https://www.retroarch.com/?page=platforms', lic: 'Bepul / Ochiq kodli', ver: '1.19.1', isPrem: true, icon: 'utilities', color: '#4F46E5', rating: 4.8 },
  { id: 'itch-io-app', name: 'itch.io Desktop App', dev: 'itch Corp', cat: 'O‘yinlar', short: 'Mustaqil (indie) o‘yin dasturchilarining minglab original o‘yinlarini yuklab olish va yangilash mijozi.', url: 'https://itch.io/app', lic: 'Bepul / Ochiq kodli', ver: '26.1.0', icon: 'utilities', color: '#E11D48', rating: 4.8 },
  { id: '0-ad-game', name: '0 A.D. Empires Ascendant', dev: 'Wildfire Games', cat: 'O‘yinlar', short: 'Qadimgi sivilizatsiyalar tarixiga bag‘ishlangan to‘liq bepul va ochiq kodli real vaqt strategiyasi (RTS).', url: 'https://play0ad.com/download/win/', lic: 'Bepul / Ochiq kodli', ver: 'Alpha 26', icon: 'utilities', color: '#D97706', rating: 4.8 },
  { id: 'supertuxkart', name: 'SuperTuxKart', dev: 'SuperTuxKart Team', cat: 'O‘yinlar', short: 'Turli traslar, personajlar va tarmoq orqali bellashuv rejimiga ega quvnoq 3D poyga o‘yini.', url: 'https://supertuxkart.net/Download', lic: 'Bepul / Ochiq kodli', ver: '1.4', icon: 'utilities', color: '#16A34A', rating: 4.7 },
  { id: 'wesnoth-strategy', name: 'The Battle for Wesnoth', dev: 'Wesnoth Project', cat: 'O‘yinlar', short: 'Yuzlab sarguzasht kampaniyalariga ega fentezi janridagi navbatma-navbat o‘ynaladigan strategiya.', url: 'https://www.wesnoth.org/#download', lic: 'Bepul / Ochiq kodli', ver: '1.18.2', icon: 'utilities', color: '#2563EB', rating: 4.8 },
  { id: 'openra-rts', name: 'OpenRA', dev: 'OpenRA Developers', cat: 'O‘yinlar', short: 'Red Alert, Tiberium Dawn va Dune 2000 klassik strategiyalarining zamonaviy tizimlarga mos qayta talqini.', url: 'https://www.openra.net/download/', lic: 'Bepul / Ochiq kodli', ver: '20231010', icon: 'utilities', color: '#DC2626', rating: 4.8 },
  { id: 'minetest-luanti', name: 'Luanti (Minetest)', dev: 'Luanti Community', cat: 'O‘yinlar', short: 'Kubik bloklardan iborat cheksiz olam yaratish va modifikatsiyalar yozish uchun ochiq voksel dvigateli.', url: 'https://www.luanti.org/downloads/', lic: 'Bepul / Ochiq kodli', ver: '5.10.0', isNew: true, icon: 'utilities', color: '#16A34A', rating: 4.7 },
  { id: 'flightgear-sim', name: 'FlightGear Flight Simulator', dev: 'FlightGear Project', cat: 'O‘yinlar', short: 'Haqiqiy aerodinamika va dunyo aeroportlari xaritasiga ega professional ochiq kodli parvoz simulyatori.', url: 'https://www.flightgear.org/download/', lic: 'Bepul / Ochiq kodli', ver: '2020.3.19', isPrem: true, icon: 'utilities', color: '#0284C7', rating: 4.7 },

  // 12. FAYLLAR BILAN ISHLASH (13)
  { id: '7-zip', name: '7-Zip', dev: 'Igor Pavlov', cat: 'Fayllar bilan ishlash', short: 'Fayllarni yuqori darajada siqish va arxivlardan chiqarish uchun yengil hamda bepul dastur.', url: 'https://www.7-zip.org/', lic: 'Bepul / Ochiq kodli', ver: '24.08', isPop: true, icon: '7zip', color: '#4F46E5', rating: 4.9 },
  { id: 'peazip-archiver', name: 'PeaZip', dev: 'Giorgio Tani', cat: 'Fayllar bilan ishlash', short: '200 dan ortiq arxiv turlarini (7Z, RAR, TAR, ZIPX) ochuvchi va ikki faktorli shifrlovchi arxivator.', url: 'https://peazip.github.io/', lic: 'Bepul / Ochiq kodli', ver: '10.0.0', isNew: true, isPrem: true, icon: '7zip', color: '#16A34A', rating: 4.8 },
  { id: 'everything-search', name: 'Everything', dev: 'voidtools (David Carpenter)', cat: 'Fayllar bilan ishlash', short: 'Windows kompyuteridagi millionlab fayl va papkalarni nomi bo‘yicha bir soniyadan kam vaqtda topish.', url: 'https://www.voidtools.com/downloads/', lic: 'Bepul', ver: '1.4.1.1026', isPop: true, isPrem: true, icon: '7zip', color: '#D97706', rating: 5.0 },
  { id: 'filezilla-client', name: 'FileZilla Client', dev: 'Tim Kosse & FileZilla Project', cat: 'Fayllar bilan ishlash', short: 'FTP, FTPS va SFTP protokollari orqali serverlarga fayl yuklash hamda ko‘chirish uchun ishonchli dastur.', url: 'https://filezilla-project.org/download.php?type=client', lic: 'Bepul / Ochiq kodli', ver: '3.68.1', isPop: true, icon: '7zip', color: '#DC2626', rating: 4.8 },
  { id: 'winscp-sftp', name: 'WinSCP', dev: 'Martin Prikryl', cat: 'Fayllar bilan ishlash', short: 'Windows va uzoq masofadagi Linux serverlar o‘rtasida SFTP, SCP va WebDAV orqali xavfsiz fayl almashish.', url: 'https://winscp.net/eng/download.php', lic: 'Bepul / Ochiq kodli', ver: '6.3.5', isPrem: true, icon: '7zip', color: '#0284C7', rating: 4.9 },
  { id: 'qbittorrent', name: 'qBittorrent', dev: 'The qBittorrent Project', cat: 'Fayllar bilan ishlash', short: 'Reklamasiz, ochiq kodli va ichki qidiruv tizimiga ega yengil BitTorrent mijozi.', url: 'https://www.qbittorrent.org/download', lic: 'Bepul / Ochiq kodli', ver: '5.0.1', isPop: true, isPrem: true, icon: '7zip', color: '#2563EB', rating: 4.9 },
  { id: 'syncthing-sync', name: 'Syncthing', dev: 'The Syncthing Foundation', cat: 'Fayllar bilan ishlash', short: 'Bulutli serversiz ikki yoki undan ortiq kompyuter o‘rtasida papkalarni doimiy sinxronlash.', url: 'https://syncthing.net/downloads/', lic: 'Bepul / Ochiq kodli', ver: '1.28.0', isPrem: true, icon: '7zip', color: '#0D9488', rating: 4.9 },
  { id: 'freefilesync', name: 'FreeFileSync', dev: 'Zenju', cat: 'Fayllar bilan ishlash', short: 'Muhim fayllarning zaxira nusxasini (Backup) olish va papkalarni o‘zaro solishtirib yangilash dasturi.', url: 'https://freefilesync.org/download.php', lic: 'Bepul / Ochiq kodli', ver: '13.8', icon: '7zip', color: '#16A34A', rating: 4.8 },
  { id: 'localsend-share', name: 'LocalSend', dev: 'Tien Do Nam & Community', cat: 'Fayllar bilan ishlash', short: 'Mahalliy Wi-Fi tarmog‘i orqali Windows, Android va iOS qurilmalari o‘rtasida internetsiz fayl uzatish.', url: 'https://localsend.org/download', lic: 'Bepul / Ochiq kodli', ver: '1.16.1', isNew: true, isPrem: true, icon: '7zip', color: '#0D9488', rating: 4.9 },
  { id: 'wiztree-disk', name: 'WizTree', dev: 'Antibody Software', cat: 'Fayllar bilan ishlash', short: 'Qattiq diskda eng ko‘p joy egallab turgan katta fayl va papkalarni vizual xaritada topuvchi tezkor skaner.', url: 'https://diskanalyzer.com/download', lic: 'Bepul va pullik rejalar', ver: '4.22', isPop: true, isPrem: true, icon: '7zip', color: '#D97706', rating: 4.9 },
  { id: 'windirstat', name: 'WinDirStat', dev: 'WinDirStat Team', cat: 'Fayllar bilan ishlash', short: 'Disk xotirasi sarfini tahlil qilish va keraksiz yirik fayllarni tozalash uchun ochiq kodli statistika vositasi.', url: 'https://windirstat.net/', lic: 'Bepul / Ochiq kodli', ver: '2.1.1', isNew: true, icon: '7zip', color: '#4F46E5', rating: 4.8 },
  { id: 'double-commander', name: 'Double Commander', dev: 'Alexander Koblov', cat: 'Fayllar bilan ishlash', short: 'Yonma-yon ikkita panelga, ichki matn muharriri va guruhli nom o‘zgartirishga ega fayl menejeri.', url: 'https://doublecmd.sourceforge.io/', lic: 'Bepul / Ochiq kodli', ver: '1.1.19', icon: '7zip', color: '#DC2626', rating: 4.7 },
  { id: 'teracopy-win', name: 'TeraCopy', dev: 'Code Sector', cat: 'Fayllar bilan ishlash', short: 'Katta hajmdagi fayllarni maksimal tezlikda nusxalash va xesh-summa orqali xatolarni tekshirish.', url: 'https://www.codesector.com/teracopy', lic: 'Bepul va pullik rejalar', ver: '3.17', icon: '7zip', color: '#0284C7', rating: 4.7 },
];

export const SOFTWARE_CATALOG: SoftwareApp[] = COMPACT_SEEDS.map((seed) => {
  const fullDesc = `${seed.short} ${seed.name} dasturi ${seed.dev} tomonidan Windows 10 va Windows 11 tizimlari uchun rasmiy ravishda ishlab chiqilgan. Smart Download orqali siz ushbu dasturning tasdiqlangan rasmiy manbasiga xavfsiz o‘tishingiz mumkin.`;
  let domainLabel = seed.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];

  return {
    id: seed.id,
    name: seed.name,
    developer: seed.dev,
    description: seed.short,
    shortDescription: seed.short,
    fullDescription: fullDesc,
    category: seed.cat,
    platform: 'Windows',
    license: seed.lic,
    licenseModel: seed.lic,
    officialUrl: seed.url,
    downloadUrl: seed.url,
    officialDownloadUrl: seed.url,
    officialWebsiteLabel: `${domainLabel} (Rasmiy manba)`,
    isPremium: Boolean(seed.isPrem),
    logo: seed.icon,
    iconType: seed.icon,
    rating: seed.rating,
    supportedWindows: ['Windows 11', 'Windows 10 (64-bit)'],
    architecture: ['x64', 'ARM64'],
    isFree: seed.lic !== 'Pullik',
    isPopular: Boolean(seed.isPop),
    isNew: Boolean(seed.isNew),
    version: `${seed.ver} (Rasmiy ma’lumot)`,
    lastCheckedDate: '2026-10-04',
    sourceType: seed.url.includes('microsoft.com')
      ? 'Rasmiy Microsoft Store sahifasi'
      : 'Ishlab chiqaruvchining rasmiy sayti',
    safetyNotes: [
      `Foydalanuvchini bevosita ${seed.dev} rasmiy veb-sahifasiga (${domainLabel}) yo‘naltiradi.`,
      'Smart Download o‘rnatish fayllarini o‘z serverida saqlamaydi va dastur tarkibiga o‘zgartirish kiritmaydi.',
      'Yuklab olgandan so‘ng ishlab chiqaruvchining raqamli imzosini tekshirish tavsiya etiladi.',
    ],
    accentColor: seed.color,
    proOptimizationGuide: seed.isPrem
      ? `${seed.name} uchun PRO tavsiya: O‘rnatish vaqtida rasmiy 64-bitli (x64/ARM64) paketni tanlang, avtomatik yangilanishlarni yoqing va rasmiy SHA-256 nazorat summasini tekshiring.`
      : undefined,
  };
});
