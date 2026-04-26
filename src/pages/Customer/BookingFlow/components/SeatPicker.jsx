import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2, AlertTriangle, Info, X } from 'lucide-react';
import { getSeatLayout } from '../../../../api/customer/BookingApi';

export default function SeatPicker({ showtimeId, onNext, onPrev, onSelectSeats }) {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (!showtimeId) return;
        setLoading(true);
        getSeatLayout(showtimeId)
            .then(res => setSeats(res.data || []))
            .catch(() => setError("Gagal memuat layout kursi."))
            .finally(() => setLoading(false));
    }, [showtimeId]);

    const toggleSeat = (seat) => {
        if (seat.is_taken) return;
        setSelectedId(prev => {
            const newId = prev === seat.id ? null : seat.id;
            onSelectSeats(newId ? seats.filter(s => s.id === newId) : []);
            return newId;
        });
    };

    const rows = useMemo(() => {
        const map = {};
        seats.forEach(seat => {
            const row = seat.row_label || seat.row || 'A';
            if (!map[row]) map[row] = [];
            map[row].push(seat);
        });
        Object.keys(map).forEach(row => {
            map[row].sort((a, b) => (a.seat_number || a.number) - (b.seat_number || b.number));
        });
        return map;
    }, [seats]);

    const rowKeys = Object.keys(rows).sort();

    const getSeatStyle = (seat) => {
        const isSelected = selectedId === seat.id;
        const typeName = seat.type?.name?.toLowerCase() || '';
        const isVip = typeName.includes('vip') && !typeName.includes('vvip');
        const isVvip = typeName.includes('vvip');
        const isSweetbox = typeName.includes('sweetbox') || typeName.includes('sweet');

        if (seat.is_taken) return { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.05)', color: '#222222', cursor: 'not-allowed', glow: 'none' };
        if (isSelected) return { bg: '#e50914', border: '#ff2d3a', color: '#ffffff', cursor: 'pointer', glow: '0 0 16px rgba(229,9,20,0.5)' };
        if (isVvip) return { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.45)', color: '#fbbf24', cursor: 'pointer', glow: 'none' };
        if (isVip) return { bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.25)', color: '#d97706', cursor: 'pointer', glow: 'none' };
        if (isSweetbox) return { bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.3)', color: '#f472b6', cursor: 'pointer', glow: 'none' };
        return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: '#777777', cursor: 'pointer', glow: 'none' };
    };

    const selectedSeat = seats.find(s => s.id === selectedId);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
                <div className="w-14 h-14 rounded-full animate-pulse" style={{ background: 'rgba(229,9,20,0.1)' }} />
                <Loader2 className="w-7 h-7 animate-spin absolute inset-0 m-auto" style={{ color: '#e50914' }} />
            </div>
            <p className="text-xs uppercase tracking-widest animate-pulse" style={{ color: '#555555' }}>Menyusun Peta Studio...</p>
        </div>
    );

    if (error) return (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
            <AlertTriangle className="w-10 h-10 mx-auto mb-3" style={{ color: '#f87171' }} />
            <p className="text-white font-bold mb-4">{error}</p>
            <button onClick={onPrev} className="text-xs font-bold uppercase tracking-widest" style={{ color: '#e50914' }}>← Kembali</button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Pilih Kursi</h3>
                <div className="flex items-center gap-2 mt-2">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#e50914' }} />
                    <p className="text-xs" style={{ color: '#666666' }}>
                        Pilih <span className="font-bold" style={{ color: '#e50914' }}>1 kursi</span> per transaksi
                    </p>
                </div>
            </div>

            {/* Screen */}
            <div className="relative pb-8 pt-2">
                <div className="w-3/4 mx-auto h-px rounded-full"
                    style={{ background: 'linear-gradient(to right, transparent, #e50914, transparent)', boxShadow: '0 0 20px rgba(229,9,20,0.5)' }} />
                <p className="text-center mt-3 text-xs font-black uppercase tracking-widest" style={{ color: '#333333' }}>LAYAR</p>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-6 opacity-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, rgba(229,9,20,0.4), transparent)' }} />
            </div>

            {/* Seat map */}
            <div className="overflow-x-auto no-scrollbar">
                <div className="inline-block min-w-full">
                    <div className="flex flex-col gap-2 items-center">
                        {rowKeys.map(rowKey => {
                            const rowSeats = rows[rowKey];
                            const midPoint = Math.floor(rowSeats.length / 2);
                            return (
                                <div key={rowKey} className="flex items-center gap-2">
                                    {/* Left label */}
                                    <span className="w-5 text-center text-xs font-bold flex-shrink-0" style={{ color: '#444444' }}>
                                        {rowKey}
                                    </span>

                                    {/* Seats */}
                                    <div className="flex items-center gap-1.5">
                                        {rowSeats.map((seat, idx) => {
                                            const style = getSeatStyle(seat);
                                            const isSelected = selectedId === seat.id;
                                            const num = seat.seat_number || seat.number || idx + 1;
                                            return (
                                                <React.Fragment key={seat.id}>
                                                    {idx === midPoint && <div className="w-4 flex-shrink-0" />}
                                                    <button
                                                        disabled={seat.is_taken}
                                                        onClick={() => toggleSeat(seat)}
                                                        title={`${rowKey}${num} — ${seat.type?.name || 'Regular'}`}
                                                        className="relative flex-shrink-0 transition-all duration-150"
                                                        style={{
                                                            width: '28px',
                                                            height: '26px',
                                                            cursor: style.cursor,
                                                            transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                                                        }}>
                                                        {/* Seat back */}
                                                        <div className="absolute top-0 left-1 right-1 transition-all"
                                                            style={{
                                                                height: '9px',
                                                                borderRadius: '3px 3px 0 0',
                                                                background: seat.is_taken ? 'rgba(255,255,255,0.02)' : style.bg,
                                                                border: `1px solid ${style.border}`,
                                                                borderBottom: 'none',
                                                            }} />
                                                        {/* Seat base */}
                                                        <div className="absolute bottom-0 left-0 right-0 transition-all"
                                                            style={{
                                                                height: '18px',
                                                                borderRadius: '3px 3px 2px 2px',
                                                                background: style.bg,
                                                                border: `1px solid ${style.border}`,
                                                                boxShadow: style.glow,
                                                            }} />
                                                    </button>
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>

                                    {/* Right label */}
                                    <span className="w-5 text-center text-xs font-bold flex-shrink-0" style={{ color: '#444444' }}>
                                        {rowKey}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 py-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                    { label: 'Tersedia', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
                    { label: 'Dipilih', bg: '#e50914', border: '#ff2d3a' },
                    { label: 'Terisi', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.05)' },
                    { label: 'VIP', bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.25)' },
                    { label: 'VVIP', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.45)' },
                    { label: 'Sweetbox', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.3)' },
                ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className="w-4 h-3.5 rounded-sm flex-shrink-0" style={{ background: item.bg, border: `1px solid ${item.border}` }} />
                        <span className="text-xs font-medium" style={{ color: '#666666' }}>{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Selected seat info */}
            {selectedSeat && (
                <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl animate-fade-in"
                    style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.2)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0"
                            style={{ background: '#e50914', color: '#ffffff' }}>
                            {selectedSeat.row_label || selectedSeat.row}{selectedSeat.seat_number || selectedSeat.number}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">
                                Kursi {selectedSeat.row_label || selectedSeat.row}{selectedSeat.seat_number || selectedSeat.number}
                            </p>
                            <p className="text-xs" style={{ color: '#888888' }}>{selectedSeat.type?.name || 'Regular'}</p>
                        </div>
                    </div>
                    <button onClick={() => { setSelectedId(null); onSelectSeats([]); }}
                        className="p-2 rounded-xl transition-all flex-shrink-0"
                        style={{ background: 'rgba(229,9,20,0.1)', color: '#e50914' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,9,20,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(229,9,20,0.1)'}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
                <button onClick={onPrev}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ color: '#666666', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#666666'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                    <ChevronLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                    disabled={!selectedId}
                    onClick={onNext}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: selectedId ? '#e50914' : 'rgba(255,255,255,0.06)', color: '#ffffff' }}
                    onMouseEnter={e => { if (selectedId) e.currentTarget.style.background = '#ff1a1a'; }}
                    onMouseLeave={e => { if (selectedId) e.currentTarget.style.background = '#e50914'; }}>
                    Lanjut <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
