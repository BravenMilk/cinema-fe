import React, { useState } from "react";
import { X, Star, Calendar, Clock, Loader2, Play, Info, Film, AlertCircle, MonitorPlay, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function MovieDetailModal({ movie, loading, error, isOpen, onClose }) {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [isPlaying, setIsPlaying] = useState(false);

    React.useEffect(() => {
        if (!isOpen) {
            setIsPlaying(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBookingAction = () => {
        if (!token) {
            navigate("/login");
        } else {
            navigate(`/customer/booking/${movie.id}`);
        }
        onClose();
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(movie?.trailer_url);

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative z-10 w-full max-w-5xl bg-[#1e293b] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-black/20 hover:bg-rose-500 text-white rounded-full transition-all group active:scale-95">
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>

                {loading ? (
                    <div className="h-[400px] md:h-[600px] flex flex-col items-center justify-center p-12">
                        <div className="relative mb-6">
                            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                            <div className="absolute inset-0 blur-2xl bg-indigo-500/20 animate-pulse"></div>
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                            Processing Movie Intel...
                        </p>
                    </div>
                ) : error ? (
                    <div className="h-[400px] md:h-[600px] flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-6">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
                        <p className="text-slate-400 mb-8 max-w-xs">{error}</p>
                        <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-black uppercase text-xs tracking-widest transition-all">
                            Tutup
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row max-h-[90vh] md:h-[600px]">
                        <div className="w-full md:w-[40%] relative min-h-[300px] md:h-auto bg-black">
                            {isPlaying && videoId ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <>
                                    <img src={movie?.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"} alt={movie?.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000&auto=format&fit=crop";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1e293b] via-transparent to-transparent"></div>

                                    {videoId ? (
                                        <div
                                            onClick={() => setIsPlaying(true)}
                                            className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                                        >
                                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center ring-1 ring-white/20 group-hover:scale-110 group-hover:bg-indigo-600 transition-all">
                                                <Play className="w-6 h-6 text-white fill-current" />
                                            </div>
                                            <span className="absolute bottom-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Play Trailer</span>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
                                            <Youtube className="w-10 h-10 opacity-20" />
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Trailer Not Available</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex-1 p-8 md:p-14 flex flex-col overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-600/20">
                                    {movie?.rating || 'SU'}
                                </span>
                                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Cinema Experience
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.85] tracking-tighter mb-8">
                                {movie?.title}
                            </h2>

                            <div className="flex flex-wrap gap-8 items-center mb-10 pb-8 border-b border-white/5">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                    <Calendar className="w-5 h-5 text-indigo-400" /> {movie?.release_date || '2024'}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                    <Clock className="w-5 h-5 text-indigo-400" /> {movie?.duration || '120'} MIN
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-yellow-500">
                                    <Star className="w-5 h-5 fill-current" /> {movie?.average_rating ? parseFloat(movie.average_rating).toFixed(1) : '—'} <span className="text-slate-500 text-xs">({movie?.total_tickets_sold ? `${movie.total_tickets_sold.toLocaleString('id-ID')} tiket` : 'belum ada data'})</span>
                                </div>
                            </div>

                            <div className="mb-12">
                                <h4 className="text-[12px] font-black text-indigo-400  tracking-[0.2em] mb-4">Deskripsi :</h4>
                                <p className="text-slate-400 leading-relaxed italic text-sm md:text-base font-medium">
                                    {movie?.description || "Deskripsi masih kosong. Silakan kunjungi bioskop terdekat untuk informasi lebih lanjut mengenai produksi film ini."}
                                </p>
                            </div>

                            <div className="mt-auto flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleBookingAction}
                                    className="flex-1 py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-xl uppercase tracking-widest text-[10px] group"
                                >
                                    <MonitorPlay className="w-4 h-4 mr-3" /> Amankan Kursi
                                </button>
                                <button
                                    onClick={handleBookingAction}
                                    className="flex-1 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-[0.3em] text-[10px] active:scale-95 shadow-xl"
                                >
                                    Lihat Jadwal
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
