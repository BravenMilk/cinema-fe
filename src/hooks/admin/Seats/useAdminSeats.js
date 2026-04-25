import { useState, useEffect, useCallback } from "react";
import { getAdminSeats, createSeat, updateSeat, deleteSeat } from "../../../api/admin/SeatApi";

export const useAdminSeats = () => {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [hall_id, setHallId] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchSeats = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, search, hall_id };
            const response = await getAdminSeats(params);

            const data = response.data?.data || response.data || [];
            const metaData = response.data || {};

            setSeats(Array.isArray(data) ? data : []);
            setMeta({
                current_page: metaData.current_page || 1,
                last_page: metaData.last_page || 1,
                total: metaData.total || 0
            });
            setError(null);
        } catch (err) {
            setError("Gagal memuat data kursi.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, hall_id]);

    useEffect(() => {
        fetchSeats();
    }, [fetchSeats]);

    const handleCreate = async (data) => {
        try {
            await createSeat(data);
            fetchSeats();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal membuat kursi." };
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await updateSeat(id, data);
            fetchSeats();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal mengupdate kursi." };
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteSeat(id);
            fetchSeats();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal menghapus kursi." };
        }
    };

    return {
        seats, loading, error, meta, page, setPage, search, setSearch, hall_id, setHallId,
        handleCreate, handleUpdate, handleDelete, refresh: fetchSeats
    };
};
