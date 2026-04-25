import { useCinemas } from "../../../hooks/global/Cinemas/useCinemas";
import { useCities } from "../../../hooks/global/Cities/useCities";
import { MapPin, Loader2, ChevronRight, Building2, Search, ChevronLeft, MapPinned, Info, Phone, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function CustomerCinemaList() {
    const navigate = useNavigate();
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
        <div className="p-6 md:p-10 min-h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" style={{ color: '#555555' }} />
                        <input
                            type="text"
                            placeholder="Cari nama bioskop..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none transition-all font-bold text-sm text-white"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                            onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <div className="relative w-full sm:w-64 city-dropdown">
                        <button
                            onClick={() => setIsOpenCity(!isOpenCity)}
                            className="w-full flex items-center justify-between pl-12 pr-6 py-3.5 rounded-2xl text-sm font-bold transition-all"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: isOpenCity ? '1px solid rgba(229,9,20,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                color: '#ffffff',
                                boxShadow: isOpenCity ? '0 0 0 3px rgba(229,9,20,0.08)' : 'none'
                            }}>
                            <MapPinned className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                                style={{ color: isOpenCity ? '#e50914' : '#555555' }} />
                            <span className="truncate">{cities.find(c => c.id === cityId)?.name || "Semua Kota"}</span>
                            <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isOpenCity ? 'rotate-90' : 'rotate-0'}`} style={{ color: '#555555' }} />
                        </button>

                        {isOpenCity && (
                            <div className="absolute top-full left-0 w-full mt-3 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                style={{ background: '#111111', border: '1px solid rgba(229,9,20,0.2)' }}>
                                <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
                                    <button
                                        onClick={() => { setCityId(""); setIsOpenCity(false); }}
                                        className="w-full text-left px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors"
                                        style={{ background: !cityId ? 'rgba(229,9,20,0.1)' : 'transparent', color: !cityId ? '#e50914' : '#a0a0a0' }}>
                                        Semua Kota
                                    </button>
                                    {cities.map(city => (
                                        <button
                                            key={city.id}
                                            onClick={() => { setCityId(city.id); setIsOpenCity(false); }}
                                            className="w-full text-left px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors"
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
                <div className="py-24 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#e50914' }} />
                    <p className="text-xs font-black uppercase tracking-widest animate-pulse" style={{ color: '#555555' }}>Mapping Cinema Circuits...</p>
                </div>
            ) : error ? (
                <div className="p-12 rounded-2xl text-center" style={{ background: 'rgba(248,113,113,0.05)', border: '1px dashed rgba(248,113,113,0.15)' }}>
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#f87171' }}>{error}</p>
                </div>
            ) : cinemas.length === 0 ? (
                <div className="py-20 rounded-2xl p-16 text-center flex flex-col items-center opacity-40"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <Building2 className="w-16 h-16 mb-6" style={{ color: '#333333' }} />
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>No venues mapped for this sector</p>
                    <button onClick={() => { setSearchInput(""); setCityId(""); }}
                        className="mt-6 text-xs font-black uppercase tracking-widest transition-colors"
                        style={{ color: '#e50914' }}>
                        Reset Map
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cinemas.map((cinema) => (
                            <div
                                key={cinema.id}
                                className="group rounded-2xl p-7 transition-all relative overflow-hidden"
                                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.4)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(229,9,20,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 -mr-16 -mt-16" style={{ background: '#e50914' }}></div>

                                <div className="flex items-start justify-between mb-7">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                                        style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)', color: '#e50914' }}>
                                        <Building2 className="w-7 h-7" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                                            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>
                                            Operasional
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" style={{ color: '#fbbf24' }} />
                                            <span className="text-xs font-bold" style={{ color: '#a0a0a0' }}>4.8</span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black mb-2 tracking-tight uppercase truncate transition-colors text-white">
                                    {cinema.name}
                                </h3>

                                <div className="flex items-start mb-7 min-h-[40px]" style={{ color: '#a0a0a0' }}>
                                    <MapPin className="w-4 h-4 mr-3 shrink-0 mt-0.5" style={{ color: 'rgba(229,9,20,0.5)' }} />
                                    <span className="text-sm font-medium line-clamp-2 leading-relaxed">{cinema.address}</span>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="flex items-center gap-2">
                                            <Info className="w-3.5 h-3.5" style={{ color: '#555555' }} />
                                            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>Experience</span>
                                        </div>
                                        <span className="text-xs font-black uppercase" style={{ color: '#a0a0a0' }}>Ultra HD / 7.1 Atmos</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5" style={{ color: '#555555' }} />
                                            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>Hotline</span>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-tighter" style={{ color: '#a0a0a0' }}>(021) 555-0924</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/customer/movies')}
                                    className="w-full py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                                    style={{ background: '#e50914', color: '#ffffff' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                                    Access Showtimes <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {meta.last_page > 1 && (
                        <div className="p-8 flex flex-row items-center justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <button disabled={page === 1 || loading} onClick={() => setPage(page - 1)}
                                    className="p-3 rounded-xl transition-all disabled:opacity-20"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a0a0a0' }}
                                    onMouseEnter={e => { if (page !== 1) { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#ffffff'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#a0a0a0'; }}>
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="hidden md:flex items-center gap-2 p-1.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    {[...Array(meta.last_page)].map((_, i) => {
                                        const pageNum = i + 1;
                                        if (pageNum === 1 || pageNum === meta.last_page || (pageNum >= page - 1 && pageNum <= page + 1)) {
                                            return (
                                                <button key={pageNum} onClick={() => setPage(pageNum)}
                                                    className="w-10 h-10 rounded-xl text-xs font-black transition-all"
                                                    style={page === pageNum ? { background: '#e50914', color: '#ffffff' } : { color: '#555555' }}>
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (pageNum === page - 2 || pageNum === page + 2) {
                                            return <span key={pageNum} style={{ color: '#333333' }}>...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button disabled={page >= meta.last_page || loading} onClick={() => setPage(page + 1)}
                                    className="p-3 rounded-xl transition-all disabled:opacity-20"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a0a0a0' }}
                                    onMouseEnter={e => { if (page < meta.last_page) { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#ffffff'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#a0a0a0'; }}>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
