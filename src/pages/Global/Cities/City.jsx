import { useCities } from "../../../hooks/global/Cities/useCities";
import PublicHeader from "../../../components/Global/PublicHeader";
import { MapPin, Loader2, Globe, ChevronRight, Search, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function City() {
    const { cities, loading, error, meta, page, search, setSearch, setPage } = useCities();
    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput), 500);
        return () => clearTimeout(timer);
    }, [searchInput, setSearch]);

    if (loading && cities.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0a0a0a' }}>
                <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#e50914' }} />
                <p className="animate-pulse uppercase tracking-widest text-xs font-bold" style={{ color: '#555555' }}>Loading Cities...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#ffffff' }}>
            <PublicHeader />

            <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
                <div className="flex flex-col gap-10 mb-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">
                            Lokasi <span style={{ color: '#e50914' }}>Tersedia</span>
                        </h1>
                        <p className="font-medium" style={{ color: '#666666' }}>
                            Temukan bioskop terdekat di kota pilihan Anda.
                        </p>
                    </div>

                    <div className="relative group w-full lg:w-96 mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: '#555555' }} />
                        <input
                            type="text"
                            placeholder="Cari nama kota..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-14 pr-5 py-4 rounded-2xl font-bold focus:outline-none transition-all"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                            onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                </div>

                {error ? (
                    <div className="p-12 rounded-2xl text-center" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
                        <p className="font-bold" style={{ color: '#f87171' }}>{error}</p>
                    </div>
                ) : cities.length === 0 ? (
                    <div className="py-24 text-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Globe className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: '#555555' }} />
                        <p className="font-black uppercase tracking-widest text-xs" style={{ color: '#555555' }}>Kota tidak ditemukan</p>
                        <button onClick={() => setSearchInput("")}
                            className="mt-6 px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest transition-all"
                            style={{ background: '#e50914', color: '#ffffff' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                            onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                            Reset
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {cities.map((city) => (
                                <div key={city.id}
                                    className="group relative rounded-2xl p-8 transition-all duration-300 overflow-hidden"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,9,20,0.3)'; e.currentTarget.style.background = 'rgba(229,9,20,0.04)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)'; }}>

                                    <div className="absolute top-6 right-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
                                        <Globe className="w-24 h-24" style={{ color: '#e50914' }} />
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all"
                                            style={{ background: 'rgba(229,9,20,0.1)', color: '#e50914' }}>
                                            <MapPin className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-2xl font-black mb-1 tracking-tight uppercase italic transition-colors"
                                            style={{ color: '#eeeeee' }}>
                                            {city.name}
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest mb-6" style={{ color: '#555555' }}>
                                            {city.province || 'Indonesia'}
                                        </p>
                                        <Link to={`/cinemas?city=${city.id}`}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#aaaaaa' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.borderColor = '#e50914'; e.currentTarget.style.color = '#ffffff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#aaaaaa'; }}>
                                            Lihat Bioskop <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
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

            <footer className="mt-24 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#333333' }}>
                    &copy; 2026 CinePass Indonesia
                </p>
            </footer>
        </div>
    );
}
