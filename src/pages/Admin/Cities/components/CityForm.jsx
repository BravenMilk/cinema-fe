import React from 'react';

export default function CityForm({ initialData = null, onSubmit, onCancel, loading = false }) {
    const [formData, setFormData] = React.useState({
        name: initialData?.name || ''
    });

    const [errors, setErrors] = React.useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Nama kota wajib diisi";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: '#e50914' }}>
                    Nama Kota
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Jakarta Selatan"
                    className={`w-full px-6 py-4 rounded-2xl focus:outline-none transition-all text-white font-medium`} style={{ background: 'rgba(255,255,255,0.04)', border: errors.name ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.08)' }} onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }} onBlur={e => { e.target.style.borderColor = errors.name ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                    disabled={loading}
                />
                {errors.name && (
                    <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">
                        {errors.name}
                    </p>
                )}
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
                    className="flex-[2] py-4 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center disabled:opacity-50" style={{ background: '#e50914', boxShadow: '0 8px 24px rgba(229,9,20,0.25)' }} onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#ff1a1a'; }} onMouseLeave={e => { e.currentTarget.style.background = '#e50914'; }}
                    disabled={loading}
                >
                    {loading ? 'Menyimpan...' : initialData ? 'Update Kota' : 'Simpan Kota'}
                </button>
            </div>
        </form>
    );
}
