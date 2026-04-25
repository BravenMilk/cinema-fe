import { useState, useEffect, useCallback } from "react";
import { getAdminSeatTypes, createSeatType, updateSeatType, deleteSeatType } from "../../../api/admin/SeatTypeApi";

export const useAdminSeatTypes = () => {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchTypes = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, search };
            const response = await getAdminSeatTypes(params);

            const data = response.data?.data || response.data || [];
            const metaData = response.data || {};

            setTypes(Array.isArray(data) ? data : []);
            setMeta({
                current_page: metaData.current_page || 1,
                last_page: metaData.last_page || 1,
                total: metaData.total || 0
            });
            setError(null);
        } catch (err) {
            setError("Gagal memuat data tipe kursi.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    const handleCreate = async (data) => {
        try {
            await createSeatType(data);
            fetchTypes();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal membuat tipe kursi." };
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await updateSeatType(id, data);
            fetchTypes();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal mengupdate tipe kursi." };
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteSeatType(id);
            fetchTypes();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal menghapus tipe kursi." };
        }
    };

    return {
        types, loading, error, meta, page, setPage, search, setSearch,
        handleCreate, handleUpdate, handleDelete, refresh: fetchTypes
    };
};
