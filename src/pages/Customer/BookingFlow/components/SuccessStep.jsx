import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Ticket, Calendar, MapPin, ArrowRight, Download, Clock, Clapperboard, Star } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function SuccessStep({ bookingResult }) {
    const navigate = useNavigate();
    if (!bookingResult) return null;

    const formatTime = (raw) => {
        if (!raw) return '--:--';
        const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
        const withUTC = (normalized.includes('+') || normalized.includes('Z')) ? normalized : normalized + 'Z';
        return new Date(withUTC).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
    };

    const formatDate = (raw) => {
        if (!raw) return '-';
        const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
        const withUTC = (normalized.includes('+') || normalized.includes('Z')) ? normalized : normalized + 'Z';
        return new Date(withUTC).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });
    };

    const downloadTicket = async () => {
        const element = document.getElementById('printable-ticket');
        const canvas = await html2canvas(element, { backgroundColor: '#0a0a0a', scale: 2, useCORS: true });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `CinePass-${bookingResult.booking_code}.png`;
        link.click();
    };

    return (
        <div className="flex flex-col items-center space-y-8 py-6">

            {/* Success header */}
            <div className="text-center space-y-3">
                <div className="relative inline-flex">
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-60" style={{ background: '#22c55e' }} />
                    <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 0 40px rgba(34,197,94,0.5)' }}>
                        <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mt-4">Pembayaran <span style={{ color: '#22c55e' }}>Berhasil!</span></h2>
                <p className="text-xs uppercase tracking-widest" style={{ color: '#555' }}>Tiket kamu sudah dikonfirmasi</p>
            </div>

            {/* Ticket card */}
            <div id="printable-ticket" className="w-full max-w-sm relative" style={{ filter: 'drop-shadow(0 20px 60px rgba(229,9,20,0.15))' }}>

                {/* Top section */}
                <div className="rounded-t-3xl p-6 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1a0a0a, #0f0f0f)', border: '1px solid rgba(229,9,20,0.2)', borderBottom: 'none' }}>

                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: '#e50914' }} />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-5" style={{ background: '#e50914' }} />

                    {/* Cinema brand */}
                    <div className="flex items-center justify-between mb-5 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e50914' }}>
                                <Clapperboard className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base font-black text-white tracking-tight">Cine<span style={{ color: '#e50914' }}>Pass</span></span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                            <span className="text-xs font-bold" style={{ color: '#22c55e' }}>PAID</span>
                        </div>
                    </div>

                    {/* Movie title */}
                    <div className="relative z-10 mb-5">
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#555' }}>Film</p>
                        <h3 className="text-xl font-black text-white uppercase leading-tight line-clamp-2">
                            {bookingResult.showtime?.movie?.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <Star className="w-3 h-3 fill-current" style={{ color: '#fbbf24' }} />
                            <span className="text-xs font-semibold" style={{ color: '#fbbf24' }}>4.9</span>
                            <span className="text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: '#e50914', color: '#fff' }}>
                                {bookingResult.showtime?.movie?.rating || 'R13'}
                            </span>
                        </div>
                    </div>

                    {/* Date & time */}
                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-1.5 mb-1">
                                <Calendar className="w-3 h-3" style={{ color: '#e50914' }} />
                                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#555' }}>Tanggal</span>
                            </div>
                            <p className="text-xs font-bold text-white leading-tight">
                                {formatDate(bookingResult.showtime?.start_time)}
                            </p>
                        </div>
                        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-1.5 mb-1">
                                <Clock className="w-3 h-3" style={{ color: '#e50914' }} />
                                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#555' }}>Tayang</span>
                            </div>
                            <p className="text-xs font-black text-white">
                                {formatTime(bookingResult.showtime?.start_time)} <span className="text-xs font-semibold" style={{ color: '#555' }}>WIB</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tear line */}
                <div className="relative flex items-center" style={{ background: '#0a0a0a' }}>
                    <div className="w-5 h-5 rounded-full shrink-0 -ml-2.5" style={{ background: '#0a0a0a', border: '1px solid rgba(229,9,20,0.2)', borderLeft: 'none' }} />
                    <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: 'rgba(229,9,20,0.15)' }} />
                    <div className="w-5 h-5 rounded-full shrink-0 -mr-2.5" style={{ background: '#0a0a0a', border: '1px solid rgba(229,9,20,0.2)', borderRight: 'none' }} />
                </div>

                {/* Bottom section */}
                <div className="rounded-b-3xl p-6 space-y-4"
                    style={{ background: '#0f0f0f', border: '1px solid rgba(229,9,20,0.2)', borderTop: 'none' }}>

                    {/* Booking code */}
                    <div className="text-center py-3 rounded-xl" style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.15)' }}>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#555' }}>Kode Booking</p>
                        <p className="text-xl font-black tracking-widest" style={{ color: '#e50914' }}>{bookingResult.booking_code}</p>
                    </div>

                    {/* Cinema & studio */}
                    <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 shrink-0" style={{ color: '#e50914' }} />
                        <div>
                            <p className="text-sm font-bold text-white">{bookingResult.showtime?.hall?.cinema?.name}</p>
                            <p className="text-xs" style={{ color: '#555' }}>{bookingResult.showtime?.hall?.name}</p>
                        </div>
                    </div>

                    {/* Seats */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#555' }}>Kursi</p>
                        <div className="flex flex-wrap gap-2">
                            {bookingResult.tickets?.map(t => (
                                <span key={t.id} className="px-3 py-1.5 rounded-xl text-xs font-bold"
                                    style={{ background: 'rgba(229,9,20,0.1)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.2)' }}>
                                    {t.seat?.type?.name || 'Reg'} · {t.seat?.row_label}{t.seat?.seat_number}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#555' }}>Total</span>
                        <span className="text-xl font-black" style={{ color: '#22c55e' }}>
                            Rp {parseFloat(bookingResult.total_price).toLocaleString('id-ID')}
                        </span>
                    </div>

                    {/* Footer note */}
                    <p className="text-center text-xs pt-1" style={{ color: '#333' }}>
                        Tunjukkan kode booking ini saat check-in
                    </p>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <button onClick={downloadTicket}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#22c55e'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; e.currentTarget.style.color = '#22c55e'; }}>
                    <Download className="w-4 h-4" /> Download
                </button>
                <button onClick={() => navigate('/customer/bookings')}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all btn-red">
                    My Bookings <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <button onClick={() => navigate('/dashboard')}
                className="text-sm transition-colors" style={{ color: '#444' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                Kembali ke Beranda
            </button>
        </div>
    );
}
