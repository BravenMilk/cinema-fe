import React from 'react';
import { X, Ticket, Calendar, MapPin, Download, CheckCircle, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function TicketModal({ booking, isOpen, onClose }) {
    const [isDownloading, setIsDownloading] = React.useState(false);
    if (!isOpen || !booking) return null;

    const downloadTicket = async () => {
        setIsDownloading(true);
        try {
            const element = document.getElementById(`ticket-${booking.booking_code}`);
            const canvas = await html2canvas(element, {
                backgroundColor: '#111111',
                scale: 2,
                useCORS: true,
            });
            const data = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = data;
            link.download = `Ticket-${booking.booking_code}.png`;
            link.click();
        } catch (err) {
            console.error("Download failed", err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-xl transition-opacity"
                style={{ background: 'rgba(0,0,0,0.95)' }}
                onClick={onClose} />

            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-2xl flex items-center justify-center transition-all z-20"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#a0a0a0', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#ffffff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#a0a0a0'; }}>
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 md:p-10 space-y-8">
                    <header className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                            <CheckCircle className="w-6 h-6" style={{ color: '#4ade80' }} />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Your Digital Ticket</h2>
                        <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>Tunjukkan kode booking saat check-in</p>
                    </header>

                    <div id={`ticket-${booking.booking_code}`} className="rounded-2xl overflow-hidden relative"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5" style={{ background: '#e50914' }}></div>

                        <div className="p-7 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#555555' }}>Booking Code</p>
                                    <h3 className="text-xl font-black text-white tracking-tighter">{booking.booking_code}</h3>
                                </div>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
                                    <Ticket className="w-5 h-5" style={{ color: '#e50914' }} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2" style={{ color: '#555555' }}>
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-xs font-black uppercase tracking-widest">Jadwal</span>
                                    </div>
                                    <p className="text-xs font-bold text-white uppercase">
                                        {new Date(booking.showtime?.start_time).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                        <span className="block text-xs" style={{ color: '#e50914' }}>
                                            {new Date(booking.showtime?.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                        </span>
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="flex items-center justify-end gap-2" style={{ color: '#555555' }}>
                                        <span className="text-xs font-black uppercase tracking-widest">Cinema</span>
                                        <MapPin className="w-3 h-3" />
                                    </div>
                                    <p className="text-xs font-bold text-white uppercase truncate">
                                        {booking.showtime?.hall?.cinema?.name}
                                        <span className="block text-xs" style={{ color: '#555555' }}>{booking.showtime?.hall?.name}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>Judul Film</span>
                                    <span className="text-xs font-bold text-white uppercase text-right max-w-[150px]">{booking.showtime?.movie?.title}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>Kursi</span>
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {booking.tickets?.map(t => (
                                            <span key={t.id} className="text-xs font-black px-2 py-0.5 rounded"
                                                style={{ background: 'rgba(229,9,20,0.08)', color: '#e50914', border: '1px solid rgba(229,9,20,0.15)' }}>
                                                {t.seat?.type?.name || 'Reg'} {t.seat?.row_label}{t.seat?.seat_number}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#333333' }}>
                                Thank you for using CinePass
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={downloadTicket}
                        disabled={isDownloading}
                        className="w-full py-4 font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                        style={{ background: '#e50914', color: '#ffffff', boxShadow: '0 8px 24px rgba(229,9,20,0.2)' }}
                        onMouseEnter={e => { if (!isDownloading) e.currentTarget.style.background = '#ff1a1a'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#e50914'; }}>
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <><Download className="w-4 h-4" /> Download PNG Ticket</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
