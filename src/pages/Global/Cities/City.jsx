import { useCities } from "../../../hooks/global/Cities/useCities";
import PublicHeader from "../../../components/Global/PublicHeader";
import { MapPin, Loader2, Globe, ChevronRight, Search, ChevronLeft, LayoutDashboard} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function City() {
    const { cities, loading, error, meta, page, search, setSearch, setPage} = useCities();
    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput, setSearch]);

    if (loading && cities.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-500 animate-pulse uppercase tracking-widest text-xs font-bold font-mono">Loading Cities...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30">
            <PublicHeader />

            <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
                <div className="flex flex-col  gap-12 mb-16">
                    <div className="text-center ">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">
                            Lokasi  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Tersedia</span>
                        </h1>
                        <p className="text-slate-400 font-medium ">Temukan bioskop terdekat di kota pilihan Anda dengan kemudahan akses satu klik.</p>
                    </div>

                    <div className="relative group w-full lg:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                        <input type="text" placeholder="Cari nama kota..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-16 pr-5 py-5 bg-white/5 border border-white/10 rounded-3xl focus:outline-none focus:ring-4 focus:ring-violet-500/20 transition-all font-bold text-lg"/>
                    </div>
                </div>

                {error ? (
                    <div className="bg-rose-500/5 border border-rose-500/10 p-12 rounded-[3rem] text-center">
                        <p className="text-rose-400 font-bold uppercase tracking-widest text-xs">{error}</p>
                    </div>
                ) : cities.length === 0 ? (
                    <div className="py-24 text-center bg-white/5 rounded-[3rem] border border-white/5">
                        <Globe className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-10" />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Kota tidak ditemukan</p>
                        <button onClick={() => setSearchInput("")} className="mt-6 px-8 py-3 bg-violet-600 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-violet-500 transition-all" >
                            Reset
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {cities.map((city) => (
                                <div key={city.id} className="group relative bg-[#1e293b]/40 border border-white/5 rounded-2xl p-10 transition-all duration-500 hover:bg-violet-600/10 hover:border-violet-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/5 overflow-hidden active:scale-95">
                                    <div className="absolute top-13 right-10 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <Globe className="w-32 h-32 text-white" />
                                    </div>

                                    <div className="relative z-10 flex justify-center items-center flex-col">
                                        <div className="flex justify-center items-center"> 
                                            <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 mb-8 group-hover:bg-violet-500 group-hover:text-white transition-all shadow-xl shadow-violet-500/10">
                                                <MapPin className="w-8 h-8" />
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black mb-1 tracking-tighter group-hover:text-violet-400 transition-colors uppercase italic mb-2">{city.name}</h3>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">{city.province || 'Jawa Barat'}</p>

                                        <Link to={`/cinemas?city=${city.id}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black text-slate-300 group-hover:bg-white group-hover:text-black uppercase tracking-widest transition-all">
                                            List Cinemas <ChevronRight className="w-4 h-4 shadow-2xl" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-20 flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-violet-600 disabled:opacity-20 disabled:hover:bg-white/5 transition-all group"
                                >
                                    <ChevronLeft className="w-7 h-7 group-active:scale-75 transition-transform" />
                                </button>

                                <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                    <span className="text-xl font-black text-violet-400">{page}</span>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Page of {meta.last_page}</span>
                                </div>

                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= meta.last_page}
                                    className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-violet-600 disabled:opacity-20 disabled:hover:bg-white/5 transition-all group"
                                >
                                    <ChevronRight className="w-7 h-7 group-active:scale-75 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <footer className="mt-32 py-16 border-t border-white/5 bg-black/20 text-center">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center space-x-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">CinePass Admin Engine</span>
                    </div>
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">&copy; 2026 CinePass Indonesia. Global Network v2.4.0</p>
                </div>
            </footer>
        </div>
    );
}