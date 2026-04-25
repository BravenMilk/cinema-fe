import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, RefreshCcw, Loader2, Clock, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import BaseModal from '../../../components/Common/BaseModal';
import NotificationModal from '../../../components/Common/NotificationModal';
import CustomSelect from '../../../components/Common/CustomSelect';
import MovieForm from './components/MovieForm';
import { useAdminMovies } from '../../../hooks/admin/Movies/useAdminMovies';

export default function MovieManager() {
    const { movies, loading, meta, page, setPage, search, setSearch, rating, setRating, handleCreate, handleUpdate, handleDelete, refresh } = useAdminMovies();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);
    const [notif, setNotif] = useState({ isOpen: false, type: 'success', title: '', message: '' });
    const [searchInput, setSearchInput] = useState(search);

    React.useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput), 500);
        return () => clearTimeout(timer);
    }, [searchInput, setSearch]);

    const ratingOptions = [
        { id: '', name: 'Semua Rating' },
        { id: 'SU', name: 'SU (Semua Umur)' },
        { id: 'R13', name: 'R13+ (Remaja)' },
        { id: 'D17', name: 'D17+ (Dewasa)' }
    ];

    const handleSearch = (e) => { e.preventDefault(); setPage(1); };

    const openAddModal = () => { setSelectedMovie(null); setIsFormOpen(true); };
    const openEditModal = (movie) => { setSelectedMovie(movie); setIsFormOpen(true); };
    const openDeleteConfirm = (movie) => { setMovieToDelete(movie); setIsDeleteConfirmOpen(true); };

    const onFormSubmit = async (data) => {
        const result = selectedMovie ? await handleUpdate(selectedMovie.id, data) : await handleCreate(data);
        if (result.success) {
            setIsFormOpen(false);
            setNotif({ isOpen: true, type: 'success', title: selectedMovie ? 'Update Berhasil' : 'Film Ditambahkan', message: `Film "${data.title}" telah berhasil ${selectedMovie ? 'diperbarui' : 'disimpan'}.` });
        } else {
            setNotif({ isOpen: true, type: 'error', title: 'Operasi Gagal', message: result.message });
        }
    };

    const onConfirmDelete = async () => {
        const result = await handleDelete(movieToDelete.id);
        setIsDeleteConfirmOpen(false);
        if (result.success) {
            setNotif({ isOpen: true, type: 'success', title: 'Data Dihapus', message: `Film "${movieToDelete.title}" telah berhasil dihapus dari sistem.` });
        } else {
            setNotif({ isOpen: true, type: 'error', title: 'Gagal Menghapus', message: result.message });
        }
    };

    const getRatingStyle = (r) => {
        switch (r) {
            case 'D17': return { color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' };
            case 'R13': return { color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' };
            default: return { color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' };
        }
    };

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex flex-row gap-4">
                    <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" style={{ color: '#555555' }} />
                        <input
                            type="text"
                            placeholder="Cari judul..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none transition-all text-xs font-medium text-white"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                            onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </form>
                    <div className="w-full md:w-56">
                        <CustomSelect options={ratingOptions} value={rating} onChange={(val) => { setRating(val); setPage(1); }} placeholder="Semua Rating" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={refresh}
                        className="p-4 rounded-2xl transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a0a0a0' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#a0a0a0'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                        title="Refresh">
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={openAddModal}
                        className="flex items-center gap-3 px-6 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                        style={{ background: '#e50914', color: '#ffffff', boxShadow: '0 8px 24px rgba(229,9,20,0.2)' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                        onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                        <Plus className="w-4 h-4" />
                        Daftarkan Film
                    </button>
                </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ background: '#0a0a0a' }}>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest" style={{ color: '#555555', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Poster</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest" style={{ color: '#555555', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Info Film</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest" style={{ color: '#555555', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Rating</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest" style={{ color: '#555555', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Durasi</th>
                                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-center" style={{ color: '#555555', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && movies.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#e50914' }} />
                                        <p className="text-xs font-black uppercase tracking-widest animate-pulse" style={{ color: '#555555' }}>Decrypting Media Vault...</p>
                                    </td>
                                </tr>
                            ) : movies.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-sm italic" style={{ color: '#555555' }}>
                                        Film tidak ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                movies.map((movie) => (
                                    <tr key={movie.id} className="group transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td className="px-8 py-6 w-32">
                                            <div className="w-16 h-24 rounded-lg overflow-hidden transition-all"
                                                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                <img
                                                    src={movie.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1"; }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-white font-black uppercase tracking-tight text-base">{movie.title}</span>
                                                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold" style={{ color: '#555555' }}>
                                                    <Calendar className="w-3 h-3" />
                                                    {movie.release_date}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest" style={getRatingStyle(movie.rating)}>
                                                {movie.rating || 'SU'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold" style={{ color: '#a0a0a0' }}>
                                                <Clock className="w-3 h-3" style={{ color: '#e50914' }} />
                                                {movie.duration} min
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => openEditModal(movie)}
                                                    className="p-3 rounded-xl transition-all"
                                                    style={{ background: 'rgba(229,9,20,0.08)', color: '#e50914', border: '1px solid rgba(229,9,20,0.15)' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#ffffff'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(229,9,20,0.08)'; e.currentTarget.style.color = '#e50914'; }}>
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirm(movie)}
                                                    className="p-3 rounded-xl transition-all"
                                                    style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.15)' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#f87171'; e.currentTarget.style.color = '#ffffff'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.color = '#f87171'; }}>
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
                                        style={page === pageNum ? { background: '#e50914', color: '#ffffff' } : { color: '#555555' }}
                                        onMouseEnter={e => { if (page !== pageNum) e.currentTarget.style.color = '#ffffff'; }}
                                        onMouseLeave={e => { if (page !== pageNum) e.currentTarget.style.color = '#555555'; }}>
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

            <BaseModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedMovie ? 'Edit Informasi Film' : 'Daftarkan Film Baru'} maxWidth="max-w-3xl">
                <MovieForm initialData={selectedMovie} onSubmit={onFormSubmit} onCancel={() => setIsFormOpen(false)} loading={loading} />
            </BaseModal>

            <NotificationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} type="error" title="Hapus Film?" message={`Anda akan menghapus film "${movieToDelete?.title}". Seluruh data showtime yang terhubung juga akan terhapus.`} actionLabel="Ya, Hapus Permanen" onAction={onConfirmDelete} />

            <NotificationModal isOpen={notif.isOpen} onClose={() => setNotif({ ...notif, isOpen: false })} type={notif.type} title={notif.title} message={notif.message} />
        </div>
    );
}
