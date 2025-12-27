
export const TMDB_API_KEY = 'f6401f5060b84efb82981a916623f6ab';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const APP_VERSION = '8.0.0-Ultra';

export const MONETIZATION_CONFIG = {
  // رابط التفعيل الخاص بك
  keyUrl: 'https://shrinkme.click/G9fuSI', 
  
  // الكود السري الذي يكتبه المستخدم (عدله من هنا يومياً)
  dailySecret: 'GOLD-2025',
  
  enabled: true
};

export const SERVERS = {
  vidlink: { name: 'VidLink PRO', url: 'https://vidlink.pro/embed' },
  vidsrc_pro: { name: 'Vidsrc PRO', url: 'https://vidsrc.pro/embed' },
  vidsrc_me: { name: 'Vidsrc ME', url: 'https://vidsrc.me/embed' },
  embed_su: { name: 'Embed SU', url: 'https://embed.su/embed' },
  vidsrc_xyz: { name: 'Vidsrc XYZ', url: 'https://vidsrc.xyz/embed' },
  vidsrc_in: { name: 'Vidsrc IN', url: 'https://vidsrc.in/embed' },
  movieapi: { name: 'MovieAPI', url: 'https://moviesapi.club/embed' },
  auto_embed: { name: 'AutoEmbed', url: 'https://player.vidsrc.nl/embed' }
};

export const BEIN_CHANNELS = [
  {
    id: 'bein1',
    name: 'beIN Sports 1 HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/BeIN_Sports_1_logo.svg',
    poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    url: 'https://live.p7.itv-app.com/bein1/index.m3u8'
  },
  {
    id: 'bein2',
    name: 'beIN Sports 2 HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/BeIN_Sports_2_logo.svg',
    poster: 'https://images.unsplash.com/photo-1540747913346-19e3ad643121?auto=format&fit=crop&q=80&w=800',
    url: 'https://live.p7.itv-app.com/bein2/index.m3u8'
  },
  {
    id: 'bein3',
    name: 'beIN Sports 3 HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/BeIN_Sports_3_logo.svg',
    poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    url: 'https://live.p7.itv-app.com/bein3/index.m3u8'
  },
  {
    id: 'bein4',
    name: 'beIN Sports 4 HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/BeIN_Sports_4_logo.svg',
    poster: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800',
    url: 'https://live.p7.itv-app.com/bein4/index.m3u8'
  }
];

export const translations = {
  en: {
    home: 'Home',
    movies: 'Movies',
    series: 'Series',
    anime: 'Anime',
    channels: 'Live TV',
    favorites: 'My List',
    emptyFav: 'Your list is empty',
    search: 'Search for movies...',
    trending: 'Trending Now',
    arabicCinema: 'Arabic Content',
    koreanWave: 'K-Drama',
    international: 'International Movies',
    topAnime: 'Anime Universe',
    watchNow: 'Watch Now',
    download: 'Download HD',
    selectPlayer: 'Switch Server',
    addToFav: 'Save to List',
    back: 'Back',
    episodes: 'Episodes',
    seasons: 'Seasons',
    live: 'Live Stream',
    server: 'Server',
    loadMore: 'Load More',
    verifyTitle: 'Server Protection',
    verifyDesc: 'To keep servers fast, please get your daily activation key (24h validity).',
    getKey: 'Get Activation Key',
    enterKey: 'Enter Key Here',
    unlock: 'Activate Now',
    invalidKey: 'Invalid Key!',
    activeKey: 'Access Granted'
  },
  ar: {
    home: 'الرئيسية',
    movies: 'الأفلام',
    series: 'المسلسلات',
    anime: 'الأنمي',
    channels: 'بث مباشر',
    favorites: 'قائمتي',
    emptyFav: 'قائمتك فارغة حالياً',
    search: 'ابحث عن فيلمك المفضل...',
    trending: 'الأكثر مشاهدة',
    arabicCinema: 'أعمال عربية',
    koreanWave: 'دراما كورية',
    international: 'سينما عالمية',
    topAnime: 'عالم الأنمي',
    watchNow: 'مشاهدة الآن',
    download: 'تحميل بجودة عالية',
    selectPlayer: 'تغيير السيرفر',
    addToFav: 'حفظ في القائمة',
    back: 'رجوع',
    episodes: 'الحلقات',
    seasons: 'المواسم',
    live: 'بث حي ومباشر',
    server: 'سيرفر',
    loadMore: 'عرض المزيد',
    verifyTitle: 'حماية السيرفرات',
    verifyDesc: 'لضمان سرعة المشاهدة، يرجى الحصول على مفتاح التفعيل اليومي (صالح لمدة 24 ساعة).',
    getKey: 'استخراج مفتاح التفعيل',
    enterKey: 'اكتب الكود هنا',
    unlock: 'تفعيل المشغل',
    invalidKey: 'الكود غير صحيح!',
    activeKey: 'تم التفعيل بنجاح'
  }
};
