import React from 'react';

const inp = "w-full px-5 py-4 rounded-2xl focus:outline-none transition-all text-white font-medium";
const inpStyle = (err) => ({ background: 'rgba(255,255,255,0.04)', border: err ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.08)' });
const onFocus = (e) => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; };
const onBlur = (err) => (e) => { e.target.style.borderColor = err ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

export default function SeatTypeForm({ initialData = null, onSubmit, onCancel, loading = false }) {
    const [formData, setFormData] = React.useState({
        name: initialData?.name || '',
        additional_price: initialData?.additional_price || 0
    });
    const [errors, setErrors] = React.useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Nama tipe kursi wajib diisi";
        if (formData.additional_price < 0) newErrors.additional_price = "Harga tambahan tidak boleh negatif";
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        onSubmit(formData);
    };

    const Label = ({ children }) => (
        <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: '#e50914' }}>{children}</label>
    );
    const Err = ({ msg }) => msg ? <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">{msg}</p> : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label>Nama Tipe Kursi</Label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: VIP, Regular, Sweetbox" className={inp} style={inpStyle(errors.name)}
                    onFocus={onFocus} onBlur={onBlur(errors.name)} disabled={loading} />
                <Err msg={errors.name} />
            </div>

            <div className="space-y-2">
                <Label>Harga Tambahan (Rp)</Label>
                <input type="number" value={formData.additional_price}
                    onChange={(e) => setFormData({ ...formData, additional_price: parseInt(e.target.value) || 0 })}
                    placeholder="0" className={inp} style={inpStyle(errors.additional_price)}
                    onFocus={onFocus} onBlur={onBlur(errors.additional_price)} disabled={loading} />
                <p className="text-[9px] font-medium uppercase tracking-wider ml-1 mt-1" style={{ color: '#555555' }}>
                    Biaya tambahan di atas harga dasar tiket
                </p>
                <Err msg={errors.additional_price} />
            </div>

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
                    {loading ? 'Menyimpan...' : initialData ? 'Update Tipe' : 'Simpan Tipe'}
                </button>
            </div>
        </form>
    );
}
