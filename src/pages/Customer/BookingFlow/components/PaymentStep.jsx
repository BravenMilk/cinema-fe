import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2, QrCode, Info, AlertCircle, ShieldCheck, ExternalLink, Timer } from 'lucide-react';
import { createBooking } from '../../../../api/customer/BookingApi';
import axiosClient from '../../../../api/axiosClient';

export default function PaymentStep({ bookingData, onPrev, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [booking, setBooking] = useState(null);
    const [timeLeft, setTimeLeft] = useState(900);
    const [qrError, setQrError] = useState(false);

    useEffect(() => {
        if (!booking) {
            if (bookingData.resumedBooking) {
                setBooking(bookingData.resumedBooking);
                const limit = new Date(bookingData.resumedBooking.payment_limit).getTime();
                const now = new Date().getTime();
                const diff = Math.max(0, Math.floor((limit - now) / 1000));
                setTimeLeft(diff);
            }
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [booking, bookingData.resumedBooking]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const initBooking = async () => {
            if (bookingData.resumedBooking) return;
            setLoading(true);
            try {
                const data = {
                    showtime_id: bookingData.showtime.id,
                    seat_ids: bookingData.selectedSeats.map(s => s.id),
                    total_price: bookingData.totalPrice
                };
                const response = await createBooking(data);
                setBooking(response.data);
            } catch (err) {
                const msg = err.response?.data?.message || "Gagal membuat pesanan. Kursi mungkin sudah dipesan orang lain.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        if (!booking && bookingData.showtime) initBooking();
    }, [bookingData, booking]);

    useEffect(() => {
        if (!booking || booking.status === 'paid') return;
        const checkStatus = async () => {
            try {
                const response = await axiosClient.get(`/my-bookings?search=${booking.booking_code}`);
                const currentBooking = response.data.data.data[0];
                if (currentBooking && currentBooking.status === 'paid') onComplete(currentBooking);
            } catch (err) {
                console.error("Gagal memeriksa status pembayaran:", err);
            }
        };
        const interval = setInterval(checkStatus, 3000);
        return () => clearInterval(interval);
    }, [booking, onComplete]);

    const handleSimulatePayment = async () => {
        if (!booking) return;
        setLoading(true);
        try {
            await axiosClient.post('/payment/notification', { booking_code: booking.booking_code, status: 'paid' });
            onComplete(booking);
        } catch (err) {
            setError("Gagal mensimulasikan pembayaran.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !booking) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#e50914' }} />
                <p className="text-xs uppercase tracking-widest" style={{ color: '#555555' }}>Mengamankan Kursi Anda...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
                <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#f87171' }} />
                <p className="text-white font-bold mb-8 max-w-sm mx-auto">{error}</p>
                <button onClick={onPrev}
                    className="px-10 py-4 font-black rounded-2xl uppercase tracking-widest text-xs transition-all"
                    style={{ background: '#e50914', color: '#ffffff' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                    onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                    Pilih Kursi Lain
                </button>
            </div>
        );
    }

    const localSimulationUrl = `http://localhost:8000/api/payment/simulate/${booking?.booking_code}`;
    const publicBaseUrl = "https://undeterrably-unpersonalizing-gannon.ngrok-free.dev";
    const qrTargetUrl = `${publicBaseUrl}/api/payment/simulate/${booking?.booking_code}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrTargetUrl)}`;

    return (
        <div className="space-y-8">
            <header className="pb-6 flex justify-between items-end" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Checkout Pembayaran</h3>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#a0a0a0' }}>Selesaikan pembayaran dalam waktu yang ditentukan</p>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: '#e50914', border: '1px solid rgba(229,9,20,0.5)' }}>
                    <Timer className="w-4 h-4 text-white" />
                    <span className="text-sm font-black text-white tracking-tighter">{formatTime(timeLeft)}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center justify-center p-8 rounded-2xl relative"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="relative p-5 bg-white rounded-2xl shadow-2xl overflow-hidden min-w-[12rem] min-h-[12rem] flex items-center justify-center mb-6">
                        {booking && !qrError ? (
                            <img src={qrImageUrl} alt="QR Payment" className="w-48 h-48" onError={() => setQrError(true)} />
                        ) : booking ? (
                            <div className="flex flex-col items-center justify-center gap-2" style={{ color: '#a0a0a0' }}>
                                <QrCode className="w-12 h-12" />
                                <span className="text-xs font-black uppercase tracking-widest text-center">QR Gagal Dimuat</span>
                            </div>
                        ) : (
                            <QrCode className="w-48 h-48" style={{ color: '#cccccc' }} />
                        )}
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Scan QR Code</h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-center leading-relaxed" style={{ color: '#555555' }}>
                        Buka aplikasi kamera atau e-wallet Anda untuk memindai kode di atas.
                    </p>
                </div>

                <div className="flex flex-col justify-center gap-6">
                    <div className="p-6 rounded-2xl space-y-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
                                <ShieldCheck className="w-5 h-5" style={{ color: '#e50914' }} />
                            </div>
                            <div>
                                <h5 className="text-xs font-black uppercase tracking-widest" style={{ color: '#a0a0a0' }}>Booking Code</h5>
                                <p className="text-lg font-black text-white tracking-tighter">{booking?.booking_code}</p>
                            </div>
                        </div>

                        <div className="pt-4 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-xs font-bold leading-relaxed" style={{ color: '#a0a0a0' }}>
                                Anda dapat memindai QR di samping dengan HP Anda. Setelah link di HP diklik, halaman ini akan otomatis sukses.
                            </p>

                            <button
                                onClick={() => window.open(localSimulationUrl, '_blank')}
                                disabled={loading}
                                className="w-full py-4 font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all"
                                style={{ border: '1px solid rgba(229,9,20,0.3)', color: '#e50914', background: 'transparent' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,9,20,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <><ExternalLink className="w-4 h-4" /> Buka Link di Tab Baru</>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl flex items-start gap-4" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
                        <Info className="w-5 h-5 shrink-0" style={{ color: '#fbbf24' }} />
                        <p className="text-xs font-bold uppercase tracking-wide leading-relaxed" style={{ color: 'rgba(251,191,36,0.8)' }}>
                            Sistem melakukan pengecekan status otomatis setiap 3 detik. Jangan tutup halaman ini.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-start pt-4">
                <button
                    onClick={onPrev}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors"
                    style={{ color: '#555555' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#555555'}>
                    <ChevronLeft className="w-4 h-4" /> Batal & Kembali
                </button>
            </div>
        </div>
    );
}
