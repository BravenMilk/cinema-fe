import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ChevronLeft } from 'lucide-react';
import axiosClient from '../../../api/axiosClient';
import PaymentStep from '../BookingFlow/components/PaymentStep';
import SuccessStep from '../BookingFlow/components/SuccessStep';

export default function CheckoutResumer() {
    const { bookingCode } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axiosClient.get(`/my-bookings?search=${bookingCode}`);
                const data = response.data.data.data[0];
                if (data) {
                    if (data.status !== 'pending') {
                        navigate('/customer/bookings');
                        return;
                    }
                    setBooking(data);
                } else {
                    setError("Booking tidak ditemukan.");
                }
            } catch (err) {
                setError("Gagal memuat data booking.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingCode, navigate]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Memuat data pembayaran...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <AlertCircle className="w-16 h-16 text-rose-500" />
            <p className="text-white font-bold">{error}</p>
            <button onClick={() => navigate('/customer/bookings')} className="px-8 py-3 bg-white/10 rounded-xl text-white font-black uppercase text-xs tracking-widest">Kembali</button>
        </div>
    );

    if (isSuccess) return <SuccessStep bookingResult={successData} />;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10">
            <PaymentStep
                bookingData={{
                    showtime: booking.showtime,
                    selectedSeats: booking.tickets.map(t => t.seat),
                    totalPrice: booking.total_price,
                    resumedBooking: booking
                }}
                onPrev={() => navigate('/customer/bookings')}
                onComplete={(data) => {
                    setSuccessData(data);
                    setIsSuccess(true);
                }}
            />
        </div>
    );
}
