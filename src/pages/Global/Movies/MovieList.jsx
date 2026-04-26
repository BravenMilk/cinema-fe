import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Loader2, ChevronRight, Search, SlidersHorizontal, ChevronLeft, Clapperboard, Sparkles } from "lucide-react";
import PublicHeader from "../../../components/Global/PublicHeader";
import MovieDetailModal from "../../../components/Global/Movies/MovieDetailModal";
import { useMovies } from "../../../hooks/global/Movies/useMovies";
import { useMovieDetail } from "../../../hooks/global/Movies/useMovieDetail";
import { useLatestMovies } from "../../../hooks/global/Movies/useLatestMovies";

export default function MovieList() {
    const { movies, loading, error, meta, page, search, rating, setSearch, setRating, setPage } = useMovies();
    const { movie: selectedMovie, loading: loadingDetail, error: errorDetail, isOpen, fetchMovieDetail, closeModal } = useMovieDetail();
    const { movies: latestMovies, loading: loadingLatest } = useLatestMovies(8);
    const [searchInput, setSearchInput] = useState(search);
    const [isOpenRating, setIsOpenRating] = useState(false);
    const scrollRef = useRef(null);
    const location = useLocation();

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

    const handleOpenDetail = (id) => fetchMovieDetail(id);
    const isDashboard = location.pathname.includes('/customer/');

    const ratings = [
        { value: "SU", label: "SU (Semua Umur)" },
        { value: "R13", label: "R13+" },
        { value: "D17", label: "D17+" }
    ];

    if (loading && movies.length === 0 && !searchInput) {
        return (
            <div className={`flex flex-col items-center justify-center ${isDashboard ? 'h-[400px]' : 'min-h-screen'}`}
                style={{ background: isDashboard ? 'transparent' : '#0a0a0a' }}>
                <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#e50914' }} />
                <p className="text-xs font-medium animate-pulse tracking-widest uppercase" style={{ color: '#a0a0a0' }}>CinePass Engine Initializing...</p>
            </div>
        );
    }

    return (
        <div style={{ background: isDashboard ? 'transparent' : '#0a0a0a', color: '#ffffff', minHeight: isDashboard ? 'auto' : '100vh' }}>
            {!isDashboard && <PublicHeader />}

            <MovieDetailModal movie={selectedMovie} loading={loadingDetail} error={errorDetail} isOpen={isOpen} onClose={closeModal} />

            <main className="max-w-7xl mx-auto px-6 py-2 pb-24 md:px-12">

                {/* Section Terbaru */}
                {!search && !rating && (
                    <div className="mb-2">
                        <div className="flex items-center gap-3 mb-5">
                            <h2 className="text-xl font-black uppercase tracking-widest" style={{ color: '#ffffff' }}>Recomendasi</h2>
                        </div>

                        {loadingLatest ? (
                            <div className="flex gap-4 overflow-hidden">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex-shrink-0 w-36 md:w-44 aspect-[2/3] rounded-2xl animate-pulse"
                                        style={{ background: 'rgba(255,255,255,0.06)' }} />
                                ))}
                            </div>
                        ) : (
                            <div className="relative">
                                <div ref={scrollRef}
                                    className="flex gap-4 overflow-x-auto pb-3"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                    {latestMovies.map((movie) => (
                                        <div key={movie.id}
                                            className="flex-shrink-0 w-36 md:w-44 group cursor-pointer"
                                            onClick={() => handleOpenDetail(movie.id)}>
                                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl transition-all duration-300"
                                                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.5)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                                <img
                                                    src={movie.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600"; }}
                                                />
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3"
                                                    style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), transparent)' }}>
                                                    <span className="w-full text-center text-xs font-black uppercase tracking-widest py-2 rounded-xl"
                                                        style={{ background: '#e50914', color: '#fff' }}>Detail</span>
                                                </div>
                                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-black uppercase"
                                                    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    {movie.rating || 'SU'}
                                                </div>
                                            </div>
                                            <p className="mt-2 text-xs font-black uppercase text-center line-clamp-1 tracking-wide" style={{ color: '#ffffff' }}>
                                                {movie.title}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {page === 1 && !search && !rating && (latestMovies[0] || movies[0]) && (() => {
                    const heroMovie = latestMovies[0] || movies[0];
                    return (
                        <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden mb-16 group cursor-pointer"
                            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
                            onClick={() => handleOpenDetail(heroMovie.id)}>
                            <img
                                src={heroMovie.poster_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728"}
                                alt={heroMovie.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000"; }}
                            />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.4) 50%, transparent 100%)' }} />
                        </div>
                    );
                })()}

                {/* Search & filter */}
                <div className="mb-10 flex flex-col md:flex-row gap-5 items-center">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: '#555555' }} />
                        <input
                            type="text"
                            placeholder="Cari judul film..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl font-medium focus:outline-none transition-all"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                            onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                        />
                        {loading && searchInput && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: '#e50914' }} />}
                    </div>

                    <div className="relative w-full md:w-56 rating-dropdown">
                        <button
                            onClick={() => setIsOpenRating(!isOpenRating)}
                            className="w-full flex items-center justify-between pl-12 pr-6 py-4 rounded-2xl font-bold transition-all"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: isOpenRating ? '1px solid rgba(229,9,20,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                color: '#ffffff'
                            }}>
                            <SlidersHorizontal className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isOpenRating ? '' : ''}`}
                                style={{ color: isOpenRating ? '#e50914' : '#555555' }} />
                            <span className="truncate">{ratings.find(r => r.value === rating)?.label || "Semua Rating"}</span>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpenRating ? 'rotate-90' : 'rotate-0'}`} style={{ color: '#555555' }} />
                        </button>

                        {isOpenRating && (
                            <div className="absolute top-full left-0 w-full mt-3 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                style={{ background: '#111111', border: '1px solid rgba(229,9,20,0.2)' }}>
                                <div className="py-2">
                                    <button
                                        onClick={() => { setRating(""); setIsOpenRating(false); }}
                                        className="w-full text-left px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors"
                                        style={{ background: !rating ? 'rgba(229,9,20,0.1)' : 'transparent', color: !rating ? '#e50914' : '#a0a0a0' }}>
                                        Semua Rating
                                    </button>
                                    {ratings.map(r => (
                                        <button
                                            key={r.value}
                                            onClick={() => { setRating(r.value); setIsOpenRating(false); }}
                                            className="w-full text-left px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors"
                                            style={{ background: rating === r.value ? 'rgba(229,9,20,0.1)' : 'transparent', color: rating === r.value ? '#e50914' : '#a0a0a0' }}>
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {error ? (
                    <div className="p-8 rounded-2xl text-center" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                        <p className="font-bold" style={{ color: '#f87171' }}>{error}</p>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="py-20 text-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Clapperboard className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: '#555555' }} />
                        <p className="text-lg font-medium" style={{ color: '#555555' }}>
                            Tidak ada film yang ditemukan untuk "{searchInput}"
                        </p>
                        <button
                            onClick={() => { setSearchInput(''); setRating(''); }}
                            className="mt-4 text-sm font-bold uppercase tracking-widest transition-colors"
                            style={{ color: '#e50914' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ff1a1a'}
                            onMouseLeave={e => e.currentTarget.style.color = '#e50914'}>
                            Bersihkan Filter
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 flex items-center justify-between">
                            <h3 className="text-lg font-black tracking-tight uppercase flex items-center gap-3">
                                {search || rating ? 'Search Results' : 'Recomendasi Lainya'}
                                <span className="text-xs font-black py-1 px-3 rounded-lg normal-case not-italic tracking-widest"
                                    style={{ background: 'rgba(255,255,255,0.05)', color: '#555555' }}>
                                    {meta.total} ITEMS
                                </span>
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {movies.map((movie) => (
                                <div key={movie.id} className="group cursor-pointer" onClick={() => handleOpenDetail(movie.id)}>
                                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-2xl transition-all duration-300"
                                        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(229,9,20,0.1)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 32px 80px rgba(0,0,0,0.3)'; }}>
                                        <img
                                            src={movie.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000"; }}
                                        />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5"
                                            style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), transparent)' }}>
                                            <button className="w-full py-3 font-black rounded-xl text-xs uppercase tracking-widest"
                                                style={{ background: '#e50914', color: '#ffffff' }}>
                                                Detail Film
                                            </button>
                                        </div>
                                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-black uppercase"
                                            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>
                                            {movie.rating || 'SU'}
                                        </div>
                                    </div>
                                    <h4 className="font-black text-base leading-tight mb-1 line-clamp-1 uppercase text-center transition-colors"
                                        style={{ color: '#ffffff' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#e50914'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}>
                                        {movie.title}
                                    </h4>
                                    <p className="text-xs font-black uppercase tracking-widest text-center" style={{ color: '#555555' }}>
                                        {movie.release_date || '2024'} • {movie.duration || '120'} MIN
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-20 flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                                    onMouseEnter={e => { if (page !== 1) e.currentTarget.style.background = '#e50914'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="px-6 py-3 rounded-2xl flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <span className="text-sm font-black" style={{ color: '#e50914' }}>{page}</span>
                                    <span className="text-xs font-bold" style={{ color: '#555555' }}>of</span>
                                    <span className="text-sm font-black text-white">{meta.last_page}</span>
                                </div>

                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= meta.last_page}
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                                    onMouseEnter={e => { if (page < meta.last_page) e.currentTarget.style.background = '#e50914'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
