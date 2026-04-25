import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, ChevronRight, MapPinned, Info, Building2, Ticket, Sparkles } from 'lucide-react';
import { getShowtimes } from '../../../../api/global/Showtimes/ShowtimeApi';
import { useCities } from '../../../../hooks/global/Cities/useCities';

export default function ShowtimeStep({ movieId, onNext, onSelectShowtime }) {
    const { cities } = useCities();
    const [selectedCityId, setSelectedCityId] = useState('');
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef();

    const selectedCityName = useMemo(() => {
        return cities.find(city => city.id === selectedCityId)?.name || ' Semua kota';
    }, [selectedCityId, cities]);

    useEffect(() => {
        const HandleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener('mousedown', HandleClickOutside);
        return () => { document.removeEventListener('mousedown', HandleClickOutside); }
    }, []);

    useEffect(() => {
        const fetchShowtimes = async () => {
            setLoading(true);
            try {
                const params = { movie_id: movieId };
                if (selectedCityId) params.city_id = selectedCityId;
                const response = await getShowtimes(params);
                const data = response.data?.data || response.data || [];
                setShowtimes(data);
                if (data.length > 0 && !selectedDate) {
                    // Ambil tanggal WIB dari UTC
                    const dates = [...new Set(data.map(st => {
                        const raw = st.start_time;
                        if (!raw) return null;
                        const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
                        const withUTC = (normalized.includes('+') || normalized.includes('Z')) ? normalized : normalized + 'Z';
                        const d = new Date(withUTC);
                        const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000);
                        const pad = (n) => String(n).padStart(2, '0');
                        return `${wib.getUTCFullYear()}-${pad(wib.getUTCMonth()+1)}-${pad(wib.getUTCDate())}`;
                    }))].filter(Boolean).sort();
                    if (dates.length > 0) setSelectedDate(dates[0]);
                }
            } catch (error) {
                console.error("Gagal mengambil jadwal:", error);
            } finally {
                setLoading(false);
            }
        };
        if (movieId) fetchShowtimes();
    }, [movieId, selectedCityId]);

    const availableDates = useMemo(() => {
        const dates = [...new Set(showtimes.map(st => {
            const raw = st.start_time;
            if (!raw) return null;
            // Parse sebagai UTC, ambil tanggal WIB
            const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
            const withUTC = (normalized.includes('+') || normalized.includes('Z')) ? normalized : normalized + 'Z';
            const d = new Date(withUTC);
            // Tanggal dalam WIB
            const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000);
            const pad = (n) => String(n).padStart(2, '0');
            return `${wib.getUTCFullYear()}-${pad(wib.getUTCMonth()+1)}-${pad(wib.getUTCDate())}`;
        }))].filter(Boolean).sort();

        return dates.map(dateStr => {
            const dateObj = new Date(dateStr + 'T00:00:00+07:00');
            return {
                raw: dateStr,
                dayName: dateObj.toLocaleDateString('id-ID', { weekday: 'short' }),
                dayNum: dateObj.getDate(),
                monthName: dateObj.toLocaleDateString('id-ID', { month: 'short' })
            };
        });
    }, [showtimes]);

    const filteredShowtimes = useMemo(() => {
        return showtimes.filter(st => {
            const raw = st.start_time;
            if (!raw) return false;
            const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
            const withUTC = (normalized.includes('+') || normalized.includes('Z')) ? normalized : normalized + 'Z';
            const d = new Date(withUTC);
            const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000);
            const pad = (n) => String(n).padStart(2, '0');
            const dateOnly = `${wib.getUTCFullYear()}-${pad(wib.getUTCMonth()+1)}-${pad(wib.getUTCDate())}`;
            return dateOnly === selectedDate;
        });
    }, [showtimes, selectedDate]);

    const groupedByCinema = useMemo(() => {
        return filteredShowtimes.reduce((acc, st) => {
            const cinemaName = st.hall?.cinema?.name || 'Unknown Cinema';
            if (!acc[cinemaName]) acc[cinemaName] = { details: st.hall?.cinema, items: [] };
            acc[cinemaName].items.push(st);
            return acc;
        }, {});
    }, [filteredShowtimes]);

    const handleSelect = (st) => {
        if (!isBookable(st).bookable) return;
        setSelectedShowtimeId(st.id);
        onSelectShowtime(st);
    };

    const isBookable = (st) => {
        const now = new Date();

        // Parse datetime string dari server (format: "2025-04-25 10:42:00" atau ISO)
        // Server menyimpan dalam WIB (UTC+7), tambahkan offset jika tidak ada timezone info
        const parseServerTime = (d) => {
            if (!d) return null;
            // Server menyimpan UTC, tambah Z agar browser parse sebagai UTC
            const normalized = d.includes('T') ? d : d.replace(' ', 'T');
            const withUTC = (normalized.includes('+') || normalized.includes('Z'))
                ? normalized
                : normalized + 'Z';
            return new Date(withUTC);
        };

        const bookingStart = parseServerTime(st.booking_start_at);
        const bookingEnd = parseServerTime(st.booking_end_at) || parseServerTime(st.start_time);

        if (bookingStart && now < bookingStart) {
            return {
                bookable: false,
                status: 'Coming Soon',
                date: bookingStart.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            };
        }
        if (bookingEnd && now > bookingEnd) {
            return { bookable: false, status: 'Closed' };
        }
        return { bookable: true };
    };

    const formatDateHeader = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr + 'T00:00:00+07:00').toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <div className="space-y-10 ">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5" style={{ color: '#e50914' }} />
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Cek Jadwal Tayang</h3>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64" ref={dropdownRef}>
                        <button
                            onClick={() => setOpenDropdown(!openDropdown)}
                            className="w-full flex items-center justify-between pl-12 pr-6 py-4 transition-all duration-300 rounded-2xl"
                            style={{
                                background: 'rgba(229,9,20,0.05)',
                                border: openDropdown ? '1px solid rgba(229,9,20,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                boxShadow: openDropdown ? '0 0 0 3px rgba(229,9,20,0.08)' : 'none'
                            }}>
                            <MapPin className="absolute left-4 w-4 h-4" style={{ color: openDropdown ? '#e50914' : '#a0a0a0' }} />
                            <span className="text-xs font-bold text-white uppercase tracking-widest truncate">
                                {selectedCityName}
                            </span>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${openDropdown ? 'rotate-90' : ''}`} style={{ color: '#e50914' }} />
                        </button>

                        {openDropdown && (
                            <div className="absolute z-[100] w-full mt-3 rounded-2xl shadow-2xl overflow-hidden"
                                style={{ background: '#111111', border: '1px solid rgba(229,9,20,0.2)' }}>
                                <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                                    <button
                                        onClick={() => { setSelectedCityId(''); setOpenDropdown(false); }}
                                        className="w-full text-left px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors"
                                        style={{ color: selectedCityId === '' ? '#e50914' : '#a0a0a0', background: selectedCityId === '' ? 'rgba(229,9,20,0.08)' : 'transparent' }}
                                        onMouseEnter={e => { if (selectedCityId !== '') e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                        onMouseLeave={e => { if (selectedCityId !== '') e.currentTarget.style.background = 'transparent'; }}>
                                        Semua Kota
                                    </button>
                                    {cities.map((city) => (
                                        <button
                                            key={city.id}
                                            onClick={() => { setSelectedCityId(city.id); setOpenDropdown(false); }}
                                            className="w-full text-left px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors"
                                            style={{
                                                color: selectedCityId === city.id ? '#e50914' : '#a0a0a0',
                                                background: selectedCityId === city.id ? 'rgba(229,9,20,0.08)' : 'transparent',
                                                borderTop: '1px solid rgba(255,255,255,0.04)'
                                            }}
                                            onMouseEnter={e => { if (selectedCityId !== city.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                            onMouseLeave={e => { if (selectedCityId !== city.id) e.currentTarget.style.background = 'transparent'; }}>
                                            {city.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {availableDates.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-4 px-1 no-scrollbar pt-2">
                    {availableDates.map((date) => (
                        <button
                            key={date.raw}
                            onClick={() => setSelectedDate(date.raw)}
                            className="flex flex-col items-center min-w-[72px] p-4 rounded-2xl transition-all duration-300"
                            style={selectedDate === date.raw ? {
                                background: '#e50914',
                                border: '2px solid rgba(229,9,20,0.8)',
                                boxShadow: '0 8px 24px rgba(229,9,20,0.3)',
                                transform: 'scale(1.05)'
                            } : {
                                background: 'rgba(255,255,255,0.03)',
                                border: '2px solid rgba(255,255,255,0.06)',
                                opacity: 0.6
                            }}>
                            <span className="text-[9px] font-black uppercase tracking-widest mb-1"
                                style={{ color: selectedDate === date.raw ? 'rgba(255,255,255,0.8)' : '#555555' }}>
                                {date.dayName}
                            </span>
                            <span className="text-2xl font-black tracking-tighter"
                                style={{ color: selectedDate === date.raw ? '#ffffff' : '#a0a0a0' }}>
                                {date.dayNum}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest mt-1"
                                style={{ color: selectedDate === date.raw ? 'rgba(255,255,255,0.8)' : '#555555' }}>
                                {date.monthName}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <div className="space-y-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-56 animate-pulse rounded-2xl" style={{ background: '#1a1a1a' }}></div>
                        ))}
                    </div>
                ) : Object.keys(groupedByCinema).length > 0 ? (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(229,9,20,0.2), transparent)' }}></div>
                            <div className="px-5 py-2 rounded-full" style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)' }}>
                                <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#e50914' }}>
                                    {formatDateHeader(selectedDate)}
                                </span>
                            </div>
                            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(229,9,20,0.2), transparent)' }}></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(groupedByCinema).map(([cinemaName, cinemaData]) => (
                                <div key={cinemaName} className="p-6 rounded-2xl group transition-all duration-500 relative overflow-hidden"
                                    style={{ background: 'rgba(229,9,20,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(229,9,20,0.3)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5" style={{ background: '#e50914' }}></div>

                                    <div className="flex items-start gap-4 mb-8 relative z-10">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                                            style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
                                            <Building2 className="w-6 h-6" style={{ color: '#e50914' }} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1 transition-colors"
                                                style={{ color: '#ffffff' }}>
                                                {cinemaName}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <MapPinned className="w-3 h-3" style={{ color: '#555555' }} />
                                                <p className="text-xs font-bold uppercase tracking-widest line-clamp-1" style={{ color: '#555555' }}>
                                                    {cinemaData.details?.address || 'Lokasi Bioskop'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 relative z-10">
                                        {cinemaData.items.map(st => {
                                            const { bookable, status, date } = isBookable(st);
                                            return (
                                                <button
                                                    key={st.id}
                                                    disabled={!bookable}
                                                    onClick={() => handleSelect(st)}
                                                    className="relative py-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300"
                                                    style={selectedShowtimeId === st.id ? {
                                                        background: '#e50914',
                                                        border: '2px solid rgba(229,9,20,0.8)',
                                                        boxShadow: '0 8px 24px rgba(229,9,20,0.3)',
                                                        transform: 'scale(1.05)'
                                                    } : !bookable ? {
                                                        background: 'rgba(255,255,255,0.01)',
                                                        border: '1px solid rgba(255,255,255,0.04)',
                                                        opacity: 0.4,
                                                        cursor: 'not-allowed'
                                                    } : {
                                                        background: 'rgba(255,255,255,0.03)',
                                                        border: '1px solid rgba(255,255,255,0.08)'
                                                    }}
                                                    onMouseEnter={e => { if (bookable && selectedShowtimeId !== st.id) { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)'; e.currentTarget.style.background = 'rgba(229,9,20,0.08)'; } }}
                                                    onMouseLeave={e => { if (bookable && selectedShowtimeId !== st.id) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; } }}>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[8px] font-black uppercase tracking-widest mb-1"
                                                            style={{ color: selectedShowtimeId === st.id ? 'rgba(255,255,255,0.8)' : '#555555' }}>
                                                            {st.hall?.name || 'Studio'}
                                                        </span>
                                                        <span className="text-lg font-black tracking-tighter"
                                                            style={{ color: selectedShowtimeId === st.id ? '#ffffff' : '#a0a0a0' }}>
                                                            {(() => {
                                                                const raw = st.start_time;
                                                                if (!raw) return '--:--';
                                                                const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
                                                                const withUTC = (normalized.includes('+') || normalized.includes('Z')) ? normalized : normalized + 'Z';
                                                                return new Date(withUTC).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
                                                            })()}
                                                        </span>
                                                    </div>

                                                    {!bookable ? (
                                                        <div className="mt-1 px-3 py-1 rounded-full" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
                                                            <span className="text-[7px] font-black uppercase tracking-widest" style={{ color: '#f87171' }}>
                                                                {status} {date && `(${date})`}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-1 px-2 py-0.5 rounded flex items-center gap-1.5"
                                                            style={{ background: selectedShowtimeId === st.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.04)' }}>
                                                            <Ticket className="w-2.5 h-2.5" style={{ color: selectedShowtimeId === st.id ? '#ffffff' : '#555555' }} />
                                                            <span className="text-[8px] font-black tracking-tight"
                                                                style={{ color: selectedShowtimeId === st.id ? '#ffffff' : '#a0a0a0' }}>
                                                                Rp {parseFloat(st.base_price).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(229,9,20,0.02)', border: '1px dashed rgba(229,9,20,0.15)' }}>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <MapPinned className="w-9 h-9 opacity-30" style={{ color: '#555555' }} />
                        </div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight mb-3">Jadwal Belum Tersedia</h4>
                        <p className="text-xs font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed" style={{ color: '#555555' }}>
                            Coba pilih kota lain atau cek lagi beberapa saat lagi.
                        </p>
                    </div>
                )}
            </div>

            <footer className="flex items-center justify-between pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="hidden md:flex items-center gap-3" style={{ color: '#555555' }}>
                    <Info className="w-4 h-4" style={{ color: 'rgba(229,9,20,0.5)' }} />
                    <p className="text-xs font-bold uppercase tracking-widest">Pilih satu jadwal untuk melanjutkan</p>
                </div>

                <button
                    disabled={!selectedShowtimeId}
                    onClick={onNext}
                    className="px-10 py-4 font-black rounded-2xl uppercase tracking-widest text-xs flex items-center gap-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: selectedShowtimeId ? '#e50914' : 'rgba(255,255,255,0.06)', color: '#ffffff' }}
                    onMouseEnter={e => { if (selectedShowtimeId) e.currentTarget.style.background = '#ff1a1a'; }}
                    onMouseLeave={e => { if (selectedShowtimeId) e.currentTarget.style.background = '#e50914'; }}>
                    <span>Pilih Kursi</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </footer>
        </div>
    );
}
