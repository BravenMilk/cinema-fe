import React from 'react';
import CustomSelect from '../../../../components/Common/CustomSelect';

const inp = "w-full px-5 py-4 rounded-2xl focus:outline-none transition-all text-white font-medium";
const inpStyle = (err) => ({ background: 'rgba(255,255,255,0.04)', border: err ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.08)' });
const onFocus = (e) => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; };
const onBlur = (err) => (e) => { e.target.style.borderColor = err ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

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
        if (!formData.duration || formData.duration <= 0) newErrors.duration = "Durasi wajib diisi";
        if (!formData.rating) newErrors.rating = "Rating wajib dipilih";
        if (!formData.release_date) newErrors.release_date = "Tanggal rilis wajib diisi";
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        onSubmit(formData);
    };

    const Label = ({ children }) => (
        <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: '#e50914' }}>{children}</label>
    );
    const Err = ({ msg }) => msg ? <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">{msg}</p> : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label>Judul Film</Label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Contoh: Inception" className={inp} style={inpStyle(errors.title)}
                        onFocus={onFocus} onBlur={onBlur(errors.title)} disabled={loading} />
                    <Err msg={errors.title} />
                </div>

                <CustomSelect label="Rating Usia" options={ratingOptions} value={formData.rating}
                    onChange={(val) => setFormData({ ...formData, rating: val })} placeholder="Pilih Rating" error={errors.rating} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label>Durasi (Menit)</Label>
                    <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="Contoh: 148" className={inp} style={inpStyle(errors.duration)}
                        onFocus={onFocus} onBlur={onBlur(errors.duration)} disabled={loading} />
                    <Err msg={errors.duration} />
                </div>

                <div className="space-y-2">
                    <Label>Tanggal Rilis</Label>
                    <input type="date" value={formData.release_date} onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                        className={inp + " appearance-none"} style={inpStyle(errors.release_date)}
                        onFocus={onFocus} onBlur={onBlur(errors.release_date)} disabled={loading} />
                    <Err msg={errors.release_date} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label>URL Poster Film</Label>
                    <input type="url" value={formData.poster_url} onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                        placeholder="https://example.com/poster.jpg" className={inp} style={inpStyle(false)}
                        onFocus={onFocus} onBlur={onBlur(false)} disabled={loading} />
                </div>

                <div className="space-y-2">
                    <Label>URL Trailer YouTube</Label>
                    <input type="url" value={formData.trailer_url} onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..." className={inp} style={inpStyle(false)}
                        onFocus={onFocus} onBlur={onBlur(false)} disabled={loading} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Sinopsis / Deskripsi</Label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tuliskan jalan cerita singkat film..." rows="4"
                    className={inp + " resize-none"} style={inpStyle(false)}
                    onFocus={onFocus} onBlur={onBlur(false)} disabled={loading} />
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
                    {loading ? 'Menyimpan...' : initialData ? 'Update Film' : 'Simpan Film'}
                </button>
            </div>
        </form>
    );
}
