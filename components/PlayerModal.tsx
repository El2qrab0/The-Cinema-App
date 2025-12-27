
import React, { useState, useEffect, useRef } from 'react';
import { Movie } from '../types';
import { translations, SERVERS } from '../constants';
import { tmdb } from '../services/tmdbService';
import VerificationModal from './VerificationModal';

declare var Hls: any;

interface Props {
  item: Movie | null;
  language: 'ar' | 'en';
  onClose: () => void;
  servers: any;
}

type ServerKey = keyof typeof SERVERS;

const PlayerModal: React.FC<Props> = ({ item, language, onClose }) => {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [activeServer, setActiveServer] = useState<ServerKey>('vidsrc_in'); // السيرفر الجديد الافتراضي الأكثر استقراراً
  const [tvDetails, setTvDetails] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t = translations[language];

  useEffect(() => {
    const expiry = localStorage.getItem('access_expiry');
    if (expiry && parseInt(expiry) > Date.now()) {
      setIsVerified(true);
    }
    
    if (item && (item.media_type === 'tv' || item.media_type === 'anime' || !item.media_type)) {
      tmdb.getTVDetails(item.id, item.source || 'tmdb').then(data => {
        if (data) setTvDetails(data);
      }).catch(() => {});
    }
  }, [item]);

  useEffect(() => {
    if (item?.media_type === 'channel' && videoRef.current && item.stream_url) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(item.stream_url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
        return () => hls.destroy();
      }
    }
  }, [item, refreshKey]);

  if (!item) return null;

  const needsVerification = !isVerified;
  const isLive = item.media_type === 'channel';
  const isTV = item.media_type === 'tv' || item.media_type === 'anime' || (tvDetails !== null);
  
  const buildUrl = (baseUrl: string, key: string) => {
    const id = item.id;
    if (isTV) {
      if (key === 'smashy') return `${baseUrl}?tmdb=${id}&s=${season}&e=${episode}`;
      if (key === 'multi') return `${baseUrl}?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
      if (key === 'vidlink') return `${baseUrl}/tv/${id}/${season}/${episode}?primaryColor=ff0000&autoplay=true`;
      return `${baseUrl}/tv/${id}/${season}/${episode}`;
    }
    
    // Movie URLs
    if (key === 'smashy') return `${baseUrl}?tmdb=${id}`;
    if (key === 'multi') return `${baseUrl}?video_id=${id}&tmdb=1`;
    if (key === 'vidlink') return `${baseUrl}/movie/${id}?primaryColor=ff0000&autoplay=true`;
    return `${baseUrl}/movie/${id}`;
  };

  const playerUrl = isLive ? "" : buildUrl(SERVERS[activeServer].url, activeServer);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black animate-fade-in">
      {needsVerification && <VerificationModal language={language} onVerified={() => setIsVerified(true)} />}
      
      <div className="w-full h-full flex flex-col bg-black">
        <div className="flex items-center justify-between p-4 bg-zinc-900/50 backdrop-blur-xl border-b border-white/5">
          <button onClick={onClose} className="p-3 rounded-2xl bg-zinc-800 text-white active:scale-90 border border-white/5 shadow-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="flex flex-col items-center flex-1 mx-4 overflow-hidden text-center">
             <h2 className="text-[12px] font-black truncate text-white uppercase tracking-wider w-full">{item.title || item.name}</h2>
             <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{isLive ? t.live : SERVERS[activeServer].name}</span>
          </div>
          <button onClick={() => setRefreshKey(k => k + 1)} className="p-3 rounded-2xl bg-zinc-800 text-blue-400 active:scale-90 border border-white/5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>

        <div className="flex-1 bg-black relative">
          {isLive ? (
            <video ref={videoRef} className="w-full h-full object-contain" controls autoPlay /> 
          ) : (
            <iframe 
              key={`${playerUrl}-${refreshKey}`} 
              src={playerUrl} 
              className="w-full h-full bg-black" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; fullscreen"
            ></iframe>
          )}
        </div>

        <div className="bg-zinc-950 border-t border-white/5 p-4 space-y-4 pb-10">
          {!isLive && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              <span className="text-[10px] font-black text-zinc-600 uppercase flex-shrink-0 px-2">{t.selectPlayer}:</span>
              {Object.keys(SERVERS).map((key) => (
                <button 
                  key={key} 
                  onClick={() => setActiveServer(key as ServerKey)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${activeServer === key ? 'bg-red-600 border-red-500 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                >
                  {SERVERS[key as ServerKey].name}
                </button>
              ))}
            </div>
          )}

          {isTV && tvDetails && !isLive && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black text-zinc-500 uppercase">{t.episodes}</span>
                <span className="text-[10px] font-black text-red-500 uppercase">Season {season}</span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-40 overflow-y-auto no-scrollbar">
                {Array.from({ length: tvDetails.seasons?.[0]?.episode_count || 12 }).map((_, i) => (
                  <button key={i} onClick={() => setEpisode(i + 1)}
                    className={`aspect-square flex items-center justify-center rounded-xl text-[12px] font-black border-2 transition-all active:scale-90 ${episode === i + 1 ? 'bg-white border-white text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PlayerModal;
