import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Armchair, Wallet, CheckCircle, ChevronRight, Loader2, Info, MapPin, Star } from 'lucide-react';
import { useMovies } from '../../../hooks/global/Movies/useMovies';

import ShowtimeStep from './components/ShowtimeStep';
import SeatPicker from './components/SeatPicker';
import PaymentStep from './components/PaymentStep';
import SuccessStep from './components/SuccessStep';

const STEPS = [
    { id: 'showtime', label: 'Jadwal', icon: Calendar },
    { id: 'seats', label: 'Kursi', icon: Armchair },
    { id: 'payment', label: 'Pembayaran', icon: Wallet },
    { id: 'success', label: 'Selesai', icon: CheckCircle },
];

export default function BookingFlow() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const { movies } = useMovies();
    const [currentMovie, setCurrentMovie] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const [bookingData, setBookingData] = useState({
        showtime: null,
        selectedSeats: [],
        totalPrice: 0,
        bookingResult: null
    });

    useEffect(() => {
        if (movies.length > 0) {
            const movie = movies.find(m => m.id === movieId);
            setCurrentMovie(movie);
        }
    }, [movies, movieId]);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSelectShowtime = (st) => {
        setBookingData(prev => ({ ...prev, showtime: st, selectedSeats: [], totalPrice: 0 }));
    };

    const handleSelectSeats = (selectedSeats) => {
        const basePrice = parseFloat(bookingData.showtime?.base_price || 0);
        const total = selectedSeats.reduce((sum, seat) => {
            const extra = parseFloat(seat.type?.additional_price || 0);
            return sum + basePrice + extra;
        }, 0);
        setBookingData(prev => ({ ...prev, selectedSeats, totalPrice: total }));
    };

    const handlePaymentComplete = (result) => {
        setBookingData(prev => ({ ...prev, bookingResult: result }));
        nextStep();
    };

    if (!currentMovie) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#e50914' }} />
                <p className="text-xs uppercase tracking-widest" style={{ color: '#555555' }}>Mempersiapkan Studio...</p>
            </div>
        );
    }

    const cardBorder = { border: '1px solid rgba(255,255,255,0.06)' };

    return (
        <div className="max-w-6xl mx-auto p-5 md:p-8 space-y-8">
            {/* Step indicator */}
            <div className="flex items-center justify-center relative max-w-lg mx-auto">
                <div className="absolute top-5 left-0 w-full h-px" style={{ background: 'rgba(229,9,20,0.15)' }} />
                {STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStep;
                    const isCurrent = index === currentStep;
                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
                                style={isCurrent ? {
                                    background: '#e50914',
                                    boxShadow: '0 0 20px rgba(229,9,20,0.4)',
                                    border: '1px solid rgba(229,9,20,0.6)'
                                } : isActive ? {
                                    background: 'rgba(74,222,128,0.1)',
                                    border: '1px solid rgba(74,222,128,0.3)'
                                } : {
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)'
                                }}>
                                <Icon className="w-4 h-4" style={{ color: isCurrent ? '#ffffff' : isActive ? '#4ade80' : '#555555' }} />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest hidden sm:block"
                                style={{ color: isCurrent ? '#e50914' : isActive ? '#a0a0a0' : '#333333' }}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main content */}
                <div className="lg:col-span-3 min-h-[500px] rounded-2xl p-6 md:p-10 relative overflow-hidden"
                    style={{ background: '#111111', ...cardBorder }}>
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-5" style={{ background: '#e50914' }} />
                    <div className="relative z-10">
                        {currentStep === 0 && <ShowtimeStep movieId={movieId} onNext={nextStep} onSelectShowtime={handleSelectShowtime} />}
                        {currentStep === 1 && <SeatPicker showtimeId={bookingData.showtime?.id} onNext={nextStep} onPrev={prevStep} onSelectSeats={handleSelectSeats} />}
                        {currentStep === 2 && <PaymentStep bookingData={bookingData} onPrev={prevStep} onComplete={handlePaymentComplete} />}
                        {currentStep === 3 && <SuccessStep bookingResult={bookingData.bookingResult} />}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden" style={{ background: '#111111', ...cardBorder }}>
                        <div className="h-36 relative">
                            <img src={currentMovie.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"}
                                className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111111, transparent)' }} />
                        </div>
                        <div className="p-5 -mt-2">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ background: '#e50914', color: '#ffffff' }}>
                                    {currentMovie.rating || 'R13+'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" style={{ color: '#e50914' }} />
                                    <span className="text-xs font-semibold" style={{ color: '#e50914' }}>4.9</span>
                                </div>
                            </div>
                            <h4 className="text-base font-bold text-white line-clamp-2 mb-4">{currentMovie.title}</h4>

                            <div className="space-y-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                {bookingData.showtime && (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs" style={{ color: 'rgba(229,9,20,0.5)' }}>Bioskop</span>
                                            <span className="text-xs font-semibold text-white text-right max-w-[120px] truncate">{bookingData.showtime.hall?.cinema?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs" style={{ color: 'rgba(229,9,20,0.5)' }}>Tanggal</span>
                                            <span className="text-xs font-semibold text-white">
                                                {new Date(bookingData.showtime.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs" style={{ color: 'rgba(229,9,20,0.5)' }}>Studio</span>
                                            <span className="text-xs font-semibold" style={{ color: '#e50914' }}>
                                                {bookingData.showtime.hall?.name} · {(bookingData.showtime.start_time?.split(' ')[1] || bookingData.showtime.start_time?.split('T')[1])?.split(':').slice(0, 2).join(':')}
                                            </span>
                                        </div>
                                    </>
                                )}

                                <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs" style={{ color: 'rgba(229,9,20,0.5)' }}>Kursi</span>
                                        <div className="flex flex-wrap justify-end gap-1 max-w-[120px]">
                                            {bookingData.selectedSeats.length > 0 ? bookingData.selectedSeats.map(s => (
                                                <span key={s.id} className="text-xs px-1.5 py-0.5 rounded font-medium"
                                                    style={{ background: 'rgba(229,9,20,0.08)', color: '#e50914', border: '1px solid rgba(229,9,20,0.2)' }}>
                                                    {s.row_label}{s.seat_number}
                                                </span>
                                            )) : <span className="text-xs" style={{ color: '#333333' }}>Belum dipilih</span>}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                        <span className="text-xs font-semibold" style={{ color: 'rgba(229,9,20,0.5)' }}>Total</span>
                                        <span className="text-lg font-black red-shimmer">
                                            Rp {bookingData.totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl flex items-start gap-3"
                        style={{ background: 'rgba(229,9,20,0.05)', border: '1px solid rgba(229,9,20,0.15)' }}>
                        <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#e50914' }} />
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(229,9,20,0.7)' }}>
                            Kursi diamankan selama 15 menit setelah checkout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
