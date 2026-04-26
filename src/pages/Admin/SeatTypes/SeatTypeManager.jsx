import React, { useState } from 'react';
import Pagination from '../../../components/Common/Pagination.jsx';
import { Plus, Search, Edit3, Trash2, Armchair, RefreshCcw, Loader2, DollarSign, Layers ,ChevronLeft, ChevronRight  } from 'lucide-react';
import BaseModal from '../../../components/Common/BaseModal';
import NotificationModal from '../../../components/Common/NotificationModal';
import SeatTypeForm from './components/SeatTypeForm';
import { useAdminSeatTypes } from '../../../hooks/admin/SeatTypes/useAdminSeatTypes';

export default function SeatTypeManager() {
    const { types, loading, meta, page, setPage, search, setSearch, handleCreate, handleUpdate, handleDelete, refresh} = useAdminSeatTypes();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState(null);
    const [notif, setNotif] = useState({ isOpen: false, type: 'success', title: '', message: '' });
    const [searchInput, setSearchInput] = useState(search);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput, setSearch]);

    const handleSearch = (e) => { e.preventDefault(); setPage(1); };
    const openAddModal = () => { setSelectedType(null); setIsFormOpen(true); };
    const openEditModal = (type) => { setSelectedType(type); setIsFormOpen(true); };
    const openDeleteConfirm = (type) => { setTypeToDelete(type); setIsDeleteConfirmOpen(true); };

    const onFormSubmit = async (data) => {
        const result = selectedType ? await handleUpdate(selectedType.id, data) : await handleCreate(data);
        if (result.success) {
            setIsFormOpen(false);
            setNotif({ isOpen: true, type: 'success', title: selectedType ? 'Update Berhasil' : 'Tipe Kursi Ditambahkan', message: `Tipe kursi ${data.name} telah berhasil disimpan.` });
        } else {
            setNotif({ isOpen: true, type: 'error', title: 'Operasi Gagal', message: result.message });
        }
    };

    const onConfirmDelete = async () => {
        const result = await handleDelete(typeToDelete.id);
        setIsDeleteConfirmOpen(false);
        if (result.success) {
            setNotif({ isOpen: true, type: 'success', title: 'Dihapus', message: `Tipe kursi ${typeToDelete.name} telah berhasil dihapus.` });
        }
    };

    return (
        <div className="p-6 md:p-10 min-h-screen text-slate-200">
            <div className="flex flex-col gap-3 mb-10">
                {/* Row 1: Search */}
                <div className="flex flex-col gap-3">
                    <form onSubmit={handleSearch} className="relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari kategori..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none transition-all text-xs font-bold text-white"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                            onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </form>
                </div>
                {/* Row 2: Refresh + Add */}
                <div className="flex items-center gap-3">
                    <button onClick={refresh} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={openAddModal}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[10px]"
                        style={{ background: '#e50914', boxShadow: '0 8px 24px rgba(229,9,20,0.2)' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#ff1a1a'}
                        onMouseLeave={e => e.currentTarget.style.background = '#e50914'}>
                        <Plus className="w-4 h-4" /> Add New Tier
                    </button>
                </div>
            </div>

            {loading && types.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#e50914' }} />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Populating Tiers...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {types.map((type, index) => (
                        <div key={type.id} className="group relative bg-white/8 border border-white/10 rounded-2xl p-8 hover:bg-[#1e293b]/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                                <Layers className="w-20 h-20 text-white" />
                            </div>

                            <div className="relative">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter" style={{ color: '#e50914', background: 'rgba(229,9,20,0.08)' }}>
                                        Tier 0{index + 1}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(type)} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => openDeleteConfirm(type)} className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight transition-colors mb-2">
                                    {type.name}
                                </h3>
                                
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Active Configuration</span>
                                </div>

                                <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Additional Price</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-bold text-emerald-500 italic">Rp</span>
                                        <span className="text-2xl font-black text-white tracking-tighter">
                                            {new Intl.NumberFormat('id-ID').format(Number(type.additional_price))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {types.length === 0 && !loading && (
                        <div className="col-span-full py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] text-center">
                            <p className="text-slate-500 italic font-medium">No seat categories found in the database.</p>
                        </div>
                    )}
                </div>
            )}

            <Pagination page={page} lastPage={meta.last_page} onPageChange={setPage} loading={loading} />

            <BaseModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedType ? 'Modify Tier' : 'Create Tier'} maxWidth="max-w-md">
                <SeatTypeForm initialData={selectedType} onSubmit={onFormSubmit} onCancel={() => setIsFormOpen(false)} loading={loading}/>
            </BaseModal>

            <NotificationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} type="warning" title="Execute Deletion?" message={`This will permanently remove the ${typeToDelete?.name} configuration tier.`} actionLabel="Confirm Delete" onAction={onConfirmDelete}/>
            <NotificationModal isOpen={notif.isOpen} onClose={() => setNotif({ ...notif, isOpen: false })} type={notif.type} title={notif.title} message={notif.message}/>
        </div>
    );
}