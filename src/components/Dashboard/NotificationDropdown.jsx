import React from 'react';
import { Ticket, Clock, ChevronRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationDropdown = ({ notifications, loading, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 md:w-96 rounded-2xl overflow-hidden animate-slide-down"
      style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', zIndex: 9999 }}>

      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: '#e50914' }} />
          <h3 className="text-sm font-bold text-white">Notifikasi</h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(229,9,20,0.1)', color: '#e50914', border: '1px solid rgba(229,9,20,0.2)' }}>
          Recent
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="p-8 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(229,9,20,0.2)', borderTopColor: '#e50914' }} />
            <p className="text-xs" style={{ color: '#444' }}>Memuat...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Ticket className="w-6 h-6" style={{ color: '#333' }} />
            </div>
            <p className="text-xs" style={{ color: '#444' }}>Belum ada notifikasi</p>
          </div>
        ) : (
          <div>
            {notifications.map((notif) => (
              <div key={notif.id} className="px-5 py-4 cursor-pointer transition-colors group"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,9,20,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.15)' }}>
                    <Ticket className="w-4 h-4" style={{ color: '#e50914' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold" style={{ color: '#e50914' }}>{notif.booking_code}</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: '#444' }}>
                        <Clock className="w-3 h-3" /> {formatTime(notif.created_at)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{notif.showtime?.movie?.title || 'Movie'}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#555' }}>{notif.user?.name} melakukan pembayaran</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/admin/bookings" onClick={onClose}
          className="flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
          style={{ color: '#555' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e50914'}
          onMouseLeave={e => e.currentTarget.style.color = '#555'}>
          Lihat Semua Transaksi <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
