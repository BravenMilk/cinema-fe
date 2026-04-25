import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2, AlertTriangle, Info } from 'lucide-react';
import { getSeatLayout } from '../../../../api/customer/BookingApi';

export default function SeatPicker({ showtimeId, onNext, onPrev, onSelectSeats }) {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(null); // hanya 1 kursi

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
            const selected = newId ? seats.filter(s => s.id === newId) : [];
            onSelectSeats(selected);
            return newId;
        });
    };

    // Group seats by row
    const rows = useMemo(() => {
        const map = {};
        seats.forEach(seat => {
            const row = seat.row_label || seat.row || 'A';
            if (!map[row]) map[row] = [];
            map[row].push(seat);
        });
        // Sort seats within each row by seat_number
        Object.keys(map).forEach(row => {
            map[row].sort((a, b) => (a.seat_number || a.number) - (b.seat_number || b.number));
        });
        return map;
    }, [seats]);

    const rowKeys = Object.keys(rows).sort();

    const getSeatStyle = (seat) => {
        const isSelected = selectedId === seat.id;
        const isTaken = seat.is_taken;
        const typeName = seat.type?.name?.toLowerCase() || '';
        const isVip = typeName.includes('vip') && !typeName.includes('vvip');
        const isVvip = typeName.includes('vvip');
        const isSweetbox = typeName.includes('sweetbox') || typeName.includes('sweet');

        if (isTaken) return {
            bg: 'rgba(255,255,255,0.03)',
            border: 'rgba(255,255,255,0.06)',
            color: '#2a2a2a',
            cursor: 'not-allowed',
            glow: 'none'
        };
        if (isSelected) return {
            bg: '#e50914',
            border: '#ff2d3a',
            color: '#ffffff',
            cursor: 'pointer',
            glow: '0 0 20px rgba(229,9,20,0.6), 0 4px 12px rgba(229,9,20,0.4)'
        };
        if (isVvip) return {
            bg: 'rgba(168,85,247,0.12)',
            border: 'rgba(168,85,247,0.4)',
            color: '#c084fc',
            cursor: 'pointer',
            glow: 'none'
        };
        if (isVip) return {
            bg: 'rgba(251,191,36,0.1)',
            border: 'rgba(251,191,36,0.35)',
            color: '#fbbf24',
            cursor: 'pointer',
            glow: 'none'
        };
        if (isSweetbox) return {
            bg: 'rgba(244,114,182,0.1)',
            border: 'rgba(244,114,182,0.35)',
            color: '#f472b6',
            cursor: 'pointer',
            glow: 'none'
        };
        return {
            bg: 'rgba(255,255,255,0.05)',
            border: 'rgba(255,255,255,0.12)',
            color: '#888888',
            cursor: 'pointer',
            glow: 'none'
        };
    };

    const selectedSeat = seats.find(s => s.id === selectedId);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full animate-pulse" style={{ background: 'rgba(229,9,20,0.1)' }} />
                <Loader2 className="w-8 h-8 animate-spin absolute inset-0 m-auto" style={{ color: '#e50914' }} />
            </div>
            <p className="text-xs uppercase tracking-widest animate-pulse" style={{ color: '#555' }}>Menyusun Peta Studio...</p>
        </div>
    );

    if (error) return (
        <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: '#f87171' }} />
            <p className="text-white font-bold mb-4">{error}</p>
            <button onClick={onPrev} className="text-xs font-bold uppercase tracking-widest" style={{ color: '#e50914' }}>
                Kembali
            </button>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Pilih Kursi</h3>
                <div className="flex items-center gap-2 mt-2">
                    <Info className="w-3.5 h-3.5 shrink-0" style={{ color: '#e50914' }} />
                    <p className="text-xs font-medium" style={{ color: '#666' }}>
                        Kamu hanya bisa memilih <span style={{ color: '#e50914' }}>1 kursi</span> per transaksi
                    </p>
                </div>
            </div>

            {/* Cinema screen */}
            <div className="relative pt-2 pb-10">
                {/* Glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(229,9,20,0.6), transparent)', filter: 'blur(4px)' }} />
                {/* Screen bar */}
                <div className="w-3/4 mx-auto h-1 rounded-full"
                    style={{ background: 'linear-gradient(to right, transparent, #e50914, transparent)', boxShadow: '0 0 30px rgba(229,9,20,0.4)' }} />
                {/* Screen label */}
                <div className="text-center mt-3">
                    <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#333' }}>LAYAR</span>
                </div>
                {/* Perspective lines */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-8 opacity-10"
                    style={{ background: 'linear-gradient(to bottom, rgba(229,9,20,0.3), transparent)' }} />
            </div>

            {/* Seat map */}
            <div className="overflow-x-auto no-scrollbar pb-4">
                <div className="min-w-max mx-auto px-2">
                    {rowKeys.map(rowKey => (
                        <div key={rowKey} className="flex items-center gap-2 mb-2">
                            {/* Row label */}
                            <span className="w-6 text-center text-xs font-bold shrink-0" style={{ color: '#444' }}>
                                {rowKey}
                            </span>

                            {/* Seats */}
                            <div className="flex gap-1.5 md:gap-2">
                                {rows[rowKey].map((seat, idx) => {
                                    const style = getSeatStyle(seat);
                                    const isSelected = selectedId === seat.id;
                                    const num = seat.seat_number || seat.number || idx + 1;

                                    // Add aisle gap in middle
                                    const totalSeats = rows[rowKey].length;
                                    const midPoint = Math.floor(totalSeats / 2);
                                    const showGap = idx === midPoint;

                                    return (
                                        <div key={seat.id} className="flex items-center gap-1.5 md:gap-2">
                                            {showGap && <div className="w-4 md:w-6" />}
                                            <button
                                                disabled={seat.is_taken}
                                                onClick={() => toggleSeat(seat)}
                                                title={`${rowKey}${num} — ${seat.type?.name || 'Regular'}`}
                                                className="relative flex items-end justify-center transition-all duration-200 group"
                                                style={{
                                                    width: '32px',
                                                    height: '30px',
                                                    cursor: style.cursor,
                                                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                                }}>
                                                {/* Seat shape */}
                                                <div className="w-full transition-all duration-200"
                                                    style={{
                                                        height: '22px',
                                                        borderRadius: '4px 4px 2px 2px',
                                                        background: style.bg,
                                                        border: `1px solid ${style.border}`,
                                                        boxShadow: style.glow,
                                                    }} />
                                                {/* Seat back */}
                                                <div className="absolute top-0 left-1 right-1 transition-all duration-200"
                                                    style={{
                                                        height: '10px',
                                                        borderRadius: '3px 3px 0 0',
                                                        background: seat.is_taken ? 'rgba(255,255,255,0.02)' : isSelected ? 'rgba(255,255,255,0.2)' : style.bg,
                                                        border: `1px solid ${style.border}`,
                                                        borderBottom: 'none',
                                                    }} />
                                                {/* Seat number on hover */}
                                                {!seat.is_taken && (
                                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                                                        style={{ color: isSelected ? '#e50914' : '#555' }}>
                                                        {rowKey}{num}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Row label right */}
                            <span className="w-6 text-center text-xs font-bold shrink-0" style={{ color: '#444' }}>
                                {rowKey}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-5"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                    { label: 'Tersedia', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)' },
                    { label: 'Dipilih', bg: '#e50914', border: '#ff2d3a' },
                    { label: 'Terisi', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)' },
                    { label: 'VIP', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.35)' },
                    { label: 'VVIP', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.4)' },
                    { label: 'Sweetbox', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.35)' },
                ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className="w-5 h-4 rounded-sm" style={{ background: item.bg, border: `1px solid ${item.border}` }} />
                        <span className="text-xs font-medium" style={{ color: '#666' }}>{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Selected seat info */}
            {selectedSeat && (
                <div className="flex items-center justify-between px-5 py-4 rounded-2xl animate-fade-in"
                    style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.2)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                            style={{ background: '#e50914', color: '#fff' }}>
                            {selectedSeat.row_label || selectedSeat.row}{selectedSeat.seat_number || selectedSeat.number}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">
                                Kursi {selectedSeat.row_label || selectedSeat.row}{selectedSeat.seat_number || selectedSeat.number}
                            </p>
                            <p className="text-xs" style={{ color: '#888' }}>{selectedSeat.type?.name || 'Regular'}</p>
                        </div>
                    </div>
                    <button onClick={() => { setSelectedId(null); onSelectSeats([]); }}
                        className="text-xs font-semibold transition-colors px-3 py-1.5 rounded-lg"
                        style={{ color: '#e50914', background: 'rgba(229,9,20,0.08)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,9,20,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(229,9,20,0.08)'}>
                        Batal
                    </button>
                </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
                <button onClick={onPrev}
                    className="flex items-center gap-2 text-sm font-semibold transition-colors"
                    style={{ color: '#555' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#555'}>
                    <ChevronLeft className="w-4 h-4" /> Kembali
                </button>
                <button
                    disabled={!selectedId}
                    onClick={onNext}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: selectedId ? '#e50914' : 'rgba(255,255,255,0.06)', color: '#fff' }}
                    onMouseEnter={e => { if (selectedId) e.currentTarget.style.background = '#ff1a1a'; }}
                    onMouseLeave={e => { if (selectedId) e.currentTarget.style.background = '#e50914'; }}>
                    Lanjut Pembayaran <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
