import React, { useState, useEffect } from 'react';
import { getAdminHalls } from '../../../../api/admin/HallApi';
import { getAdminSeatTypes } from '../../../../api/admin/SeatTypeApi';
import CustomSelect from '../../../../components/Common/CustomSelect';

const inputClass = "w-full px-5 py-4 rounded-2xl focus:outline-none transition-all text-white font-medium";
const inputStyle = (hasError) => ({
    background: 'rgba(255,255,255,0.04)',
    border: hasError ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.08)'
});
const onFocus = (e) => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; };
const onBlur = (hasError) => (e) => { e.target.style.borderColor = hasError ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

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
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        onSubmit(formData);
    };

    const Label = ({ children }) => (
        <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: '#e50914' }}>
            {children}
        </label>
    );

    const ErrorMsg = ({ msg }) => msg ? (
        <p className="text-rose-400 text-[10px] font-bold mt-1 ml-1">{msg}</p>
    ) : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label>Pilih Studio</Label>
                    <CustomSelect
                        options={halls.map(h => ({ id: h.id, name: `${h.name} - ${h.cinema?.name || 'N/A'}` }))}
                        value={formData.hall_id}
                        onChange={(val) => setFormData({ ...formData, hall_id: val })}
                        placeholder="Pilih Studio"
                        loading={loadingData}
                    />
                    <ErrorMsg msg={errors.hall_id} />
                </div>

                <div className="space-y-2">
                    <Label>Tipe Kursi</Label>
                    <CustomSelect
                        options={types}
                        value={formData.seat_type_id}
                        onChange={(val) => setFormData({ ...formData, seat_type_id: val })}
                        placeholder="Pilih Tipe"
                        loading={loadingData}
                    />
                    <ErrorMsg msg={errors.seat_type_id} />
                </div>

                <div className="space-y-2">
                    <Label>Baris (Row)</Label>
                    <input
                        type="text"
                        value={formData.row_label}
                        onChange={(e) => setFormData({ ...formData, row_label: e.target.value.toUpperCase() })}
                        placeholder="Contoh: A"
                        className={inputClass}
                        style={inputStyle(errors.row_label)}
                        onFocus={onFocus}
                        onBlur={onBlur(errors.row_label)}
                    />
                    <ErrorMsg msg={errors.row_label} />
                </div>

                <div className="space-y-2">
                    <Label>Nomor Kursi</Label>
                    <input
                        type="number"
                        value={formData.seat_number}
                        onChange={(e) => setFormData({ ...formData, seat_number: e.target.value })}
                        placeholder="Contoh: 1"
                        className={inputClass}
                        style={inputStyle(errors.seat_number)}
                        onFocus={onFocus}
                        onBlur={onBlur(errors.seat_number)}
                    />
                    <ErrorMsg msg={errors.seat_number} />
                </div>
            </div>

            {/* Status */}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Label>Status Kursi</Label>
                <div className="flex gap-3 mt-3">
                    <button type="button"
                        onClick={() => setFormData({ ...formData, is_active: true })}
                        className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.is_active ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                        Aktif
                    </button>
                    <button type="button"
                        onClick={() => setFormData({ ...formData, is_active: false })}
                        className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${!formData.is_active ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                        Nonaktif
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={onCancel} disabled={loading}
                    className="flex-1 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-[10px]"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#888888' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                    Batalkan
                </button>
                <button type="submit" disabled={loading}
                    className="flex-[2] py-4 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center disabled:opacity-50"
                    style={{ background: '#e50914', boxShadow: '0 8px 24px rgba(229,9,20,0.25)' }}
                    onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#ff1a1a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#e50914'; }}>
                    {loading ? 'Menyimpan...' : initialData ? 'Update Kursi' : 'Simpan Kursi'}
                </button>
            </div>
        </form>
    );
}
