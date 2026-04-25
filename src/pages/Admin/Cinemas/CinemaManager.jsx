import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Clapperboard, RefreshCcw, Loader2, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import BaseModal from '../../../components/Common/BaseModal';
import NotificationModal from '../../../components/Common/NotificationModal';
import CinemaForm from './components/CinemaForm';
import { useAdminCinemas } from '../../../hooks/admin/Cinemas/useAdminCinemas';
import { getAllCities } from '../../../api/global/Cities/CityApi';
import CustomSelect from '../../../components/Common/CustomSelect';

export default function CinemaManager() {
    const { cinemas, loading, meta, page, setPage, search, setSearch, city_id, setCityId, handleCreate, handleUpdate, handleDelete, refresh } = useAdminCinemas();

    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCinema, setSelectedCinema] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [cinemaToDelete, setCinemaToDelete] = useState(null);

    const [notif, setNotif] = useState({ isOpen: false, type: 'success', title: '', message: '' });

    const [searchInput, setSearchInput] = useState(search);

    React.useEffect(() => {
        const fetchCities = async () => {
            setLoadingCities(true);
            try {
                const response = await getAllCities({ limit: 100 });
                const data = response.data?.data || response.data || [];
                const sortedCities = Array.isArray(data) ? data : [];
                setCities([{ id: "", name: "Tampilkan Semua" }, ...sortedCities]);
            } catch (err) {
                console.error("Gagal memuat kota", err);
            } finally {
                setLoadingCities(false);
            }
        };
        fetchCities();
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
        setSelectedCinema(null);
        setIsFormOpen(true);
    };

    const openEditModal = (cinema) => {
        setSelectedCinema(cinema);
        setIsFormOpen(true);
    };

    const openDeleteConfirm = (cinema) => {
        setCinemaToDelete(cinema);
        setIsDeleteConfirmOpen(true);
    };

    const onFormSubmit = async (data) => {
        const result = selectedCinema
            ? await handleUpdate(selectedCinema.id, data)
            : await handleCreate(data);

        if (result.success) {
            setIsFormOpen(false);
            setNotif({
                isOpen: true,
                type: 'success',
                title: selectedCinema ? 'Update Berhasil' : 'Bioskop Ditambahkan',
                message: `Bioskop ${data.name} telah berhasil ${selectedCinema ? 'diperbarui' : 'disimpan'} ke sistem.`
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
        const result = await handleDelete(cinemaToDelete.id);
        setIsDeleteConfirmOpen(false);

        if (result.success) {
            setNotif({
                isOpen: true,
                type: 'success',
                title: 'Dihapus',
                message: `Bioskop ${cinemaToDelete.name} telah berhasil dihapus dari sistem.`
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
                    <form onSubmit={handleSearch} className="relative w-full md:w-80 group items-center">
                        <Search className="absolute left-4 top-6 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input type="text" placeholder="Cari bioskop atau alamat..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-xs font-medium" />
                    </form>

                    <div className="w-full md:w-56">
                        <CustomSelect options={cities} value={city_id} onChange={(val) => { setCityId(val); setPage(1); }} placeholder="Semua Kota" loading={loadingCities} />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={refresh} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Refresh Data">
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={openAddModal} className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px]">
                        <Plus className="w-4 h-4" />
                        Tambah Bioskop
                    </button>
                </div>
            </div>

            <div className="bg-white/8 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">No</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">Bioskop</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">Lokasi Kota</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && cinemas.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Fetching Cinema Network...</p>
                                    </td>
                                </tr>
                            ) : cinemas.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="text-slate-700 font-medium italic text-sm">Tidak ada bioskop yang terdaftar.</div>
                                    </td>
                                </tr>
                            ) : (
                                cinemas.map((cinema, index) => (
                                    <tr key={cinema.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5">
                                        <td className="px-8 py-6 text-sm font-bold text-slate-500">
                                            {(page - 1) * 10 + index + 1}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-black uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors">
                                                    {cinema.name}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-1 uppercase tracking-wider">
                                                    {cinema.address}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3 h-3 text-indigo-500" />
                                                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
                                                    {cinema.city?.name || 'Unknown Area'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => openEditModal(cinema)}
                                                    className="p-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl transition-all active:scale-90"
                                                    title="Edit Bioskop"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirm(cinema)}
                                                    className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl transition-all active:scale-90"
                                                    title="Hapus Bioskop"
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
            <div className="p-8 flex flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                    <button disabled={page === 1 || loading} onClick={() => setPage(page - 1)} className="p-3 bg-white/8 border border-white/50 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600 disabled:opacity-10 disabled:hover:bg-white/5 transition-all group">
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
                                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${page === pageNum
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

                    <button disabled={page >= meta.last_page || loading} onClick={() => setPage(page + 1)} className="p-3 bg-white/8 border border-white/50 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-600 disabled:opacity-10 disabled:hover:bg-white/5 transition-all group">
                        <ChevronRight className="w-4 h-4 group-active:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
            <BaseModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedCinema ? 'Edit Konfigurasi Bioskop' : 'Daftarkan Bioskop Baru'} maxWidth="max-w-xl">
                <CinemaForm initialData={selectedCinema} onSubmit={onFormSubmit} onCancel={() => setIsFormOpen(false)} loading={loading} />
            </BaseModal>

            <NotificationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} type="warning" title="Konfirmasi Hapus" message={`Anda akan menghapus bioskop ${cinemaToDelete?.name}. Seluruh studio (Hall) dan jadwal tayang di bioskop ini akan hilang secara permanen.`} actionLabel="Ya, Tutup Bioskop" onAction={onConfirmDelete} />

            <NotificationModal isOpen={notif.isOpen} onClose={() => setNotif({ ...notif, isOpen: false })} type={notif.type} title={notif.title} message={notif.message} />
        </div>
    );
}
