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
            if (isOpenCity && !e.target.closest('.city-dropdown')) {
                setIsOpenCity(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpenCity]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput, setSearch]);

    return (
        <div className={`${isDashboard ? '' : 'min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30'}`}>
            {!isDashboard && <PublicHeader />}

            <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
                <div className="flex flex-col mb-12 gap-6">
                    <div className="flex justify-center items-center flex-col ">
                        <h1 className="text-4xl md:text-5xl font-black  tracking-tight mb-4 uppercase italic ">
                            Jelajahi <span className="text-transparent bg-clip-text bg-gradient-to-r px-1 from-indigo-400 to-violet-400">Bioskop</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-md">Temukan lokasi bioskop favoritmu di seluruh penjuru kota.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row  sm:justify-start  gap-4 w-full md:w-auto">
                        <div className="relative group w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input type="text" placeholder="Cari nama bioskop..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium"/>
                        </div>

                        <div className="relative w-full sm:w-64 city-dropdown">
                            <button onClick={() => setIsOpenCity(!isOpenCity)} className={`w-full flex items-center justify-between pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold transition-all hover:bg-white/10 ${isOpenCity ? 'ring-2 ring-indigo-500/40 border-indigo-500/30' : ''}`}>
                                <MapPinned className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isOpenCity ? 'text-indigo-400' : 'text-slate-500'}`} />
                                <span className="truncate">
                                    {cities.find(c => c.id === cityId)?.name || "Semua Kota"}
                                </span>
                                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpenCity ? 'rotate-90' : 'rotate-0'}`} />
                            </button>

                            {isOpenCity && (
                                <div className="absolute top-full left-0 w-full mt-3 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
                                        <button onClick={() => { setCityId(""); setIsOpenCity(false); }} className={`w-full text-left px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${!cityId ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                                            Semua Kota
                                        </button>
                                        {cities.map(city => (
                                            <button
                                                key={city.id}
                                                onClick={() => { setCityId(city.id); setIsOpenCity(false); }}
                                                className={`w-full text-left px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${cityId === city.id ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                            >
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
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-500 animate-pulse uppercase tracking-widest text-xs font-bold">Sinkronisasi Data...</p>
                    </div>
                ) : error ? (
                    <div className="bg-rose-500/5 border border-rose-500/10 p-12 rounded-[2.5rem] text-center">
                        <p className="text-rose-400 font-bold uppercase tracking-widest text-xs leading-relaxed">{error}</p>
                    </div>
                ) : cinemas.length === 0 ? (
                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-20 text-center">
                        <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-20" />
                        <p className="text-slate-500 font-medium italic">Tidak ada bioskop ditemukan dengan kriteria tersebut.</p>
                        <button
                            onClick={() => { setSearchInput(""); setCityId(""); }}
                            className="mt-6 text-indigo-400 font-black uppercase text-xs tracking-widest hover:underline"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cinemas.map((cinema) => (
                                <div key={cinema.id} className="group bg-[#1e293b]/40 border border-white/5 rounded-2xl p-8 transition-all hover:bg-white/[0.08] hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/10 active:scale-[0.98]">
                                    <div className="flex items-start justify-between items-center mb-6">
                                        <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                            <Building2 className="w-7 h-7" />
                                        </div>
                                        <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">
                                            Active
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black mb-2 tracking-tight group-hover:text-indigo-400 transition-colors uppercase italic">{cinema.name}</h3>
                                    <div className="flex items-center text-slate-400 text-sm mb-6">
                                        <MapPin className="w-4 h-4 mr-2 text-indigo-400/60" />
                                        <span className="truncate">{cinema.address}</span>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                                            <span className="text-slate-500 font-bold uppercase tracking-wider">Layanan</span>
                                            <span className="text-slate-300 font-bold">Premium Experience</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                                            <span className="text-slate-500 font-bold uppercase tracking-wider">Kontak</span>
                                            <span className="text-slate-300 font-bold">Tersedia via Login</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (!token) {
                                                navigate('/login');
                                            } else {
                                                navigate('/customer/movies');
                                            }
                                        }}
                                        className="w-full py-4 bg-white/5 hover:bg-white text-white hover:text-black font-black rounded-2xl transition-all border border-white/10 hover:border-transparent uppercase tracking-widest text-xs flex items-center justify-center"
                                    >
                                        Cek Jadwal <ChevronRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-20 flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 disabled:opacity-20 disabled:hover:bg-white/5 transition-all group"
                                >
                                    <ChevronLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
                                </button>

                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-sm font-black text-indigo-400">{page}</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase">of</span>
                                    <span className="text-sm font-black text-slate-300">{meta.last_page}</span>
                                </div>

                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= meta.last_page}
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 disabled:opacity-20 disabled:hover:bg-white/5 transition-all group"
                                >
                                    <ChevronRight className="w-6 h-6 group-active:scale-90 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
