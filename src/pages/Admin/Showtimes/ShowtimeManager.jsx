import React, { useState } from 'react';
import Pagination from '../../../components/Common/Pagination.jsx';
import { Plus, Search, Edit3, Trash2, Calendar, RefreshCcw, Loader2, PlayCircle, Clock, MapPin,ChevronLeft,ChevronRight} from 'lucide-react';
import BaseModal from '../../../components/Common/BaseModal';
import NotificationModal from '../../../components/Common/NotificationModal';
import ShowtimeForm from './components/ShowtimeForm';
import { useAdminShowtimes } from '../../../hooks/admin/Showtimes/useAdminShowtimes';
import { getAdminMovies } from '../../../api/admin/MovieApi';
import { getAdminHalls } from '../../../api/admin/HallApi';
import CustomSelect from '../../../components/Common/CustomSelect';

export default function ShowtimeManager() {
    const { showtimes, loading, meta, page, setPage, search, setSearch, movie_id, setMovieId, hall_id, setHallId, handleCreate, handleUpdate, handleDelete, refresh} = useAdminShowtimes();

    const [movies, setMovies] = useState([]);
    const [halls, setHalls] = useState([]);
    const [loadingFilters, setLoadingFilters] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [showtimeToDelete, setShowtimeToDelete] = useState(null);
    const [notif, setNotif] = useState({ isOpen: false, type: 'success', title: '', message: '' });
    const [searchInput, setSearchInput] = useState(search);

    React.useEffect(() => {
        const fetchFilters = async () => {
            setLoadingFilters(true);
            try {
                const [mRes, hRes] = await Promise.all([
                    getAdminMovies({ limit: 100 }),
                    getAdminHalls({ limit: 100 })
                ]);

                const movieOptions = (mRes.data?.data || mRes.data || []).map(m => ({
                    id: m.id,
                    name: m.title
                }));

                setMovies([{ id: "", name: "Semua Film" }, ...movieOptions]);
                setHalls([{ id: "", name: "Semua Studio" }, ...(hRes.data?.data || hRes.data || [])]);
            } catch (err) {
                console.error("Gagal memuat filter", err);
            } finally {
                setLoadingFilters(false);
            }
        };
        fetchFilters();
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
        setSelectedShowtime(null);
        setIsFormOpen(true);
    };

    const openEditModal = (st) => {
        setSelectedShowtime(st);
        setIsFormOpen(true);
    };

    const openDeleteConfirm = (st) => {
        setShowtimeToDelete(st);
        setIsDeleteConfirmOpen(true);
    };

    const onFormSubmit = async (data) => {
        const result = selectedShowtime
            ? await handleUpdate(selectedShowtime.id, data)
            : await handleCreate(data);

        if (result.success) {
            setIsFormOpen(false);
            setNotif({
                isOpen: true,
                type: 'success',
                title: selectedShowtime ? 'Update Berhasil' : 'Jadwal Ditambahkan',
                message: `Jadwal penayangan telah berhasil ${selectedShowtime ? 'diperbarui' : 'disimpan'}.`
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
        const result = await handleDelete(showtimeToDelete.id);
        setIsDeleteConfirmOpen(false);

        if (result.success) {
            setNotif({
                isOpen: true,
                type: 'success',
                title: 'Dihapus',
                message: `Jadwal penayangan telah berhasil dihapus.`
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

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '-';
        // Server menyimpan UTC, tambah Z agar browser parse sebagai UTC
        const normalized = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
        const withUTC = (normalized.includes('+') || normalized.includes('Z'))
            ? normalized
            : normalized + 'Z';
        return new Date(withUTC).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta'
        });
    };

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <div className="flex flex-col gap-3 mb-10">
                <div className='flex flex-col gap-3'>
                    <div className="w-full">
                        <CustomSelect options={movies} value={movie_id} onChange={(val) => { setMovieId(val); setPage(1); }} placeholder="Filter Film" loading={loadingFilters}/>
                    </div>
                    <div className="w-full">
                        <CustomSelect options={halls} value={hall_id} onChange={(val) => { setHallId(val); setPage(1); }} placeholder="Filter Studio" loading={loadingFilters}/>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={refresh}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Refresh Data"
                    >
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[10px]" style={{ background: '#e50914', boxShadow: '0 8px 24px rgba(229,9,20,0.2)' }} onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'} onMouseLeave={e => e.currentTarget.style.background = '#e50914'}
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Jadwal
                    </button>
                </div>
            </div>

            <div className="bg-white/8 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">No</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">Film & Studio</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">Waktu Tayang</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5">Harga Dasar</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white/5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && showtimes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#e50914' }} />
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Synchronizing Schedules...</p>
                                    </td>
                                </tr>
                            ) : showtimes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="text-slate-700 font-medium italic text-sm">Tidak ada jadwal ditemukan.</div>
                                    </td>
                                </tr>
                            ) : (
                                showtimes.map((st, index) => (
                                    <tr key={st.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5">
                                        <td className="px-8 py-6 text-sm font-bold text-slate-500">
                                            {(page - 1) * 10 + index + 1}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                                    {st.movie?.poster_url ? (
                                                        <img src={st.movie.poster_url} alt="Poster" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <PlayCircle className="w-6 h-6" style={{ color: 'rgba(229,9,20,0.4)' }} />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-white font-black uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1">
                                                        {st.movie?.title || 'Unknown Movie'}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                        <MapPin className="w-3 h-3" style={{ color: '#e50914' }} />
                                                        {st.hall?.name || 'Unknown Studio'}
                                                        <span className="text-slate-700 px-1">•</span>
                                                        {st.hall?.cinema?.name || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-[11px] font-black text-white uppercase italic">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDateTime(st.start_time).split(',')[1]}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                    {formatDateTime(st.start_time).split(',')[0]}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-slate-300 uppercase tracking-tighter italic">
                                                Rp {new Intl.NumberFormat('id-ID').format(Number(st.base_price))}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => openEditModal(st)}
                                                    className="p-3 rounded-xl transition-all active:scale-90" style={{ background: 'rgba(229,9,20,0.08)', color: '#e50914' }} onMouseEnter={e => { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(229,9,20,0.08)'; e.currentTarget.style.color = '#e50914'; }}
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirm(st)}
                                                    className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl transition-all active:scale-90"
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

            <BaseModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedShowtime ? 'Edit Jadwal Tayang' : 'Buat Jadwal Baru'} maxWidth="max-w-2xl">
                <ShowtimeForm initialData={selectedShowtime} onSubmit={onFormSubmit} onCancel={() => setIsFormOpen(false)} loading={loading}/>
            </BaseModal>

            <NotificationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} type="warning" title="Hapus Jadwal?" message="Menghapus jadwal yang sudah ada pemesanannya dapat menyebabkan error pada sistem booking user." actionLabel="Ya, Hapus Jadwal" onAction={onConfirmDelete}/>

            <NotificationModal isOpen={notif.isOpen} onClose={() => setNotif({ ...notif, isOpen: false })} type={notif.type} title={notif.title} message={notif.message}/>
        </div>
    );
}
