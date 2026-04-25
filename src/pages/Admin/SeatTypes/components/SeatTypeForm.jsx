import React from 'react';

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

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                    Nama Tipe Kursi
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: VIP, Regular, Sweetbox"
                    className={`w-full px-6 py-4 bg-white/5 border ${errors.name ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-white font-medium`}
                    disabled={loading}
                />
                {errors.name && (
                    <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">
                        {errors.name}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                    Harga Tambahan (Rp)
                </label>
                <input
                    type="number"
                    value={formData.additional_price}
                    onChange={(e) => setFormData({ ...formData, additional_price: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className={`w-full px-6 py-4 bg-white/5 border ${errors.additional_price ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-white font-medium`}
                    disabled={loading}
                />
                <p className="text-slate-500 text-[9px] font-medium uppercase tracking-wider ml-1 mt-1">
                    Biaya tambahan di atas harga dasar tiket
                </p>
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
                    {loading ? 'Menyimpan...' : initialData ? 'Update Tipe' : 'Simpan Tipe'}
                </button>
            </div>
        </form>
    );
}
