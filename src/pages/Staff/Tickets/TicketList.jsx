import React, { useState, useEffect } from 'react';
import { Search, RefreshCcw, Loader2, Ticket, User, Calendar, CheckCircle2 } from 'lucide-react';
import { useStaffTickets } from '../../../hooks/staff/useStaffTickets';

export default function TicketList() {
    const { tickets, loading, meta, page, setPage, search, setSearch, refresh } = useStaffTickets();

    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput, setSearch]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <div className="flex flex-row gap-4 mb-8 items-center">
                <div className="relative group">
                    <Search className="absolute left-4 top-7 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari kode booking..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-12 pr-16 py-4 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all text-sm font-bold uppercase tracking-widest text-white placeholder:text-slate-600"
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center justify-center bg-black/20 rounded-2xl border border-white/10 py-[18px] px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Total: <span className="text-indigo-400 ml-2">{meta.total}</span>
                    </div>
                    <button onClick={refresh} className="p-4 bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition-all shadow-lg active:scale-95" title="Refresh Data">
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="bg-white/8 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -z-10"></div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 backdrop-blur-sm">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-white/5">No</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-white/5">Kode Booking</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-white/5">Customer</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-white/5">Film / Studio</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-white/5">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                                <Ticket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-500" />
                                            </div>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] italic animate-pulse">Scanning Records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <Ticket className="w-12 h-12 text-slate-600" />
                                            <p className="text-slate-600 text-xs font-black uppercase tracking-widest italic">Belum ada tiket terjual</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((booking, index) => (
                                    <tr key={booking.id} className="group hover:bg-indigo-500/[0.03] transition-all border-b border-white/5">
                                        <td className="px-10 py-8 text-[10px] font-black text-slate-500">
                                            {(page - 1) * (meta.per_page || 15) + index + 1}
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Booking Code</span>
                                                    <span className="text-slate-400 font-bold uppercase tracking-tight text-xs">{booking.booking_code}</span>
                                                </div>

                                                <div className="space-y-2">
                                                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Ticket Serial (To Scan)</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {booking.tickets?.map(t => (
                                                            <div key={t.id} className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-white uppercase italic tracking-tighter select-all">{t.ticket_serial}</span>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                                <span className="text-[8px] font-black text-indigo-400">{t.seat?.row_label}{t.seat?.seat_number}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-indigo-400 font-black text-xs uppercase italic">
                                                    {booking.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-slate-200 font-black text-sm uppercase tracking-tight">{booking.user?.name || 'Anonymous'}</span>
                                                    <span className="text-[10px] text-slate-500 font-bold tracking-widest">{booking.user?.email || '-'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-indigo-400 font-black text-sm uppercase italic tracking-tight leading-none mb-1">{booking.showtime?.movie?.title || 'Unknown Film'}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2 py-0.5 bg-indigo-500/5 rounded-md border border-white/5">
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{booking.showtime?.hall?.name || 'Studio'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] italic">Lunas</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {meta.last_page > 1 && (
                    <div className="p-10 border-t border-white/5 bg-black/20 flex items-center justify-between">
                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] italic">
                            Page <span className="text-indigo-400">{page}</span> / {meta.last_page}
                        </div>
                        <div className="flex gap-4">
                            <button
                                disabled={page === 1 || loading}
                                onClick={() => setPage(page - 1)}
                                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-indigo-600 disabled:opacity-20 transition-all shadow-lg active:scale-95"
                            >
                                Previous
                            </button>
                            <button
                                disabled={page >= meta.last_page || loading}
                                onClick={() => setPage(page + 1)}
                                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-indigo-600 disabled:opacity-20 transition-all shadow-lg active:scale-95"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
