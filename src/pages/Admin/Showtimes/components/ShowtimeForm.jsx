import React, { useState, useEffect } from 'react';
import { getAdminMovies } from '../../../../api/admin/MovieApi';
import { getAdminHalls } from '../../../../api/admin/HallApi';
import CustomSelect from '../../../../components/Common/CustomSelect';

export default function ShowtimeForm({ initialData = null, onSubmit, onCancel, loading = false }) {
    // Konversi datetime dari server (UTC) ke format datetime-local dalam WIB
    const toLocalInput = (val) => {
        if (!val) return '';
        // Server menyimpan UTC, tambah +00:00 agar browser parse sebagai UTC
        const normalized = val.includes('T') ? val : val.replace(' ', 'T');
        const withUTC = (normalized.includes('+') || normalized.includes('Z'))
            ? normalized
            : normalized + 'Z'; // Z = UTC
        const d = new Date(withUTC);
        if (isNaN(d.getTime())) return '';
        // Format ke YYYY-MM-DDTHH:mm dalam WIB (UTC+7)
        const pad = (n) => String(n).padStart(2, '0');
        const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000);
        return `${wib.getUTCFullYear()}-${pad(wib.getUTCMonth()+1)}-${pad(wib.getUTCDate())}T${pad(wib.getUTCHours())}:${pad(wib.getUTCMinutes())}`;
    };

    const [formData, setFormData] = useState({
        movie_id: initialData?.movie_id || '',
        hall_id: initialData?.hall_id || '',
        start_time: toLocalInput(initialData?.start_time),
        end_time: toLocalInput(initialData?.end_time),
        booking_start_at: toLocalInput(initialData?.booking_start_at),
        booking_end_at: toLocalInput(initialData?.booking_end_at),
        base_price: initialData?.base_price || 0
    });

    const [movies, setMovies] = useState([]);
    const [halls, setHalls] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const [mResponse, hResponse] = await Promise.all([
                    getAdminMovies({ limit: 100 }),
                    getAdminHalls({ limit: 100 })
                ]);

                const movieOptions = (mResponse.data?.data || mResponse.data || []).map(m => ({
                    id: m.id,
                    name: m.title
                }));

                setMovies(movieOptions);
                setHalls(hResponse.data?.data || hResponse.data || []);
            } catch (err) {
                console.error("Gagal memuat referensi jadwal", err);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.movie_id) newErrors.movie_id = "Pilih film terlebih dahulu";
        if (!formData.hall_id) newErrors.hall_id = "Pilih studio penayangan";
        if (!formData.start_time) newErrors.start_time = "Waktu mulai wajib diisi";
        if (!formData.end_time) newErrors.end_time = "Waktu selesai wajib diisi";
        if (formData.base_price <= 0) newErrors.base_price = "Harga dasar tiket tidak valid";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // datetime-local menghasilkan waktu LOKAL browser (WIB = UTC+7)
        // Server Laravel menyimpan dalam UTC, jadi kurangi 7 jam sebelum kirim
        const toUTCString = (val) => {
            if (!val) return null;
            // val: "2026-04-25T10:06" — ini WIB, konversi ke UTC
            const localDate = new Date(val); // browser parse sebagai local time (WIB)
            // Format ke "YYYY-MM-DD HH:mm:ss" dalam UTC
            const pad = (n) => String(n).padStart(2, '0');
            return `${localDate.getUTCFullYear()}-${pad(localDate.getUTCMonth()+1)}-${pad(localDate.getUTCDate())} ${pad(localDate.getUTCHours())}:${pad(localDate.getUTCMinutes())}:00`;
        };

        const payload = {
            ...formData,
            start_time: toUTCString(formData.start_time),
            end_time: toUTCString(formData.end_time),
            booking_start_at: formData.booking_start_at ? toUTCString(formData.booking_start_at) : null,
            booking_end_at: formData.booking_end_at ? toUTCString(formData.booking_end_at) : null,
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                        Pilih Film
                    </label>
                    <CustomSelect
                        options={movies}
                        value={formData.movie_id}
                        onChange={(val) => setFormData({ ...formData, movie_id: val })}
                        placeholder="Pilih Film"
                        loading={loadingData}
                    />
                    {errors.movie_id && <p className="text-rose-400 text-[10px] font-bold mt-1 ml-1">{errors.movie_id}</p>}
                </div>

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

                <div className="space-y-2 text-white">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                        Waktu Mulai
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        className={`w-full px-6 py-4 bg-white/5 border ${errors.start_time ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-xs font-black uppercase`}
                    />
                    {errors.start_time && <p className="text-rose-400 text-[10px] font-bold mt-1 ml-1">{errors.start_time}</p>}
                </div>

                <div className="space-y-2 text-white">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                        Waktu Selesai
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        className={`w-full px-6 py-4 bg-white/5 border ${errors.end_time ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-xs font-black uppercase`}
                    />
                    {errors.end_time && <p className="text-rose-400 text-[10px] font-bold mt-1 ml-1">{errors.end_time}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                        Harga Dasar (Rp)
                    </label>
                    <input
                        type="number"
                        value={formData.base_price}
                        onChange={(e) => setFormData({ ...formData, base_price: parseInt(e.target.value) || 0 })}
                        placeholder="Contoh: 35000"
                        className={`w-full px-6 py-4 bg-white/5 border ${errors.base_price ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-white font-black italic`}
                    />
                    {errors.base_price && <p className="text-rose-400 text-[10px] font-bold mt-1 ml-1">{errors.base_price}</p>}
                </div>

                <div className="h-px bg-white/5 md:col-span-2 my-2"></div>

                <div className="space-y-2 text-white">
                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                        Pemesanan Dibuka (Opsional)
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.booking_start_at}
                        onChange={(e) => setFormData({ ...formData, booking_start_at: e.target.value })}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-xs font-black uppercase text-emerald-200"
                    />
                </div>

                <div className="space-y-2 text-white">
                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] ml-1">
                        Pemesanan Ditutup (Opsional)
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.booking_end_at}
                        onChange={(e) => setFormData({ ...formData, booking_end_at: e.target.value })}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/40 text-xs font-black uppercase text-rose-200"
                    />
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
                    {loading ? 'Menyimpan...' : initialData ? 'Update Jadwal' : 'Simpan Jadwal'}
                </button>
            </div>
        </form>
    );
}
