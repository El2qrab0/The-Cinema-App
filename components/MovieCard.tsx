
import React from 'react';
import { Movie } from '../types';
import { TMDB_IMAGE_BASE } from '../constants';

interface Props {
  item: Movie;
  onClick: (item: Movie) => void;
}

const MovieCard: React.FC<Props> = ({ item, onClick }) => {
  const title = item.title || item.name;
  
  const poster = item.poster_path?.startsWith('http') 
    ? item.poster_path 
    : item.poster_path 
      ? `${TMDB_IMAGE_BASE}${item.poster_path}` 
      : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400';

  return (
    <div 
      className="flex-shrink-0 w-28 md:w-44 cursor-pointer group"
      onClick={() => onClick(item)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[20px] shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-red-900/40 group-hover:-translate-y-1">
        <img 
          src={poster} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.source === 'jikan' && (
            <div className="bg-blue-600 text-white text-[6px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase tracking-tighter">MAL API</div>
          )}
          <div className="bg-zinc-950/80 backdrop-blur-md text-white text-[6px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase tracking-tighter border border-white/5">4K UHD</div>
        </div>

        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg flex items-center gap-0.5">
          ★ {item.vote_average?.toFixed(1)}
        </div>

        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
           <div className="bg-white text-black text-[7px] font-black py-1.5 rounded-lg text-center uppercase tracking-widest shadow-xl">Watch Now</div>
        </div>
      </div>
      <h3 className="mt-2 text-[10px] font-black line-clamp-1 opacity-70 uppercase tracking-tighter group-hover:text-red-500 group-hover:opacity-100 transition-all">
        {title}
      </h3>
    </div>
  );
};

export default MovieCard;
