import React, { useState, useEffect } from 'react';
import { getAdminMovies } from '../../../../api/admin/MovieApi';
import { getAdminHalls } from '../../../../api/admin/HallApi';
import CustomSelect from '../../../../components/Common/CustomSelect';

const inp = "w-full px-5 py-4 rounded-2xl focus:outline-none transition-all text-white text-xs font-bold";
const inpStyle = (err) => ({ background: 'rgba(255,255,255,0.04)', border: err ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.08)' });
const onFocus = (e) => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,9,20,0.08)'; };
const onBlur = (err) => (e) => { e.target.style.borderColor = err ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

export default function ShowtimeForm({ initialData = null, onSubmit, onCancel, loading = false }) {
    const toLocalInput = (val) => {
        if (!val) return '';
        const normalized = val.includes('T') ? val : val.replace(' ', 'T');
        const withUTC = (normalized.includes('+') || normalized.includes('Z')) ? normalized : normalized + 'Z';
        const d = new Date(withUTC);
        if (isNaN(d.getTime())) return '';
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
                setMovies((mResponse.data?.data || mResponse.data || []).map(m => ({ id: m.id, name: m.title })));
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
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        const toUTCString = (val) => {
            if (!val) return null;
            const localDate = new Date(val);
            const pad = (n) => String(n).padStart(2, '0');
            return `${localDate.getUTCFullYear()}-${pad(localDate.getUTCMonth()+1)}-${pad(localDate.getUTCDate())} ${pad(localDate.getUTCHours())}:${pad(localDate.getUTCMinutes())}:00`;
        };

        onSubmit({
            ...formData,
            start_time: toUTCString(formData.start_time),
            end_time: toUTCString(formData.end_time),
            booking_start_at: formData.booking_start_at ? toUTCString(formData.booking_start_at) : null,
            booking_end_at: formData.booking_end_at ? toUTCString(formData.booking_end_at) : null,
        });
    };

    const Label = ({ children }) => (
        <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: '#e50914' }}>{children}</label>
    );
    const Err = ({ msg }) => msg ? <p className="text-rose-400 text-[10px] font-bold mt-1 ml-1">{msg}</p> : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label>Pilih Film</Label>
                    <CustomSelect options={movies} value={formData.movie_id} onChange={(val) => setFormData({ ...formData, movie_id: val })} placeholder="Pilih Film" loading={loadingData} />
                    <Err msg={errors.movie_id} />
                </div>

                <div className="space-y-2">
                    <Label>Pilih Studio</Label>
                    <CustomSelect options={halls.map(h => ({ id: h.id, name: `${h.name} - ${h.cinema?.name || 'N/A'}` }))} value={formData.hall_id} onChange={(val) => setFormData({ ...formData, hall_id: val })} placeholder="Pilih Studio" loading={loadingData} />
                    <Err msg={errors.hall_id} />
                </div>

                <div className="space-y-2">
                    <Label>Waktu Mulai</Label>
                    <input type="datetime-local" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        className={inp} style={inpStyle(errors.start_time)} onFocus={onFocus} onBlur={onBlur(errors.start_time)} />
                    <Err msg={errors.start_time} />
                </div>

                <div className="space-y-2">
                    <Label>Waktu Selesai</Label>
                    <input type="datetime-local" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        className={inp} style={inpStyle(errors.end_time)} onFocus={onFocus} onBlur={onBlur(errors.end_time)} />
                    <Err msg={errors.end_time} />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <Label>Harga Dasar (Rp)</Label>
                    <input type="number" value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: parseInt(e.target.value) || 0 })}
                        placeholder="Contoh: 35000" className={inp} style={inpStyle(errors.base_price)} onFocus={onFocus} onBlur={onBlur(errors.base_price)} />
                    <Err msg={errors.base_price} />
                </div>

                <div className="h-px md:col-span-2" style={{ background: 'rgba(255,255,255,0.05)' }} />

                <div className="space-y-2">
                    <Label>Pemesanan Dibuka (Opsional)</Label>
                    <input type="datetime-local" value={formData.booking_start_at} onChange={(e) => setFormData({ ...formData, booking_start_at: e.target.value })}
                        className={inp} style={inpStyle(false)} onFocus={onFocus} onBlur={onBlur(false)} />
                </div>

                <div className="space-y-2">
                    <Label>Pemesanan Ditutup (Opsional)</Label>
                    <input type="datetime-local" value={formData.booking_end_at} onChange={(e) => setFormData({ ...formData, booking_end_at: e.target.value })}
                        className={inp} style={inpStyle(false)} onFocus={onFocus} onBlur={onBlur(false)} />
                </div>
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
                    {loading ? 'Menyimpan...' : initialData ? 'Update Jadwal' : 'Simpan Jadwal'}
                </button>
            </div>
        </form>
    );
}
