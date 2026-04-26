import { useCinemas } from "../../../hooks/global/Cinemas/useCinemas";
import { useCities } from "../../../hooks/global/Cities/useCities";
import PublicHeader from "../../../components/Global/PublicHeader";
import { MapPin, Loader2, ChevronRight, Building2, Search, ChevronLeft, MapPinned } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function CinemaList() {
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname.includes('/customer/');
    const { cities } = useCities();
    const { token } = useAuth();
    const { cinemas, loading, error, meta, page, search, cityId, setSearch, setCityId, setPage } = useCinemas();
    const [searchInput, setSearchInput] = useState(search);
    const [isOpenCity, setIsOpenCity] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpenCity && !e.target.closest('.city-dropdown')) setIsOpenCity(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpenCity]);

    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput), 500);
        return () => clearTimeout(timer);
    }, [searchInput, setSearch]);

    return (
        <div style={{ background: isDashboard ? 'transparent' : '#0a0a0a', color: '#ffffff', minHeight: isDashboard ? 'auto' : '100vh' }}>
            {!isDashboard && <PublicHeader />}

            <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
                <div className="flex flex-col mb-12 gap-6">
                    <div className="flex justify-center items-center flex-col">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase italic">
                            Jelajahi <span style={{ color: '#e50914' }}>Bioskop</span>
                        </h1>
                        <p className="font-medium max-w-md text-center" style={{ color: '#666666' }}>
                            Temukan lokasi bioskop favoritmu di seluruh penjuru kota.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="relative group w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: '#555555' }} />
                            <input
                                type="text"
                                placeholder="Cari nama bioskop..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl font-medium focus:outline-none transition-all"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        <div className="relative w-full sm:w-64 city-dropdown">
                            <button
                                onClick={() => setIsOpenCity(!isOpenCity)}
                                className="w-full flex items-center justify-between pl-12 pr-6 py-4 rounded-2xl font-bold transition-all"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: isOpenCity ? '1px solid rgba(229,9,20,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                    color: '#ffffff'
                                }}>
                                <MapPinned className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                                    style={{ color: isOpenCity ? '#e50914' : '#555555' }} />
                                <span className="truncate">{cities.find(c => c.id === cityId)?.name || "Semua Kota"}</span>
                                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpenCity ? 'rotate-90' : ''}`} style={{ color: '#555555' }} />
                            </button>

                            {isOpenCity && (
                                <div className="absolute top-full left-0 w-full mt-3 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                    style={{ background: '#111111', border: '1px solid rgba(229,9,20,0.2)' }}>
                                    <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
                                        <button
                                            onClick={() => { setCityId(""); setIsOpenCity(false); }}
                                            className="w-full text-left px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors"
                                            style={{ background: !cityId ? 'rgba(229,9,20,0.1)' : 'transparent', color: !cityId ? '#e50914' : '#a0a0a0' }}>
                                            Semua Kota
                                        </button>
                                        {cities.map(city => (
                                            <button key={city.id}
                                                onClick={() => { setCityId(city.id); setIsOpenCity(false); }}
                                                className="w-full text-left px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors"
                                                style={{ background: cityId === city.id ? 'rgba(229,9,20,0.1)' : 'transparent', color: cityId === city.id ? '#e50914' : '#a0a0a0' }}>
                                                {city.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading && cinemas.length === 0 ? (
                    <div className="py-20 flex flex-col items-center">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#e50914' }} />
                        <p className="animate-pulse uppercase tracking-widest text-xs font-bold" style={{ color: '#555555' }}>Sinkronisasi Data...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 rounded-2xl text-center" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                        <p className="font-bold" style={{ color: '#f87171' }}>{error}</p>
                    </div>
                ) : cinemas.length === 0 ? (
                    <div className="p-20 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: '#555555' }} />
                        <p className="font-medium italic" style={{ color: '#555555' }}>Tidak ada bioskop ditemukan.</p>
                        <button onClick={() => { setSearchInput(""); setCityId(""); }}
                            className="mt-6 text-sm font-black uppercase tracking-widest transition-colors"
                            style={{ color: '#e50914' }}>
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cinemas.map((cinema) => (
                                <div key={cinema.id}
                                    className="group rounded-2xl p-8 transition-all cursor-default"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.3)'; e.currentTarget.style.background = 'rgba(229,9,20,0.04)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                                            style={{ background: 'rgba(229,9,20,0.1)', color: '#e50914' }}>
                                            <Building2 className="w-7 h-7" />
                                        </div>
                                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#555555', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            Active
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black mb-2 tracking-tight uppercase italic transition-colors group-hover:text-white"
                                        style={{ color: '#eeeeee' }}>
                                        {cinema.name}
                                    </h3>
                                    <div className="flex items-center text-sm mb-6" style={{ color: '#666666' }}>
                                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: '#e50914' }} />
                                        <span className="truncate">{cinema.address}</span>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center justify-between text-xs py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span className="font-bold uppercase tracking-wider" style={{ color: '#444444' }}>Layanan</span>
                                            <span className="font-bold" style={{ color: '#aaaaaa' }}>Premium Experience</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span className="font-bold uppercase tracking-wider" style={{ color: '#444444' }}>Kontak</span>
                                            <span className="font-bold" style={{ color: '#aaaaaa' }}>Tersedia via Login</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(token ? '/customer/movies' : '/login')}
                                        className="w-full py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center"
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.borderColor = '#e50914'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                                        Cek Jadwal <ChevronRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-20 flex justify-center">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setPage(page - 1)} disabled={page === 1}
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                                    onMouseEnter={e => { if (page !== 1) e.currentTarget.style.background = '#e50914'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="px-6 py-3 rounded-2xl flex items-center gap-3"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <span className="text-sm font-black" style={{ color: '#e50914' }}>{page}</span>
                                    <span className="text-xs font-bold" style={{ color: '#555555' }}>of</span>
                                    <span className="text-sm font-black text-white">{meta.last_page}</span>
                                </div>
                                <button onClick={() => setPage(page + 1)} disabled={page >= meta.last_page}
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                                    onMouseEnter={e => { if (page < meta.last_page) e.currentTarget.style.background = '#e50914'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
