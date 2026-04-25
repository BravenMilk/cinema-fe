import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, Loader2, Search, QrCode, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCustomerBookings } from '../../../hooks/customer/useCustomerBookings';
import { cancelBooking } from '../../../api/customer/CustomerApi';
import TicketModal from '../../../components/Global/Bookings/TicketModal';

const cardBorder = { border: '1px solid rgba(255,255,255,0.06)' };

const statusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid': return { color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' };
    case 'pending': return { color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' };
    case 'failed':
    case 'expired': return { color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' };
    default: return { color: '#a0a0a0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
  }
};

export default function MyBookings() {
  const navigate = useNavigate();
  const { bookings, loading, error, meta, page, setPage, search, setSearch, refresh } = useCustomerBookings();
  const [searchInput, setSearchInput] = useState(search);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, setSearch, setPage]);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

  const handleCancel = async (bookingCode) => {
    if (window.confirm('Yakin ingin membatalkan pesanan ini?')) {
      try { await cancelBooking(bookingCode); refresh(); }
      catch { alert('Gagal membatalkan pesanan.'); }
    }
  };

  return (
    <div className="p-5 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My <span className="red-shimmer">Bookings</span></h1>
          <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: 'rgba(229,9,20,0.5)' }}>Riwayat pemesanan tiket</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" style={{ color: '#555555' }} />
          <input type="text" placeholder="Cari kode booking..."
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            className="w-full sm:w-72 pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', ...cardBorder }}
            onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.boxShadow = 'none'; }} />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl text-sm text-center" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', color: '#f87171' }}>
          {error}
        </div>
      )}

      <div className="relative min-h-[400px]">
        {loading && bookings.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: '#e50914' }} />
            <p className="text-xs uppercase tracking-widest animate-pulse" style={{ color: 'rgba(229,9,20,0.5)' }}>Memuat booking...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-16 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(229,9,20,0.15)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(229,9,20,0.06)' }}>
              <Ticket className="w-9 h-9" style={{ color: 'rgba(229,9,20,0.3)' }} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Belum Ada Tiket</h3>
            <p className="text-sm" style={{ color: '#555555' }}>
              {searchInput ? `Tidak ada hasil untuk "${searchInput}"` : "Kamu belum memesan tiket apapun."}
            </p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {bookings.map((booking) => (
                <div key={booking.id} className="rounded-2xl p-6 group transition-all duration-300 relative overflow-hidden"
                  style={{ background: '#111111', ...cardBorder }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(229,9,20,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>

                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5" style={{ background: '#e50914' }} />

                  {/* Top row */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={statusStyle(booking.status)}>
                      {booking.status}
                    </span>
                    <span className="text-xs font-mono" style={{ color: '#555555' }}>{booking.booking_code}</span>
                  </div>

                  {/* Content */}
                  <div className="flex gap-5">
                    <div className="w-24 h-32 rounded-xl shrink-0 flex items-center justify-center relative overflow-hidden"
                      style={{ background: 'rgba(229,9,20,0.05)', border: '1px solid rgba(229,9,20,0.1)' }}>
                      <Ticket className="w-8 h-8 opacity-20" style={{ color: '#e50914' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-white mb-3 line-clamp-1">
                        {booking.showtime?.movie?.title || 'Unknown Movie'}
                      </h2>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(229,9,20,0.4)' }} />
                          <span className="text-xs truncate" style={{ color: '#a0a0a0' }}>
                            {booking.showtime?.hall?.cinema?.name} · {booking.showtime?.hall?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(229,9,20,0.4)' }} />
                          <span className="text-xs" style={{ color: '#a0a0a0' }}>
                            {new Date(booking.showtime?.start_time).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(229,9,20,0.4)' }} />
                          <span className="text-xs" style={{ color: '#a0a0a0' }}>
                            {new Date(booking.showtime?.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'rgba(229,9,20,0.5)' }}>Total</p>
                      <p className="text-lg font-black red-shimmer">{formatCurrency(booking.total_price)}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {booking.tickets?.map(t => (
                          <span key={t.id} className="text-xs px-2 py-0.5 rounded-md font-medium"
                            style={{ background: 'rgba(229,9,20,0.08)', color: 'rgba(229,9,20,0.7)', border: '1px solid rgba(229,9,20,0.15)' }}>
                            {t.seat?.row_label}{t.seat?.seat_number}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <button onClick={() => handleCancel(booking.booking_code)}
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
                          style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', color: '#f87171' }}>
                          <XCircle className="w-3.5 h-3.5" /> Batal
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (booking.status === 'paid') { setSelectedBooking(booking); setIsModalOpen(true); }
                          else navigate(`/customer/checkout/${booking.booking_code}`);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: '#e50914', color: '#ffffff' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                        onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                        {booking.status === 'paid' ? <><QrCode className="w-3.5 h-3.5" /> Lihat Tiket</> : <><Clock className="w-3.5 h-3.5" /> Bayar</>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {meta?.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
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

      <TicketModal booking={selectedBooking} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
