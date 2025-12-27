
import { TMDB_API_KEY, TMDB_BASE_URL, SERVERS } from '../constants';
import { Movie } from '../types';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const REMOTE_CONFIG_ID: string = '7896541230af'; 

export const fetchMovies = async (endpoint: string, params: string = ''): Promise<Movie[]> => {
  const url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&${params}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return (data.results || []).map((m: any) => ({ ...m, source: 'tmdb' }));
  } catch (error) {
    return [];
  }
};

export const tmdb = {
  getTrending: (lang: string) => fetchMovies('/trending/all/day', `language=${lang}`),
  getPopularMovies: (lang: string, page: number = 1) => fetchMovies('/movie/popular', `language=${lang}&page=${page}`),
  getPopularTV: (lang: string, page: number = 1) => fetchMovies('/tv/popular', `language=${lang}&page=${page}`),
  
  // دمج نتائج Jikan مع TMDB للأنمي
  getAnime: async (lang: string, page: number = 1): Promise<Movie[]> => {
    try {
      const res = await fetch(`${JIKAN_BASE_URL}/top/anime?page=${page}`);
      const data = await res.json();
      const jikanAnime = (data.data || []).map((a: any) => ({
        id: a.mal_id,
        title: a.title,
        overview: a.synopsis || "",
        poster_path: a.images.jpg.large_image_url, // رابط كامل
        vote_average: a.score || 0,
        media_type: 'anime',
        source: 'jikan'
      }));
      
      // نجيب شوية من TMDB برضه عشان التنوع
      const tmdbAnime = await fetchMovies('/discover/tv', `with_keywords=210024&with_original_language=ja&language=${lang}&page=${page}`);
      
      return [...jikanAnime, ...tmdbAnime];
    } catch (e) {
      return fetchMovies('/discover/tv', `with_keywords=210024&with_original_language=ja&language=${lang}&page=${page}`);
    }
  },

  getArabicContent: (lang: string) => fetchMovies('/discover/movie', `with_original_language=ar&language=${lang}&sort_by=popularity.desc`),
  getKoreanContent: (lang: string) => fetchMovies('/discover/movie', `with_original_language=ko&language=${lang}&sort_by=popularity.desc`),
  getInternationalMovies: (lang: string) => fetchMovies('/movie/top_rated', `language=${lang}`),
  
  search: async (query: string, lang: string): Promise<Movie[]> => {
    const tmdbResults = await fetchMovies('/search/multi', `query=${query}&language=${lang}`);
    
    // لو بنبحث عن أنمي، نزود نتائج Jikan
    try {
      const jikanRes = await fetch(`${JIKAN_BASE_URL}/anime?q=${query}&limit=5`);
      const jikanData = await jikanRes.json();
      const jikanResults = (jikanData.data || []).map((a: any) => ({
        id: a.mal_id,
        title: a.title,
        overview: a.synopsis || "",
        poster_path: a.images.jpg.large_image_url,
        vote_average: a.score || 0,
        media_type: 'anime',
        source: 'jikan'
      }));
      return [...jikanResults, ...tmdbResults];
    } catch {
      return tmdbResults;
    }
  },

  getTVDetails: async (id: number | string, source: string = 'tmdb') => {
    if (source === 'jikan') {
       const res = await fetch(`${JIKAN_BASE_URL}/anime/${id}`);
       const data = await res.json();
       return {
         id: data.data.mal_id,
         seasons: [{ season_number: 1, episode_count: data.data.episodes || 12 }]
       };
    }
    const url = `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`;
    const res = await fetch(url);
    return res.json();
  },
  
  getRemoteConfig: async () => {
    try {
      const response = await fetch(`https://api.npoint.io/${REMOTE_CONFIG_ID}`, { cache: "no-store" });
      if (!response.ok) throw new Error();
      return await response.json();
    } catch (e) {
      return SERVERS;
    }
  }
};
