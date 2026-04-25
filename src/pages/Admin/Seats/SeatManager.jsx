import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Armchair, RefreshCcw, Loader2, MonitorPlay,ChevronLeft,ChevronRight} from 'lucide-react';
import BaseModal from '../../../components/Common/BaseModal';
import NotificationModal from '../../../components/Common/NotificationModal';
import SeatForm from './components/SeatForm';
import { useAdminSeats } from '../../../hooks/admin/Seats/useAdminSeats';
import { getAdminHalls } from '../../../api/admin/HallApi';
import CustomSelect from '../../../components/Common/CustomSelect';

export default function SeatManager() {
    const { seats, loading, meta, page, setPage, search, setSearch, hall_id, setHallId, handleCreate, handleUpdate, handleDelete, refresh} = useAdminSeats();

    const [halls, setHalls] = useState([]);
    const [loadingHalls, setLoadingHalls] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [seatToDelete, setSeatToDelete] = useState(null);

    const [notif, setNotif] = useState({ isOpen: false, type: 'success', title: '', message: '' });
    const [searchInput, setSearchInput] = useState(search);

    React.useEffect(() => {
        const fetchHalls = async () => {
            setLoadingHalls(true);
            try {
                const response = await getAdminHalls({ limit: 100 });
                const data = response.data?.data || response.data || [];
                setHalls([{ id: "", name: "Semua Studio" }, ...data]);
            } catch (err) {
                console.error("Gagal memuat studio", err);
            } finally {
                setLoadingHalls(false);
            }
        };
        fetchHalls();
    }, []);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput, setSearch]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
    };

    const openAddModal = () => {
        setSelectedSeat(null);
        setIsFormOpen(true);
    };

    const openEditModal = (seat) => {
        setSelectedSeat(seat);
        setIsFormOpen(true);
    };

    const openDeleteConfirm = (seat) => {
        setSeatToDelete(seat);
        setIsDeleteConfirmOpen(true);
    };

    const onFormSubmit = async (data) => {
        const result = selectedSeat
            ? await handleUpdate(selectedSeat.id, data)
            : await handleCreate(data);

        if (result.success) {
            setIsFormOpen(false);
            setNotif({
                isOpen: true,
                type: 'success',
                title: selectedSeat ? 'Update Berhasil' : 'Kursi Ditambahkan',
                message: `Kursi ${data.row_label}${data.seat_number} telah berhasil ${selectedSeat ? 'diperbarui' : 'disimpan'}.`
            });
        } else {
            setNotif({
                isOpen: true,
                type: 'error',
                title: 'Operasi Gagal',
                message: result.message
            });
        }
    };

    const onConfirmDelete = async () => {
        const result = await handleDelete(seatToDelete.id);
        setIsDeleteConfirmOpen(false);

        if (result.success) {
            setNotif({
                isOpen: true,
                type: 'success',
                title: 'Dihapus',
                message: `Kursi ${seatToDelete.row_label}${seatToDelete.seat_number} telah berhasil dihapus.`
            });
        } else {
            setNotif({
                isOpen: true,
                type: 'error',
                title: 'Gagal Menghapus',
                message: result.message
            });
        }
    };

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className='flex flex-row gap-4'>
                    <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari baris atau nomor..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-xs font-medium"
                            />
                        </form>

                        <div className="w-full md:w-56">
                            <CustomSelect options={halls} value={hall_id} onChange={(val) => { setHallId(val); setPage(1); }} placeholder="Filter Studio" loading={loadingHalls}/>
                        </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={refresh}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Refresh Data"
                    >
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px]"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Kursi
                    </button>
                </div>
                
            </div>

            <div className="bg-white/8 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">No</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">Kursi</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">Studio / Bioskop</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">Tipe</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && seats.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Scanning Seat Assets...</p>
                                    </td>
                                </tr>
                            ) : seats.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="text-slate-700 font-medium italic text-sm">Tidak ada kursi terdaftar.</div>
                                    </td>
                                </tr>
                            ) : (
                                seats.map((seat, index) => (
                                    <tr key={seat.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5">
                                        <td className="px-8 py-6 text-sm font-bold text-slate-500">
                                            {(page - 1) * 10 + index + 1}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 font-black italic">
                                                    {seat.row_label}{seat.seat_number}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-black uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors">
                                                    {seat.hall?.name || 'Unknown Hall'}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                                    {seat.hall?.cinema?.name || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {seat.type?.name || 'Standard'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${seat.is_active ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {seat.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => openEditModal(seat)}
                                                    className="p-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl transition-all active:scale-90"
                                                    title="Edit Kursi"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirm(seat)}
                                                    className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl transition-all active:scale-90"
                                                    title="Hapus Kursi"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="p-8  flex flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                    <button disabled={page === 1 || loading} onClick={() => setPage(page - 1)} className="p-3 bg-white/5 border border-white/50 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600 disabled:opacity-10 disabled:hover:bg-white/5 transition-all group">
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
                    <button disabled={page >= meta.last_page || loading} onClick={() => setPage(page + 1)} className="p-3 bg-white/5 border border-white/50 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600 disabled:opacity-10 disabled:hover:bg-white/5 transition-all group">
                        <ChevronRight className="w-4 h-4 group-active:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <BaseModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedSeat ? 'Edit Konfigurasi Kursi' : 'Daftarkan Kursi Baru'} maxWidth="max-w-2xl">
                <SeatForm initialData={selectedSeat} onSubmit={onFormSubmit} onCancel={() => setIsFormOpen(false)} loading={loading}/>
            </BaseModal>

            <NotificationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} type="warning" title="Hapus Unit Kursi?" message={`Anda akan menghapus kursi ${seatToDelete?.row_label}${seatToDelete?.seat_number}.`} actionLabel="Ya, Hapus Kursi" onAction={onConfirmDelete}/>

            <NotificationModal isOpen={notif.isOpen} onClose={() => setNotif({ ...notif, isOpen: false })} type={notif.type} title={notif.title} message={notif.message}/>
        </div>
    );
}
