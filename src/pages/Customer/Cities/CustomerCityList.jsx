import { useCities } from "../../../hooks/global/Cities/useCities";
import { MapPin, Loader2, Globe, ChevronRight, Search, ChevronLeft, MapPinned, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerCityList() {
    const navigate = useNavigate();
    const { cities, loading, error, meta, page, search, setSearch, setPage } = useCities();
    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput, setSearch]);

    return (
        <div className="p-6 md:p-10 min-h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama kota..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-white placeholder:text-slate-600"
                        />
                    </div>
                </div>
            </div>

            {loading && cities.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                    <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Mapping Regional Networks...</p>
                </div>
            ) : error ? (
                <div className="p-12 bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] text-center border-dashed">
                    <p className="text-rose-400 font-black uppercase tracking-[0.2em] text-xs">{error}</p>
                </div>
            ) : cities.length === 0 ? (
                <div className="py-24 text-center items-center flex flex-col opacity-40">
                    <Globe className="w-16 h-16 text-slate-600 mb-6" />
                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">No operational zones found</p>
                    <button onClick={() => setSearchInput("")} className="mt-6 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:underline">
                        Reset Scanner
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {cities.map((city) => (
                            <div
                                key={city.id}
                                className="group relative bg-white/8 border border-white/10 rounded-2xl p-8 transition-all hover:bg-white/[0.03] hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer overflow-hidden active:scale-95 flex flex-col items-center text-center"
                                onClick={() => navigate(`/customer/cinemas?city=${city.id}`)}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.03] blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-indigo-500/[0.08] transition-colors"></div>

                                <div className="relative z-10 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl mb-6">
                                    <MapPin className="w-7 h-7" />
                                </div>

                                <div className="relative z-10 w-full">
                                    <h3 className="text-xl font-black mb-1 tracking-tight group-hover:text-indigo-400 transition-colors uppercase italic truncate">
                                        {city.name}
                                    </h3>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-8">
                                        {city.province || 'Regional Hub'}
                                    </p>

                                    <div className="flex items-center justify-center gap-3 py-4 border-t border-white/5 mb-6">
                                        <div className="flex flex-col items-center px-4">
                                            <span className="text-xs font-black text-slate-300">100+</span>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Cinemas</span>
                                        </div>
                                        <div className="w-px h-6 bg-white/5"></div>
                                        <div className="flex flex-col items-center px-4">
                                            <span className="text-xs font-black text-slate-300">24jam</span>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Support</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                                        Exploration Ready <ChevronRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {meta.last_page > 1 && (
                        <div className="p-8 flex flex-row items-center justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <button  disabled={page === 1 || loading}  onClick={() => setPage(page - 1)}  className="p-3 bg-white/8 border border-white/50 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600 disabled:opacity-10 disabled:hover:bg-white/5 transition-all group">
                                    <ChevronLeft className="w-4 h-4 group-active:-translate-x-1 transition-transform" />
                                </button>
            
                                <div className="hidden md:flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5">
                                    {[...Array(meta.last_page)].map((_, i) => {
                                        const pageNum = i + 1;
                                        if (
                                            pageNum === 1 || 
                                            pageNum === meta.last_page || 
                                            (pageNum >= page - 1 && pageNum <= page + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                                                        page === pageNum
                                                            ? 'bg-white/50 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                                                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (pageNum === page - 2 || pageNum === page + 2) {
                                            return <span key={pageNum} className="text-slate-700">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>
            
                                <button  disabled={page >= meta.last_page || loading}  onClick={() => setPage(page + 1)}  className="p-3 bg-white/8 border border-white/50 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600 disabled:opacity-10 disabled:hover:bg-white/5 transition-all group">
                                    <ChevronRight className="w-4 h-4 group-active:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
