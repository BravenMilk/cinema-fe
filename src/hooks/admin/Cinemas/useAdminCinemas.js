import { useState, useEffect, useCallback } from "react";
import { getAdminCinemas, createCinema, updateCinema, deleteCinema } from "../../../api/admin/CinemaApi";

export const useAdminCinemas = () => {
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [city_id, setCityId] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchCinemas = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, search, city_id };
            const response = await getAdminCinemas(params);

            const data = response.data?.data || response.data || [];
            const metaData = response.data || {};

            setCinemas(Array.isArray(data) ? data : []);
            setMeta({
                current_page: metaData.current_page || 1,
                last_page: metaData.last_page || 1,
                total: metaData.total || 0
            });
            setError(null);
        } catch (err) {
            setError("Gagal memuat data bioskop.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, city_id]);

    useEffect(() => {
        fetchCinemas();
    }, [fetchCinemas]);

    const handleCreate = async (data) => {
        try {
            await createCinema(data);
            fetchCinemas();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal membuat bioskop." };
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await updateCinema(id, data);
            fetchCinemas();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal mengupdate bioskop." };
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCinema(id);
            fetchCinemas();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal menghapus bioskop." };
        }
    };

    return {
        cinemas, loading, error, meta, page, setPage, search, setSearch, city_id, setCityId,
        handleCreate, handleUpdate, handleDelete, refresh: fetchCinemas
    };
};
