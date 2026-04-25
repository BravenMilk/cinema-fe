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
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Nama Studio / Hall</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Studio 1 atau Hall A"
                    className={`w-full px-6 py-4 bg-white/5 border ${errors.name ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-white font-medium`}
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
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Tipe Pengalaman</label>
                <div className="flex flex-wrap gap-3">
                    {hallTypes.map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, type })}
                            className={`px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === type
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                                }`}
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
                    className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px] flex items-center justify-center disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Menyimpan...' : initialData ? 'Update Studio' : 'Tambah Studio'}
                </button>
            </div>
        </form>
    );
}
