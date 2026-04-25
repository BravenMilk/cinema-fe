import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, ShieldCheck, RefreshCcw, Loader2, Users , ChevronLeft,ChevronRight} from 'lucide-react';
import BaseModal from '../../../components/Common/BaseModal';
import NotificationModal from '../../../components/Common/NotificationModal';
import RoleForm from './components/RoleForm';
import { useAdminRoles } from '../../../hooks/admin/Roles/useAdminRoles';

export default function RoleManager() {
    const { roles, loading, meta, page, setPage, search, setSearch, handleCreate, handleUpdate, handleDelete, refresh} = useAdminRoles();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

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
        setSelectedRole(null);
        setIsFormOpen(true);
    };

    const openEditModal = (role) => {
        setSelectedRole(role);
        setIsFormOpen(true);
    };

    const openDeleteConfirm = (role) => {
        setRoleToDelete(role);
        setIsDeleteConfirmOpen(true);
    };

    const onFormSubmit = async (data) => {
        const result = selectedRole
            ? await handleUpdate(selectedRole.id, data)
            : await handleCreate(data);

        if (result.success) {
            setIsFormOpen(false);
            setNotif({
                isOpen: true,
                type: 'success',
                title: selectedRole ? 'Update Berhasil' : 'Role Ditambahkan',
                message: `Role ${data.name} telah berhasil ${selectedRole ? 'diperbarui' : 'disimpan'}.`
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
        const result = await handleDelete(roleToDelete.id);
        setIsDeleteConfirmOpen(false);

        if (result.success) {
            setNotif({
                isOpen: true,
                type: 'success',
                title: 'Dihapus',
                message: `Role ${roleToDelete.name} telah berhasil dihapus.`
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

    const getRoleBadgeClass = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('admin')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        if (lowerName.includes('manager')) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    };

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className='flex flex-row gap-4'>
                    <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari nama role..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-xs font-medium text-white"
                    />
                </form>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={refresh} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Refresh Data">
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={openAddModal} className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px]">
                        <Plus className="w-4 h-4" />
                        Tambah Role
                    </button>
                </div>
            </div>

            {loading && roles.length === 0 ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Scanning Security Clearance...</p>
                </div>
            ) : roles.length === 0 ? (
                <div className="py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center">
                    <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">No Roles Authorized Yet</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role, index) => (
                        <div key={role.id} className="group relative bg-white/8 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-indigo-500/50 transition-all duration-300 shadow-xl">
                            <div className="flex flex-col gap-4">
                                <div className='flex items-center justify-center'>
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl w-fit ">
                                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                                    </div>
                                </div>
                                
                                <div className='flex items-center justify-center flex-col'>
                                    <h3 className={`text-lg font-black uppercase italic tracking-wider ${getRoleBadgeClass(role.name).split(' ')[0]}`}>
                                        {role.name}
                                    </h3>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase mt-1 tracking-widest">Access Level: Verified</p>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                                    <span className="text-[10px] text-slate-600 font-bold">ACTIONS</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEditModal(role)} className="p-2.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl transition-all active:scale-90">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => openDeleteConfirm(role)} className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl transition-all active:scale-90">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
            <BaseModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedRole ? 'Edit Data Role' : 'Daftarkan Role Baru'} maxWidth="max-w-md">
                <RoleForm initialData={selectedRole} onSubmit={onFormSubmit} onCancel={() => setIsFormOpen(false)} loading={loading}/>
            </BaseModal>

            <NotificationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} type="error" title="Hapus Hak Akses?" message={`Anda akan menghapus role ${roleToDelete?.name}. Pengguna dengan role ini mungkin akan kehilangan akses ke modul tertentu.`} actionLabel="Ya, Hapus Role" onAction={onConfirmDelete}/>

            <NotificationModal isOpen={notif.isOpen} onClose={() => setNotif({ ...notif, isOpen: false })} type={notif.type} title={notif.title} message={notif.message}/>
        </div>
    );
}
