import { useState, useEffect, useCallback } from "react";
import { getAdminShowtimes, createShowtime, updateShowtime, deleteShowtime } from "../../../api/admin/ShowtimeApi";

export const useAdminShowtimes = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [movie_id, setMovieId] = useState("");
    const [hall_id, setHallId] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchShowtimes = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, search, movie_id, hall_id };
            const response = await getAdminShowtimes(params);

            const data = response.data?.data || response.data || [];
            const metaData = response.data || {};

            setShowtimes(Array.isArray(data) ? data : []);
            setMeta({
                current_page: metaData.current_page || 1,
                last_page: metaData.last_page || 1,
                total: metaData.total || 0
            });
            setError(null);
        } catch (err) {
            setError("Gagal memuat data jadwal tayang.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, movie_id, hall_id]);

    useEffect(() => {
        fetchShowtimes();
    }, [fetchShowtimes]);

    const handleCreate = async (data) => {
        try {
            await createShowtime(data);
            fetchShowtimes();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal membuat jadwal." };
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await updateShowtime(id, data);
            fetchShowtimes();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal mengupdate jadwal." };
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteShowtime(id);
            fetchShowtimes();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal menghapus jadwal." };
        }
    };

    return {
        showtimes, loading, error, meta, page, setPage, search, setSearch, movie_id, setMovieId, hall_id, setHallId,
        handleCreate, handleUpdate, handleDelete, refresh: fetchShowtimes
    };
};
