import React, { useState } from 'react';
import Pagination from '../../../components/Common/Pagination.jsx';
import { Plus, Search, Edit3, Trash2, MapPin, MoreHorizontal, Loader2, RefreshCcw,ChevronLeft, ChevronRight} from 'lucide-react';
import BaseModal from '../../../components/Common/BaseModal';
import NotificationModal from '../../../components/Common/NotificationModal';
import CityForm from './components/CityForm';
import { useAdminCities } from '../../../hooks/admin/Cities/useAdminCities';

export default function CityManager() {
    const { cities, loading, meta, page, setPage, search, setSearch, handleCreate, handleUpdate, handleDelete, refresh} = useAdminCities();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [cityToDelete, setCityToDelete] = useState(null);
    const [notif, setNotif] = useState({ isOpen: false, type: 'success', title: '', message: '' });
    const [searchInput, setSearchInput] = useState(search);

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
        setSelectedCity(null);
        setIsFormOpen(true);
    };

    const openEditModal = (city) => {
        setSelectedCity(city);
        setIsFormOpen(true);
    };

    const openDeleteConfirm = (city) => {
        setCityToDelete(city);
        setIsDeleteConfirmOpen(true);
    };

    const onFormSubmit = async (data) => {
        const result = selectedCity
            ? await handleUpdate(selectedCity.id, data)
            : await handleCreate(data);

        if (result.success) {
            setIsFormOpen(false);
            setNotif({
                isOpen: true,
                type: 'success',
                title: selectedCity ? 'Update Berhasil' : 'Kota Ditambahkan',
                message: `Kota ${data.name} telah berhasil ${selectedCity ? 'diperbarui' : 'disimpan'} ke sistem.`
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
        const result = await handleDelete(cityToDelete.id);
        setIsDeleteConfirmOpen(false);

        if (result.success) {
            setNotif({
                isOpen: true,
                type: 'success',
                title: 'Dihapus',
                message: `Kota ${cityToDelete.name} telah berhasil dihapus dari sistem.`
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
        <div className="p-6 md:p-10 min-h-screen ">
            <div className="flex flex-col gap-3 mb-10">
                 <div className='flex flex-col gap-3'>
                    <form onSubmit={handleSearch} className="relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors" />
                        <input type="text" placeholder="Cari nama kota..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none transition-all text-sm font-medium text-white" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}/>
                    </form>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={refresh} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Refresh Data">
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={openAddModal} className="flex-1 flex items-center justify-center gap-3 px-6 py-4 text-white font-black rounded-xl transition-all uppercase tracking-widest text-[10px]" style={{ background: '#e50914', boxShadow: '0 8px 24px rgba(229,9,20,0.2)' }} onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'} onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                        <Plus className="w-4 h-4" />
                        Tambah Kota Baru
                    </button>
                </div>
            </div>

            <div className="bg-white/8 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">No</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">Nama Kota</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && cities.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#e50914' }} />
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Synchronizing Database...</p>
                                    </td>
                                </tr>
                            ) : cities.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-8 py-20 text-center">
                                        <div className="text-slate-700 font-medium italic text-sm">Data kota tidak tersedia atau tidak ditemukan.</div>
                                    </td>
                                </tr>
                            ) : (
                                cities.map((city, index) => (
                                    <tr key={city.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5">
                                        <td className="px-8 py-6 text-sm font-bold text-slate-500">
                                            {(page - 1) * 10 + index + 1}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-white font-black uppercase italic tracking-tight transition-colors">
                                                {city.name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => openEditModal(city)}
                                                    className="p-3 rounded-xl transition-all active:scale-90" style={{ background: 'rgba(229,9,20,0.08)', color: '#e50914' }} onMouseEnter={e => { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(229,9,20,0.08)'; e.currentTarget.style.color = '#e50914'; }}
                                                    title="Edit Kota"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirm(city)}
                                                    className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl transition-all active:scale-90"
                                                    title="Hapus Kota"
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
            <Pagination page={page} lastPage={meta.last_page} onPageChange={setPage} loading={loading} />

            <BaseModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedCity ? 'Edit Data Kota' : 'Tambah Kota Baru'} maxWidth="max-w-xl">
                <CityForm initialData={selectedCity} onSubmit={onFormSubmit} onCancel={() => setIsFormOpen(false)} loading={loading}/>
            </BaseModal>

            <NotificationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} type="warning" title="Konfirmasi Hapus" message={`Daur ulang data tidak tersedia. Apakah Anda yakin ingin menghapus kota ${cityToDelete?.name}? Seluruh bioskop di area ini mungkin akan terdampak.`} actionLabel="Ya, Hapus Sekarang" onAction={onConfirmDelete}/>

            <NotificationModal isOpen={notif.isOpen} onClose={() => setNotif({ ...notif, isOpen: false })} type={notif.type} title={notif.title} message={notif.message}/>
        </div>
    );
}
