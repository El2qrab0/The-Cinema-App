
import React, { useState, useEffect } from 'react';
import { TabType, Movie } from './types';
import { tmdb } from './services/tmdbService';
import { translations, BEIN_CHANNELS, SERVERS as LOCAL_SERVERS, APP_VERSION } from './constants';
import MovieCard from './components/MovieCard';
import PlayerModal from './components/PlayerModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [trending, setTrending] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [anime, setAnime] = useState<Movie[]>([]);
  const [arabic, setArabic] = useState<Movie[]>([]);
  const [korean, setKorean] = useState<Movie[]>([]);
  const [international, setInternational] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedItem, setSelectedItem] = useState<Movie | null>(null);
  const [playingItem, setPlayingItem] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [dynamicServers, setDynamicServers] = useState(LOCAL_SERVERS);

  const t = translations[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    const init = async () => {
      const saved = localStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
      
      try {
        const remote = await tmdb.getRemoteConfig();
        // دمج السيرفرات القادمة من الـ API مع السيرفرات المحلية
        setDynamicServers({...LOCAL_SERVERS, ...remote});
      } catch (e) {
        console.error("Remote config failed", e);
      }
      
      await loadInitialData();
      
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => {
          splash.style.display = 'none';
        }, 500);
      }
    };
    init();
  }, [language]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [trendData, movieData, tvData, animeData, arabicData, koreanData, interData] = await Promise.all([
        tmdb.getTrending(language),
        tmdb.getPopularMovies(language, 1),
        tmdb.getPopularTV(language, 1),
        tmdb.getAnime(language, 1),
        tmdb.getArabicContent(language),
        tmdb.getKoreanContent(language),
        tmdb.getInternationalMovies(language)
      ]);
      setTrending(trendData);
      setMovies(movieData);
      setSeries(tvData);
      setAnime(animeData);
      setArabic(arabicData);
      setKorean(koreanData);
      setInternational(interData);
    } catch (e) { 
      console.error("Load initial data failed", e); 
    }
    setIsLoading(false);
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    let newData: Movie[] = [];
    try {
      if (activeTab === 'movies') newData = await tmdb.getPopularMovies(language, nextPage);
      else if (activeTab === 'series') newData = await tmdb.getPopularTV(language, nextPage);
      else if (activeTab === 'anime') newData = await tmdb.getAnime(language, nextPage);
      
      if (activeTab === 'movies') setMovies(prev => [...prev, ...newData]);
      else if (activeTab === 'series') setSeries(prev => [...prev, ...newData]);
      else if (activeTab === 'anime') setAnime(prev => [...prev, ...newData]);
      setPage(nextPage);
    } catch (e) {
      console.error("Load more failed", e);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        const results = await tmdb.search(searchQuery, language);
        setSearchResults(results);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else { setSearchResults([]); }
  }, [searchQuery, language]);

  const toggleFavorite = (item: Movie) => {
    const newFavs = favorites.some(f => f.id === item.id)
      ? favorites.filter(f => f.id !== item.id)
      : [...favorites, item];
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  const isFavorite = (id: number | string) => favorites.some(f => f.id === id);

  const renderContent = () => {
    if (activeTab === 'favorites') {
      return (
        <div className="p-6 grid grid-cols-3 gap-4 pb-32 animate-fade-in">
          {favorites.length > 0 ? favorites.map(item => <MovieCard key={item.id} item={item} onClick={setSelectedItem} />) 
          : <div className="col-span-3 text-center py-20 text-zinc-800 font-black uppercase tracking-widest">{t.emptyFav}</div>}
        </div>
      );
    }

    if (activeTab === 'channels') {
      return (
        <div className="p-6 flex flex-col gap-4 pb-32 animate-fade-in">
          {BEIN_CHANNELS.map(ch => (
            <div key={ch.id} onClick={() => setPlayingItem({...ch, media_type: 'channel', stream_url: ch.url} as any)}
              className="relative group flex items-center gap-5 bg-gradient-to-r from-zinc-900 to-zinc-950 p-5 rounded-[32px] border border-white/5 active:scale-95 transition-all overflow-hidden shadow-2xl">
              <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10 pointer-events-none grayscale group-hover:grayscale-0 transition-all">
                 <img src={ch.poster} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl p-3 flex-shrink-0 shadow-2xl relative z-10">
                <img src={ch.logo} className="w-full h-full object-contain" alt="" />
              </div>
              <div className="flex-1 relative z-10">
                <h4 className="font-black text-sm uppercase tracking-tight">{ch.name}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">On Air • 4K UHD</span>
                </div>
              </div>
              <div className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl relative z-10">{t.live}</div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab !== 'home') {
       const list = activeTab === 'movies' ? movies : activeTab === 'series' ? series : anime;
       return (
        <div className="pb-32 animate-fade-in">
          <div className="px-6 py-6 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-2 h-8 bg-red-600 rounded-full"></div>
               <h2 className="text-2xl font-black uppercase tracking-tighter">{t[activeTab]}</h2>
             </div>
             <span className="text-[10px] bg-zinc-900 border border-white/5 px-3 py-1 rounded-full text-zinc-500 font-black tracking-widest">{list.length} {activeTab.toUpperCase()}</span>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4">
            {list.map((item, idx) => <MovieCard key={`${item.id}-${idx}`} item={item} onClick={setSelectedItem} />)}
          </div>
          <button onClick={loadMore} className="w-full py-16 text-zinc-800 font-black text-[11px] uppercase tracking-[0.4em] active-scale">
            {t.loadMore}
          </button>
        </div>
      );
    }

    return (
      <div className="pb-32 animate-fade-in">
        {/* Banner */}
        <div className="relative h-[500px] mx-6 mt-4 overflow-hidden rounded-[56px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] active-scale border-4 border-zinc-900 group" onClick={() => trending[0] && setSelectedItem(trending[0])}>
           <img src={trending[0] ? `https://image.tmdb.org/t/p/original${trending[0].backdrop_path}` : ''} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-10">
              <div className="flex items-center gap-3 mb-4">
                 <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">{t.trending}</span>
                 <span className="text-yellow-500 font-black text-sm flex items-center gap-1">★ {trending[0]?.vote_average?.toFixed(1)}</span>
              </div>
              <h2 className="text-4xl font-black mb-2 line-clamp-2 leading-[1] tracking-tighter uppercase">{trending[0]?.title || trending[0]?.name}</h2>
              <p className="text-[11px] text-zinc-400 font-bold line-clamp-2 max-w-sm mb-4 leading-relaxed">{trending[0]?.overview}</p>
           </div>
        </div>

        {[ 
          {title: t.arabicCinema, data: arabic, icon: '🎬', type: 'movies'}, 
          {title: t.topAnime, data: anime, icon: '㊙️', type: 'anime'}, 
          {title: t.international, data: international, icon: '🌍', type: 'movies'}, 
          {title: t.koreanWave, data: korean, icon: '🇰🇷', type: 'series'} 
        ].map((sec, idx) => (
          <section key={idx} className="mt-12">
            <div className="px-8 flex items-center justify-between mb-6">
               <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                 <span className="text-2xl drop-shadow-md">{sec.icon}</span> {sec.title}
               </h2>
               <button onClick={() => setActiveTab(sec.type as TabType)} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-800 pb-1">{t.loadMore}</button>
            </div>
            <div className="flex gap-5 overflow-x-auto px-8 no-scrollbar snap-x">
              {sec.data.map((item, i) => <div className="snap-start" key={`${item.id}-${i}`}><MovieCard item={item} onClick={setSelectedItem} /></div>)}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className={`h-full w-full bg-black text-white ${isRTL ? 'font-arabic' : 'font-english'} flex flex-col overflow-hidden`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <header className="flex-none bg-black px-8 py-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-900 rounded-[18px] flex items-center justify-center font-black text-xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] border-2 border-white/10">C</div>
           <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter leading-none">THE CINEMA</h1>
              <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-1">PREMIUM GOLD v{APP_VERSION}</span>
           </div>
        </div>
        <button onClick={() => setLanguage(l => l === 'ar' ? 'en' : 'ar')} className="px-5 py-2.5 rounded-2xl bg-zinc-900 font-black text-[10px] text-zinc-400 border border-white/5 active:scale-90 transition-all uppercase tracking-widest">
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
      </header>

      {/* Search */}
      <div className="flex-none px-8 py-2 z-50">
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input type="text" placeholder={t.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border-2 border-white/5 rounded-[24px] px-14 py-4.5 text-xs font-bold focus:outline-none focus:border-red-600/30 transition-all placeholder-zinc-700 focus:bg-zinc-900" />
          
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-zinc-950 rounded-[32px] border-2 border-white/5 shadow-[0_20px_60px_rgba(0,0,0,1)] max-h-[50vh] overflow-y-auto z-[100] p-3 no-scrollbar animate-in slide-in-from-top-4 duration-300">
              {searchResults.length > 0 ? searchResults.map(item => (
                <div key={`${item.id}-${item.media_type}`} onClick={() => {setSelectedItem(item); setSearchQuery('');}}
                  className="flex items-center gap-5 p-4 hover:bg-white/5 rounded-[20px] transition-all active:scale-95 mb-1">
                  <img src={item.poster_path?.startsWith('http') ? item.poster_path : item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=92'} className="w-12 h-16 object-cover rounded-xl shadow-lg border border-white/5" alt="" />
                  <div className="flex flex-col">
                     <span className="font-black text-xs uppercase tracking-tight">{item.title || item.name}</span>
                     <span className="text-[9px] text-zinc-500 font-bold uppercase mt-1">{item.release_date || item.first_air_date || 'N/A'}</span>
                  </div>
                </div>
              )) : <div className="text-center py-10 text-[10px] font-black text-zinc-700 uppercase tracking-widest">No Results Found</div>}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="smooth-scroll no-scrollbar pt-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-12 h-12 border-[6px] border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest animate-pulse">Synchronizing Library...</span>
          </div>
        ) : renderContent()}
      </main>

      {/* Navigation */}
      <div className="flex-none z-50 bg-black/95 backdrop-blur-3xl border-t border-white/5 pb-[env(safe-area-inset-bottom)] px-2">
        <nav className="py-3 flex justify-around items-center">
          <NavItem active={activeTab === 'home'} label={t.home} icon="home" onClick={() => setActiveTab('home')} />
          <NavItem active={activeTab === 'movies'} label={t.movies} icon="movies" onClick={() => setActiveTab('movies')} />
          <NavItem active={activeTab === 'series'} label={t.series} icon="tv" onClick={() => setActiveTab('series')} />
          <NavItem active={activeTab === 'anime'} label={t.anime} icon="anime" onClick={() => setActiveTab('anime')} />
          <NavItem active={activeTab === 'channels'} label={t.channels} icon="live" onClick={() => setActiveTab('channels')} />
          <NavItem active={activeTab === 'favorites'} label={t.favorites} icon="heart" onClick={() => setActiveTab('favorites')} />
        </nav>
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/95 backdrop-blur-md p-6 animate-fade-in" onClick={() => setSelectedItem(null)}>
          <div className="bg-zinc-900 w-full max-w-2xl rounded-[56px] p-8 shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden" onClick={e => e.stopPropagation()}>
             <div className="absolute top-0 left-0 right-0 h-48 opacity-20 pointer-events-none">
                <img src={selectedItem.backdrop_path ? `https://image.tmdb.org/t/p/original${selectedItem.backdrop_path}` : ''} className="w-full h-full object-cover blur-xl" alt="" />
             </div>
             
             <div className="relative z-10 flex flex-col sm:flex-row gap-8">
                <div className="relative mx-auto flex-shrink-0">
                  <img src={selectedItem.poster_path?.startsWith('http') ? selectedItem.poster_path : selectedItem.poster_path ? `https://image.tmdb.org/t/p/w400${selectedItem.poster_path}` : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400'} className="w-40 h-60 rounded-[32px] object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-black" alt="" />
                  <div className="absolute -bottom-3 -right-3 bg-red-600 text-white font-black p-4 rounded-3xl shadow-2xl border-4 border-black active:scale-90 transition-all cursor-pointer" onClick={() => {setPlayingItem(selectedItem); setSelectedItem(null);}}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
                   <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                      <span className="bg-red-600/10 text-red-500 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-500/20">{(selectedItem.media_type || 'movie').toUpperCase()}</span>
                      <span className="text-yellow-500 font-black text-sm flex items-center gap-1">★ {selectedItem.vote_average?.toFixed(1)}</span>
                   </div>
                   <h2 className="text-3xl font-black mb-3 line-clamp-2 leading-none uppercase tracking-tighter">{selectedItem.title || selectedItem.name}</h2>
                   <p className="text-[11px] text-zinc-500 font-bold mb-6 line-clamp-4 leading-relaxed tracking-wide">{selectedItem.overview || 'No overview available for this title.'}</p>
                   
                   <div className="flex gap-4">
                      <button onClick={() => toggleFavorite(selectedItem)} className={`p-4 rounded-[20px] active:scale-90 transition-all border-2 ${isFavorite(selectedItem.id) ? 'bg-red-600 border-red-500 text-white shadow-xl shadow-red-900/40' : 'bg-zinc-800 border-white/5 text-zinc-400'}`}>
                        <svg className="w-6 h-6" fill={isFavorite(selectedItem.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </button>
                      <button onClick={() => {setPlayingItem(selectedItem); setSelectedItem(null);}} className="flex-1 bg-white text-black rounded-[20px] font-black uppercase text-[11px] tracking-[0.3em] active:scale-95 shadow-2xl transition-all">
                        {t.watchNow}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {playingItem && <PlayerModal item={playingItem} language={language} onClose={() => setPlayingItem(null)} servers={dynamicServers} />}
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; label: string; icon: string; onClick: () => void }> = ({ active, label, icon, onClick }) => {
  const getIcon = () => {
    switch(icon) {
      case 'home': return <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
      case 'movies': return <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />;
      case 'tv': return <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
      case 'anime': return <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />;
      case 'live': return <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />;
      case 'heart': return <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />;
      default: return null;
    }
  };

  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${active ? 'text-red-600' : 'text-zinc-700'}`}>
      <div className={`p-2.5 rounded-[16px] transition-all ${active ? 'bg-red-600/10' : ''}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={active ? 3 : 2} viewBox="0 0 24 24">{getIcon()}</svg>
      </div>
      <span className="text-[7.5px] font-black uppercase tracking-[0.1em] text-center line-clamp-1">{label}</span>
    </button>
  );
};

export default App;
