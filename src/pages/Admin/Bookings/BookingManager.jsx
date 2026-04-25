import React, { useState } from 'react';
import { Search, RefreshCcw, Loader2, Ticket, Calendar, FileBarChart, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import BaseModal from '../../../components/Common/BaseModal';
import NotificationModal from '../../../components/Common/NotificationModal';
import CustomSelect from '../../../components/Common/CustomSelect';
import { useAdminBookings } from '../../../hooks/admin/Bookings/useAdminBookings';

export default function BookingManager() {
    const { bookings, loading, meta, page, setPage, search, setSearch, status, setStatus, startDate, setStartDate, endDate, setEndDate, fetchRecap, refresh } = useAdminBookings();

    const [isRecapOpen, setIsRecapOpen] = useState(false);
    const [recapData, setRecapData] = useState(null);
    const [loadingRecap, setLoadingRecap] = useState(false);
    const [searchInput, setSearchInput] = useState(search);

    React.useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput), 500);
        return () => clearTimeout(timer);
    }, [searchInput, setSearch]);

    const handleOpenRecap = async () => {
        setIsRecapOpen(true);
        setLoadingRecap(true);
        const data = await fetchRecap({ start_date: startDate, end_date: endDate });
        setRecapData(data);
        setLoadingRecap(false);
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

    const getStatusStyle = (s) => {
        switch (s) {
            case 'paid': return { color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' };
            case 'pending': return { color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' };
            case 'failed':
            case 'expired': return { color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' };
            default: return { color: '#a0a0a0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
        }
    };

    const inputStyle = {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#e50914',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '10px',
        fontWeight: 900,
        textTransform: 'uppercase',
        outline: 'none'
    };

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <div className="flex justify-between mb-8 gap-4 flex-wrap">
                <div className="flex flex-row gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" style={{ color: '#555555' }} />
                        <input type="text" placeholder="Cari kode booking..." value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-12 pr-4 py-4 rounded-xl text-xs font-medium text-white focus:outline-none transition-all"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                            onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                    </div>
                    <div className="md:w-56">
                        <CustomSelect
                            options={[
                                { id: "", name: "Semua Status" },
                                { id: "paid", name: "PAID - Pembayaran Berhasil" },
                                { id: "pending", name: "PENDING - Menunggu Bayar" },
                                { id: "expired", name: "EXPIRED - Kadaluarsa" },
                                { id: "failed", name: "FAILED - Gagal" },
                            ]}
                            value={status}
                            onChange={(val) => { setStatus(val); setPage(1); }}
                            placeholder="Status Transaksi"
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-4">
                    <div className="flex gap-2">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
                        <div className="flex items-center" style={{ color: '#555555' }}>to</div>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <button onClick={refresh}
                            className="p-4 rounded-2xl transition-all"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a0a0a0' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#a0a0a0'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                            title="Refresh Data">
                            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={handleOpenRecap}
                            className="flex items-center gap-3 px-6 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                            style={{ background: '#e50914', color: '#ffffff', boxShadow: '0 8px 24px rgba(229,9,20,0.2)' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                            onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                            <FileBarChart className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-center" style={{ background: '#0a0a0a' }}>
                                {['No', 'Kode', 'Customer', 'Film / Studio', 'Total Bayar', 'Waktu Transaksi', 'Status'].map(h => (
                                    <th key={h} className="px-4 py-5 text-xs font-black uppercase tracking-widest whitespace-nowrap"
                                        style={{ color: '#555555', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#e50914' }} />
                                        <p className="text-xs font-black uppercase tracking-widest animate-pulse" style={{ color: '#555555' }}>Fetching Ledger Records...</p>
                                    </td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center text-sm italic" style={{ color: '#555555' }}>Data transaksi tidak ditemukan.</td>
                                </tr>
                            ) : (
                                bookings.map((booking, index) => (
                                    <tr key={booking.id} className="text-center transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td className="px-8 py-6 text-xs font-bold" style={{ color: '#555555' }}>
                                            {(page - 1) * (meta.per_page || 10) + index + 1}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-white font-black uppercase tracking-tight whitespace-nowrap">
                                                {booking.booking_code}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs uppercase tracking-tight" style={{ color: '#a0a0a0' }}>{booking.user?.name || 'Anonymous'}</span>
                                                <span className="text-xs font-medium" style={{ color: '#555555' }}>{booking.user?.email || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs uppercase line-clamp-1 text-white">{booking.showtime?.movie?.title || 'Unknown Film'}</span>
                                                <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#555555' }}>{booking.showtime?.hall?.name || 'Unknown Studio'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black uppercase" style={{ color: '#e50914' }}>
                                                Rp. {new Intl.NumberFormat('id-ID').format(Number(booking.showtime?.base_price || 0))}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold tracking-tight" style={{ color: '#a0a0a0' }}>
                                                    {new Date(booking.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                </span>
                                                <span className="text-xs font-medium" style={{ color: '#555555' }}>
                                                    {new Date(booking.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest" style={getStatusStyle(booking.status)}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
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

            <BaseModal isOpen={isRecapOpen} onClose={() => setIsRecapOpen(false)} title="Sales Recapitulation" maxWidth="max-w-xl">
                <div className="space-y-8 py-4">
                    {loadingRecap ? (
                        <div className="py-20 text-center">
                            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#e50914' }} />
                            <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>Processing Reports...</p>
                        </div>
                    ) : recapData?.data ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl flex flex-col gap-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>Total Transaksi</span>
                                    <span className="text-2xl font-black text-white">{recapData.data.total_transactions}</span>
                                </div>
                                <div className="p-6 rounded-2xl flex flex-col gap-2" style={{ background: '#e50914', boxShadow: '0 8px 24px rgba(229,9,20,0.2)' }}>
                                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>Gross Revenue</span>
                                    <span className="text-2xl font-black text-white">{formatCurrency(recapData.data.total_sales)}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: '#e50914' }}>Periode Laporan</h3>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a0a0a0' }}>
                                        {recapData.data.period}
                                    </span>
                                </div>

                                <div className="p-8 rounded-2xl flex flex-col items-center gap-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
                                        <Download className="w-8 h-8" style={{ color: '#e50914' }} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-black uppercase text-sm tracking-tight mb-2">Laporan Siap Diunduh</p>
                                        <p className="text-xs font-medium leading-relaxed max-w-[250px]" style={{ color: '#555555' }}>Rekapitulasi lengkap data penjualan untuk periode yang dipilih telah siap.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const dataToExport = recapData.data?.data || recapData.data || [];
                                            const headers = ["No", "Booking Code", "Customer", "Email", "Film", "Studio", "Price", "Date", "Status"];
                                            const rows = dataToExport.map((b, index) => [
                                                index + 1, b.booking_code, b.user?.name || 'Anonymous', b.user?.email || '-',
                                                b.showtime?.movie?.title || 'Unknown', b.showtime?.hall?.name || 'Unknown',
                                                b.total_price, new Date(b.created_at).toLocaleDateString('id-ID'), b.status.toUpperCase()
                                            ]);
                                            const content = [headers, ...rows].map(row => row.join("\t")).join("\n");
                                            const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
                                            const url = URL.createObjectURL(blob);
                                            const link = document.createElement("a");
                                            link.href = url;
                                            link.download = `Recap_${recapData.data?.period?.replace(/ /g, '_') || 'Sales'}.xls`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                        className="w-full py-4 font-black rounded-2xl uppercase tracking-widest text-xs transition-all"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                                        Download Excel Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center italic" style={{ color: '#555555' }}>Gagal memuat rekap data.</div>
                    )}

                    <div className="pt-2">
                        <button onClick={() => setIsRecapOpen(false)}
                            className="w-full py-4 font-bold rounded-2xl uppercase tracking-widest text-xs transition-all"
                            style={{ background: 'transparent', color: '#555555' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                            onMouseLeave={e => e.currentTarget.style.color = '#555555'}>
                            Tutup Jendela
                        </button>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
}
