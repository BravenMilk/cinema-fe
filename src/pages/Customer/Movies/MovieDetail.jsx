import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Calendar, Clock, Loader2, Play, AlertCircle, MonitorPlay, ArrowLeft, Send, User, Pencil, Trash2 } from "lucide-react";
import { getMovieById } from "../../../api/global/Movies/MovieApi";
import { useAuth } from "../../../context/AuthContext";
import { useMovieReviews } from "../../../hooks/global/Reviews/useMovieReviews";

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reviews — connected to backend
  const {
    reviews, averageRating, totalReviews, myReview, canReview,
    loading: reviewLoading, submitting,
    submitReview, editReview, removeReview
  } = useMovieReviews(movieId);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && myReview) {
      setUserRating(myReview.rating);
      setReviewText(myReview.comment || '');
    }
  }, [isEditing, myReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userRating || !reviewText.trim()) return;
    const fn = isEditing ? editReview : submitReview;
    const result = await fn(userRating, reviewText.trim());
    if (result.success) {
      setSubmitMsg({ type: 'success', text: isEditing ? 'Ulasan berhasil diperbarui!' : 'Ulasan berhasil dikirim!' });
      setUserRating(0); setReviewText(''); setIsEditing(false);
    } else {
      setSubmitMsg({ type: 'error', text: result.message || 'Gagal mengirim ulasan.' });
    }
    setTimeout(() => setSubmitMsg(null), 3000);
  };

  const handleDelete = async () => {
    if (!window.confirm('Hapus ulasan kamu?')) return;
    await removeReview();
  };

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    setError(null);
    getMovieById(movieId)
      .then(res => {
        const data = res?.data || res;
        setMovie(data);
      })
      .catch(() => setError("Gagal memuat detail film."))
      .finally(() => setLoading(false));
  }, [movieId]);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleBook = () => {
    if (!token) navigate("/login");
    else navigate(`/customer/booking/${movieId}`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: '#e50914' }} />
      <p className="text-xs uppercase tracking-widest animate-pulse" style={{ color: '#444' }}>Memuat detail film...</p>
    </div>
  );

  if (error || !movie) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <AlertCircle className="w-12 h-12 mb-4" style={{ color: '#e50914' }} />
      <h3 className="text-lg font-bold text-white mb-2">Film tidak ditemukan</h3>
      <button onClick={() => navigate(-1)} className="btn-red px-6 py-2.5 rounded-xl text-sm font-semibold mt-4">Kembali</button>
    </div>
  );

  const videoId = getYouTubeId(movie.trailer_url);

  return (
    <div className="min-h-screen page-enter" style={{ background: '#0a0a0a' }}>
      {/* Hero backdrop */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] overflow-hidden">
        <img
          src={movie.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"}
          alt={movie.title}
          className="w-full h-full object-cover"
          style={{ filter: 'blur(2px) brightness(0.3)', transform: 'scale(1.05)' }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600"; }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.7) 60%, #0a0a0a 100%)' }} />

        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(8px)' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(229,9,20,0.5)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-32 sm:-mt-40 relative z-10 pb-16">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Poster */}
          <div className="w-36 sm:w-48 shrink-0 mx-auto sm:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '2px solid rgba(229,9,20,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
              <img
                src={movie.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
                onError={e => { e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600"; }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#e50914', color: '#fff' }}>
                {movie.rating || 'SU'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.08)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' }}>
                Cinema
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 uppercase tracking-tight">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-6">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-current" style={{ color: '#fbbf24' }} />
                <span className="text-sm font-bold" style={{ color: '#fbbf24' }}>
                  {averageRating ? averageRating.toFixed(1) : '—'}
                </span>
                <span className="text-xs" style={{ color: '#555' }}>
                  ({totalReviews} ulasan)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" style={{ color: '#e50914' }} />
                <span className="text-sm" style={{ color: '#aaa' }}>{movie.release_date || '2024'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" style={{ color: '#e50914' }} />
                <span className="text-sm" style={{ color: '#aaa' }}>{movie.duration || '120'} menit</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleBook}
                className="btn-red flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold">
                <MonitorPlay className="w-4 h-4" /> Pesan Tiket Sekarang
              </button>
              {videoId && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="btn-ghost flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold">
                  <Play className="w-4 h-4 fill-current" style={{ color: '#e50914' }} /> Tonton Trailer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trailer player */}
        {isPlaying && videoId && (
          <div className="mt-8 rounded-2xl overflow-hidden relative" style={{ paddingBottom: '56.25%', border: '1px solid rgba(229,9,20,0.2)' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Description */}
        <div className="mt-8 rounded-2xl p-6" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-base font-bold text-white mb-1">Sinopsis</h2>
          <div className="h-0.5 w-10 mb-4 rounded-full" style={{ background: '#e50914' }} />
          <p className="text-sm leading-relaxed" style={{ color: '#888' }}>
            {movie.description || "Deskripsi film belum tersedia. Kunjungi bioskop terdekat untuk informasi lebih lanjut mengenai film ini."}
          </p>
        </div>

        {/* Details grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Rating', value: movie.rating || 'SU' },
            { label: 'Durasi', value: `${movie.duration || 120} menit` },
            { label: 'Rilis', value: movie.release_date || '2024' },
            { label: 'Genre', value: movie.genre || 'Drama' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-4 text-center" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#444' }}>{label}</p>
              <p className="text-sm font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* CTA bottom */}
        <div className="mt-8 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(229,9,20,0.08), rgba(229,9,20,0.03))', border: '1px solid rgba(229,9,20,0.2)' }}>
          <div>
            <h3 className="text-base font-bold text-white">Siap menonton?</h3>
            <p className="text-sm mt-0.5" style={{ color: '#666' }}>Pilih jadwal dan kursi favoritmu sekarang</p>
          </div>
          <button onClick={handleBook}
            className="btn-red flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap">
            <MonitorPlay className="w-4 h-4" /> Pesan Sekarang
          </button>
        </div>

        {/* Rating & Reviews */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Rating & Ulasan</h2>
              <div className="h-0.5 w-10 mt-1.5 rounded-full" style={{ background: '#e50914' }} />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <Star className="w-4 h-4 fill-current" style={{ color: '#fbbf24' }} />
              <span className="text-sm font-black text-white">{averageRating ? averageRating.toFixed(1) : '—'}</span>
              <span className="text-xs" style={{ color: '#666' }}>({totalReviews} ulasan)</span>
            </div>
          </div>

          {/* Review form area */}
          {token ? (
            <>
              {/* User already reviewed — show their review with edit/delete */}
              {myReview && !isEditing ? (
                <div className="mb-6 p-5 rounded-2xl relative" style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.2)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#e50914' }}>Ulasan Kamu</span>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className="w-3.5 h-3.5"
                            style={{ color: s <= myReview.rating ? '#fbbf24' : '#333', fill: s <= myReview.rating ? '#fbbf24' : 'transparent' }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: '#888', background: 'rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#888'}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={handleDelete} disabled={submitting}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: '#aaa' }}>{myReview.comment}</p>
                </div>
              ) : canReview || isEditing ? (
                /* Form tulis/edit ulasan */
                <div className="mb-6 p-5 rounded-2xl" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm font-semibold text-white mb-4">
                    {isEditing ? 'Edit Ulasanmu' : 'Tulis Ulasanmu'}
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110">
                        <Star className="w-7 h-7 transition-colors"
                          style={{ color: star <= (hoverRating || userRating) ? '#fbbf24' : '#333', fill: star <= (hoverRating || userRating) ? '#fbbf24' : 'transparent' }} />
                      </button>
                    ))}
                    {userRating > 0 && (
                      <span className="ml-2 text-xs font-semibold" style={{ color: '#fbbf24' }}>
                        {['','Buruk','Kurang','Cukup','Bagus','Luar Biasa!'][userRating]}
                      </span>
                    )}
                  </div>
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                      placeholder="Bagikan pengalamanmu menonton film ini..." rows={2}
                      className="flex-1 px-4 py-3 rounded-xl text-sm text-white resize-none focus:outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(229,9,20,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                    <div className="flex flex-col gap-2 self-end">
                      <button type="submit" disabled={!userRating || !reviewText.trim() || submitting}
                        className="px-4 py-3 rounded-xl transition-all disabled:opacity-30 flex items-center justify-center"
                        style={{ background: '#e50914', color: '#fff' }}>
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                      {isEditing && (
                        <button type="button" onClick={() => { setIsEditing(false); setUserRating(0); setReviewText(''); }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', color: '#666' }}>
                          Batal
                        </button>
                      )}
                    </div>
                  </form>
                  {submitMsg && (
                    <p className="text-xs mt-2 animate-fade-in"
                      style={{ color: submitMsg.type === 'success' ? '#4ade80' : '#f87171' }}>
                      {submitMsg.type === 'success' ? '✓' : '✗'} {submitMsg.text}
                    </p>
                  )}
                </div>
              ) : (
                /* Belum beli tiket */
                <div className="mb-6 p-4 rounded-2xl flex items-center gap-3"
                  style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
                  <AlertCircle className="w-4 h-4 shrink-0" style={{ color: '#fbbf24' }} />
                  <p className="text-sm" style={{ color: '#888' }}>
                    Kamu harus <span style={{ color: '#fbbf24' }}>membeli tiket</span> film ini terlebih dahulu untuk bisa memberikan ulasan.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="mb-6 p-4 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
              <p className="text-sm" style={{ color: '#555' }}>
                <button onClick={() => navigate('/login')} className="font-semibold" style={{ color: '#e50914' }}>Login</button>{' '}untuk menulis ulasan
              </p>
            </div>
          )}

          {/* Reviews list */}
          {reviewLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#e50914' }} />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)' }}>
              <p className="text-sm" style={{ color: '#444' }}>Belum ada ulasan untuk film ini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="p-5 rounded-2xl" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)', color: '#e50914' }}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{review.user?.name || 'Pengguna'}</p>
                        <p className="text-xs" style={{ color: '#444' }}>
                          {review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-3.5 h-3.5"
                          style={{ color: s <= review.rating ? '#fbbf24' : '#333', fill: s <= review.rating ? '#fbbf24' : 'transparent' }} />
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
