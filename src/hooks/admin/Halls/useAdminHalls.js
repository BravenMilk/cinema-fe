import { useState, useEffect, useCallback } from "react";
import { getAdminHalls, createHall, updateHall, deleteHall } from "../../../api/admin/HallApi";

export const useAdminHalls = () => {
    const [halls, setHalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [cinema_id, setCinemaId] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchHalls = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, search, cinema_id };
            const response = await getAdminHalls(params);

            const data = response.data?.data || response.data || [];
            const metaData = response.data || {};

            setHalls(Array.isArray(data) ? data : []);
            setMeta({
                current_page: metaData.current_page || 1,
                last_page: metaData.last_page || 1,
                total: metaData.total || 0
            });
            setError(null);
        } catch (err) {
            setError("Gagal memuat data studio.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, cinema_id]);

    useEffect(() => {
        fetchHalls();
    }, [fetchHalls]);

    const handleCreate = async (data) => {
        try {
            await createHall(data);
            fetchHalls();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal membuat studio." };
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await updateHall(id, data);
            fetchHalls();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal mengupdate studio." };
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteHall(id);
            fetchHalls();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal menghapus studio." };
        }
    };

    return {
        halls, loading, error, meta, page, setPage, search, setSearch, cinema_id, setCinemaId,
        handleCreate, handleUpdate, handleDelete, refresh: fetchHalls
    };
};
