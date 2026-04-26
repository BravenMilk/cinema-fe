import React from 'react';
import { getAllCinemas } from "../../../../api/global/Cinemas/CinemaApi";
import CustomSelect from '../../../../components/Common/CustomSelect';

export default function HallForm({ initialData = null, onSubmit, onCancel, loading = false }) {
    const [formData, setFormData] = React.useState({
        name: initialData?.name || '',
        type: initialData?.type || '2D',
        cinema_id: initialData?.cinema_id || ''
    });

    const [cinemas, setCinemas] = React.useState([]);
    const [errors, setErrors] = React.useState({});
    const [loadingCinemas, setLoadingCinemas] = React.useState(false);

    const hallTypes = ['2D', '3D', 'IMAX', 'Premiere'];

    React.useEffect(() => {
        const fetchCinemasList = async () => {
            setLoadingCinemas(true);
            try {
                const response = await getAllCinemas({ limit: 100 });
                const cinemaData = response.data?.data || response.data || [];
                setCinemas(Array.isArray(cinemaData) ? cinemaData : []);
            } catch (err) {
                console.error("Gagal memuat daftar bioskop", err);
            } finally {
                setLoadingCinemas(false);
            }
        };
        fetchCinemasList();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Nama studio wajib diisi";
        if (!formData.cinema_id) newErrors.cinema_id = "Bioskop wajib dipilih";
        if (!formData.type) newErrors.type = "Tipe studio wajib dipilih";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: '#e50914' }}>Nama Studio / Hall</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Studio 1 atau Hall A"
                    className={`w-full px-6 py-4 rounded-2xl focus:outline-none transition-all text-white font-medium`} style={{ background: 'rgba(255,255,255,0.04)', border: errors.name ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.08)' }} onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; }} onBlur={e => { e.target.style.borderColor = errors.name ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                    disabled={loading}
                />
                {errors.name && <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">{errors.name}</p>}
            </div>

            <CustomSelect
                label="Bioskop Induk"
                options={cinemas}
                value={formData.cinema_id}
                onChange={(val) => setFormData({ ...formData, cinema_id: val })}
                placeholder="Pilih Lokasi Bioskop"
                loading={loadingCinemas}
                error={errors.cinema_id}
            />

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: '#e50914' }}>Tipe Pengalaman</label>
                <div className="flex flex-wrap gap-3">
                    {hallTypes.map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, type })}
                            className={`px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === type ? 'text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'}`}
                            style={formData.type === type ? { background: '#e50914', borderColor: '#e50914', boxShadow: '0 4px 14px rgba(229,9,20,0.3)' } : {}}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                {errors.type && <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">{errors.type}</p>}
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
                    {loading ? 'Menyimpan...' : initialData ? 'Update Studio' : 'Tambah Studio'}
                </button>
            </div>
        </form>
    );
}
