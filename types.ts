
export interface Movie {
  id: number | string;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type: 'movie' | 'tv' | 'channel' | 'anime';
  stream_url?: string; 
  source?: 'tmdb' | 'jikan'; // معرفة المصدر
}

export type TabType = 'home' | 'movies' | 'series' | 'anime' | 'channels' | 'favorites';

export interface AppState {
  language: 'ar' | 'en';
  favorites: Movie[];
  activeTab: TabType;
}
