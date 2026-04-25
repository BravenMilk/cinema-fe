import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Play, ChevronRight, Search, SlidersHorizontal, ChevronLeft, Clapperboard, Star, Calendar, Clock } from "lucide-react";
import { useMovies } from "../../../hooks/global/Movies/useMovies";

const cardBorder = { border: '1px solid rgba(255,255,255,0.06)' };

export default function CustomerMovieList() {
  const navigate = useNavigate();
  const { movies, loading, error, meta, page, search, rating, setSearch, setRating, setPage } = useMovies();
  const [searchInput, setSearchInput] = useState(search);
  const [isOpenRating, setIsOpenRating] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpenRating && !e.target.closest('.rating-dropdown')) setIsOpenRating(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpenRating]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput, setSearch]);

  const ratings = [
    { value: "SU", label: "SU — Semua Umur" },
    { value: "R13", label: "R13+" },
    { value: "D17", label: "D17+" }
  ];

  return (
    <div className="p-5 md:p-8 min-h-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Now <span className="red-shimmer">Playing</span></h1>
          <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: 'rgba(229,9,20,0.5)' }}>
            {meta?.total || 0} film tersedia
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" style={{ color: '#555555' }} />
            <input type="text" placeholder="Cari judul film..."
              value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-72 pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', ...cardBorder }}
              onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.boxShadow = 'none'; }}
            />
            {loading && searchInput && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: '#e50914' }} />}
          </div>

          {/* Rating filter */}
          <div className="relative rating-dropdown">
            <button onClick={() => setIsOpenRating(!isOpenRating)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full sm:w-auto"
              style={{ background: 'rgba(255,255,255,0.04)', ...cardBorder, color: rating ? '#e50914' : '#a0a0a0' }}>
              <SlidersHorizontal className="w-4 h-4" />
              <span>{ratings.find(r => r.value === rating)?.label || "Semua Rating"}</span>
              <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-transform ${isOpenRating ? 'rotate-90' : ''}`} />
            </button>
            {isOpenRating && (
              <div className="absolute top-full right-0 mt-2 w-52 rounded-xl overflow-hidden z-50"
                style={{ background: '#111111', border: '1px solid rgba(229,9,20,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                <button onClick={() => { setRating(""); setIsOpenRating(false); }}
                  className="w-full text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors"
                  style={{ color: !rating ? '#e50914' : '#a0a0a0', background: !rating ? 'rgba(229,9,20,0.08)' : 'transparent' }}>
                  Semua Rating
                </button>
                {ratings.map(r => (
                  <button key={r.value} onClick={() => { setRating(r.value); setIsOpenRating(false); }}
                    className="w-full text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors"
                    style={{ color: rating === r.value ? '#e50914' : '#a0a0a0', background: rating === r.value ? 'rgba(229,9,20,0.08)' : 'transparent' }}>
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* States */}
      {loading && movies.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: '#e50914' }} />
          <p className="text-xs uppercase tracking-widest animate-pulse" style={{ color: 'rgba(229,9,20,0.5)' }}>Memuat film...</p>
        </div>
      ) : error ? (
        <div className="p-10 rounded-2xl text-center" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center opacity-40">
          <Clapperboard className="w-14 h-14 mb-4" style={{ color: '#555555' }} />
          <p className="text-xs uppercase tracking-widest" style={{ color: '#555555' }}>Tidak ada film ditemukan</p>
          <button onClick={() => { setSearchInput(''); setRating(''); }} className="mt-4 text-xs font-semibold transition-colors" style={{ color: '#e50914' }}>
            Reset Filter
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {movies.map((movie) => (
              <div key={movie.id}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                style={{ background: '#111111', ...cardBorder }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(229,9,20,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
                onClick={() => navigate(`/customer/movies/${movie.id}`)}>

                {/* Poster */}
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img src={movie.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600"; }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 50%)' }} />

                  {/* Rating badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ background: '#e50914', color: '#ffffff' }}>
                      {movie.rating || 'SU'}
                    </span>
                  </div>

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform"
                      style={{ background: '#e50914', boxShadow: '0 0 30px rgba(229,9,20,0.5)' }}>
                      <Play className="w-5 h-5 fill-current text-white" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="w-3 h-3 fill-current" style={{ color: '#e50914' }} />
                    <span className="text-xs font-semibold" style={{ color: '#e50914' }}>4.9</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1 mb-3">{movie.title}</h4>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" style={{ color: '#555555' }} />
                        <span className="text-xs" style={{ color: '#555555' }}>{movie.release_date?.slice(0, 4) || '2024'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" style={{ color: '#555555' }} />
                        <span className="text-xs" style={{ color: '#555555' }}>{movie.duration || '120'}m</span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(229,9,20,0.08)' }}>
                      <ChevronRight className="w-3 h-3" style={{ color: '#e50914' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta?.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button disabled={page === 1 || loading} onClick={() => setPage(page - 1)}
                className="p-2.5 rounded-xl transition-all disabled:opacity-20"
                style={{ background: 'rgba(255,255,255,0.04)', ...cardBorder, color: '#a0a0a0' }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', ...cardBorder }}>
                {[...Array(meta.last_page)].map((_, i) => {
                  const p = i + 1;
                  if (p === 1 || p === meta.last_page || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className="w-9 h-9 rounded-lg text-xs font-bold transition-all"
                        style={page === p ? { background: '#e50914', color: '#ffffff' } : { color: '#555555' }}>
                        {p}
                      </button>
                    );
                  } else if (p === page - 2 || p === page + 2) {
                    return <span key={p} className="text-xs px-1" style={{ color: '#333333' }}>…</span>;
                  }
                  return null;
                })}
              </div>
              <button disabled={page >= meta.last_page || loading} onClick={() => setPage(page + 1)}
                className="p-2.5 rounded-xl transition-all disabled:opacity-20"
                style={{ background: 'rgba(255,255,255,0.04)', ...cardBorder, color: '#a0a0a0' }}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
