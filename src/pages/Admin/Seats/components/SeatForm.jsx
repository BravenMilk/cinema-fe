import React, { useState, useEffect } from 'react';
import { getAdminHalls } from '../../../../api/admin/HallApi';
import { getAdminSeatTypes } from '../../../../api/admin/SeatTypeApi';
import CustomSelect from '../../../../components/Common/CustomSelect';

export default function SeatForm({ initialData = null, onSubmit, onCancel, loading = false }) {
    const [formData, setFormData] = useState({
        hall_id: initialData?.hall_id || '',
        seat_type_id: initialData?.seat_type_id || '',
        row_label: initialData?.row_label || '',
        seat_number: initialData?.seat_number || '',
        pos_x: initialData?.pos_x || 0,
        pos_y: initialData?.pos_y || 0,
        is_active: initialData?.is_active ?? true
    });

    const [halls, setHalls] = useState([]);
    const [types, setTypes] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const [hResponse, tResponse] = await Promise.all([
                    getAdminHalls({ limit: 100 }),
                    getAdminSeatTypes({ limit: 100 })
                ]);
                setHalls(hResponse.data?.data || hResponse.data || []);
                setTypes(tResponse.data?.data || tResponse.data || []);
            } catch (err) {
                console.error("Gagal memuat referensi kursi", err);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.hall_id) newErrors.hall_id = "Wajib pilih studio";
        if (!formData.seat_type_id) newErrors.seat_type_id = "Wajib pilih tipe kursi";
        if (!formData.row_label.trim()) newErrors.row_label = "Label baris wajib diisi (A, B, C...)";
        if (!formData.seat_number) newErrors.seat_number = "Nomor kursi wajib diisi";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                        Pilih Studio
                    </label>
                    <CustomSelect
                        options={halls.map(h => ({ id: h.id, name: `${h.name} - ${h.cinema?.name || 'N/A'}` }))}
                        value={formData.hall_id}
                        onChange={(val) => setFormData({ ...formData, hall_id: val })}
                        placeholder="Pilih Studio"
                        loading={loadingData}
                    />
                    {errors.hall_id && <p className="text-rose-400 text-[10px] font-bold mt-1 ml-1">{errors.hall_id}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                        Tipe Kursi
                    </label>
                    <CustomSelect
                        options={types}
                        value={formData.seat_type_id}
                        onChange={(val) => setFormData({ ...formData, seat_type_id: val })}
                        placeholder="Pilih Tipe"
                        loading={loadingData}
                    />
                    {errors.seat_type_id && <p className="text-rose-400 text-[10px] font-bold mt-1 ml-1">{errors.seat_type_id}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                        Baris (Row)
                    </label>
                    <input
                        type="text"
                        value={formData.row_label}
                        onChange={(e) => setFormData({ ...formData, row_label: e.target.value.toUpperCase() })}
                        placeholder="Contoh: A"
                        className={`w-full px-6 py-4 bg-white/5 border ${errors.row_label ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-white font-medium`}
                    />
                    {errors.row_label && <p className="text-rose-400 text-[10px] font-bold mt-1 ml-1">{errors.row_label}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                        Nomor Kursi
                    </label>
                    <input
                        type="number"
                        value={formData.seat_number}
                        onChange={(e) => setFormData({ ...formData, seat_number: e.target.value })}
                        placeholder="Contoh: 1"
                        className={`w-full px-6 py-4 bg-white/5 border ${errors.seat_number ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-white font-medium`}
                    />
                    {errors.seat_number && <p className="text-rose-400 text-[10px] font-bold mt-1 ml-1">{errors.seat_number}</p>}
                </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/10 mt-4">
                <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Status Kursi</label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_active: true })}
                            className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.is_active ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-500'}`}
                        >
                            Aktif
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_active: false })}
                            className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${!formData.is_active ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-white/5 border-white/5 text-slate-500'}`}
                        >
                            Nonaktif
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 bg-white/5 border border-white/10 text-slate-400 font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]"
                    disabled={loading}
                >
                    Batalkan
                </button>
                <button
                    type="submit"
                    className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px] flex items-center justify-center disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Menyimpan...' : initialData ? 'Update Kursi' : 'Simpan Kursi'}
                </button>
            </div>
        </form>
    );
}
