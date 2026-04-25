import React from 'react';
import CustomSelect from '../../../../components/Common/CustomSelect';

export default function MovieForm({ initialData = null, onSubmit, onCancel, loading = false }) {
    const [formData, setFormData] = React.useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        duration: initialData?.duration || '',
        poster_url: initialData?.poster_url || '',
        trailer_url: initialData?.trailer_url || '',
        release_date: initialData?.release_date || '',
        rating: initialData?.rating || ''
    });

    const [errors, setErrors] = React.useState({});

    const ratingOptions = [
        { id: 'SU', name: 'SU (Semua Umur)' },
        { id: 'R13', name: 'R13+ (Remaja)' },
        { id: 'D17', name: 'D17+ (Dewasa)' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Judul film wajib diisi";
        if (!formData.duration || formData.duration <= 0) newErrors.duration = "Durasi wajib diisi dengan angka positif";
        if (!formData.rating) newErrors.rating = "Rating wajib dipilih";
        if (!formData.release_date) newErrors.release_date = "Tanggal rilis wajib diisi";

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
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Judul Film</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Contoh: Inception"
                        className={`w-full px-6 py-4 bg-white/5 border ${errors.title ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-white font-medium`}
                        disabled={loading}
                    />
                    {errors.title && <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">{errors.title}</p>}
                </div>

                <CustomSelect
                    label="Rating Usia"
                    options={ratingOptions}
                    value={formData.rating}
                    onChange={(val) => setFormData({ ...formData, rating: val })}
                    placeholder="Pilih Rating"
                    error={errors.rating}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Durasi (Menit)</label>
                    <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="Contoh: 148"
                        className={`w-full px-6 py-4 bg-white/5 border ${errors.duration ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-white font-medium`}
                        disabled={loading}
                    />
                    {errors.duration && <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">{errors.duration}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Tanggal Rilis</label>
                    <input
                        type="date"
                        value={formData.release_date}
                        onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                        className={`w-full px-6 py-4 bg-white/5 border ${errors.release_date ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-white font-medium appearance-none`}
                        disabled={loading}
                    />
                    {errors.release_date && <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">{errors.release_date}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">URL Poster Film</label>
                    <input
                        type="url"
                        value={formData.poster_url}
                        onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                        placeholder="https://example.com/poster.jpg"
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-white font-medium"
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">URL Trailer YouTube</label>
                    <input
                        type="url"
                        value={formData.trailer_url}
                        onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-white font-medium"
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Sinopsis / Deskripsi</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tuliskan jalan cerita singkat film..."
                    rows="4"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-white font-medium resize-none"
                    disabled={loading}
                ></textarea>
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
                    {loading ? 'Menyimpan...' : initialData ? 'Update Film' : 'Simpan Film'}
                </button>
            </div>
        </form>
    );
}
