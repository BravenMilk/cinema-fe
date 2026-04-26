import React, { useState } from "react";
import { X, Star, Calendar, Clock, Loader2, Play, Film, AlertCircle, MonitorPlay, Youtube, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function MovieDetailModal({ movie, loading, error, isOpen, onClose }) {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [isPlaying, setIsPlaying] = useState(false);

    React.useEffect(() => {
        if (!isOpen) setIsPlaying(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBooking = () => {
        onClose();
        if (!token) {
            navigate("/login");
        } else {
            navigate(`/customer/booking/${movie.id}`);
        }
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(movie?.trailer_url);

    return (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center sm:p-6 overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-xl transition-opacity" style={{ background: 'rgba(0,0,0,0.92)' }} onClick={onClose} />

            <div className="relative z-10 w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-fade-in"
                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', maxHeight: '95vh' }}
                onClick={e => e.stopPropagation()}>

                {/* Close button */}
                <button onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2.5 rounded-full transition-all group"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e50914'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                    <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform" />
                </button>

                {loading ? (
                    <div className="h-[400px] flex flex-col items-center justify-center p-12">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#e50914' }} />
                        <p className="text-xs font-black uppercase tracking-widest animate-pulse" style={{ color: '#555555' }}>
                            Memuat Data Film...
                        </p>
                    </div>
                ) : error ? (
                    <div className="h-[400px] flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                            style={{ background: 'rgba(229,9,20,0.1)' }}>
                            <AlertCircle className="w-8 h-8" style={{ color: '#e50914' }} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Gagal memuat film</h3>
                        <p className="text-sm mb-6" style={{ color: '#555555' }}>{error}</p>
                        <button onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#ffffff' }}>
                            Tutup
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row overflow-y-auto md:overflow-hidden" style={{ maxHeight: '95vh' }}>
                        {/* Poster / Trailer */}
                        <div className="w-full md:w-[38%] relative flex-shrink-0" style={{ minHeight: '260px', maxHeight: '420px', background: '#000' }}>
                            {isPlaying && videoId ? (
                                <iframe className="w-full h-full absolute inset-0"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                    title="Trailer"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen />
                            ) : (
                                <>
                                    <img
                                        src={movie?.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"}
                                        alt={movie?.title}
                                        className="w-full h-full object-cover"
                                        style={{ minHeight: '260px', maxHeight: '420px' }}
                                        onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000"; }}
                                    />
                                    <div className="absolute inset-0"
                                        style={{ background: 'linear-gradient(to top, #111111 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />

                                    {videoId ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
                                            onClick={() => setIsPlaying(true)}>
                                            <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                                                style={{ background: 'rgba(229,9,20,0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 0 30px rgba(229,9,20,0.5)' }}>
                                                <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                                            </div>
                                            <span className="mt-3 text-xs font-black uppercase tracking-widest transition-colors"
                                                style={{ color: 'rgba(255,255,255,0.4)' }}>
                                                Play Trailer
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                            <Youtube className="w-8 h-8 opacity-10 text-white" />
                                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>
                                                Trailer Tidak Tersedia
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto" style={{ maxHeight: '95vh' }}>
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-5 flex-wrap">
                                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                                    style={{ background: '#e50914', color: '#ffffff' }}>
                                    {movie?.rating || 'SU'}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#888888' }}>
                                    Now Showing
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-tight tracking-tighter text-white mb-6">
                                {movie?.title}
                            </h2>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-5 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#888888' }}>
                                    <Calendar className="w-4 h-4" style={{ color: '#e50914' }} />
                                    {movie?.release_date || '2024'}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#888888' }}>
                                    <Clock className="w-4 h-4" style={{ color: '#e50914' }} />
                                    {movie?.duration || '120'} MIN
                                </div>
                                {movie?.average_rating && (
                                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#fbbf24' }}>
                                        <Star className="w-4 h-4 fill-current" />
                                        {parseFloat(movie.average_rating).toFixed(1)}
                                        {movie?.total_tickets_sold && (
                                            <span className="text-xs" style={{ color: '#555555' }}>
                                                ({movie.total_tickets_sold.toLocaleString('id-ID')} tiket)
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-8 flex-1">
                                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#e50914' }}>Sinopsis</p>
                                <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>
                                    {movie?.description || "Deskripsi belum tersedia. Kunjungi bioskop terdekat untuk informasi lebih lanjut."}
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <button onClick={handleBooking}
                                    className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                    style={{ background: '#e50914', color: '#ffffff', boxShadow: '0 8px 24px rgba(229,9,20,0.25)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                                    {token
                                        ? <><MonitorPlay className="w-4 h-4" /> Amankan Kursi</>
                                        : <><LogIn className="w-4 h-4" /> Masuk untuk Booking</>
                                    }
                                </button>
                                <button onClick={onClose}
                                    className="sm:w-auto px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#888888' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#ffffff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#888888'; }}>
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
