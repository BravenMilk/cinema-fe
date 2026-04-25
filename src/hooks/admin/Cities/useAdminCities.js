import { useState, useEffect, useCallback } from "react";
import { getAdminCities, createCity, updateCity, deleteCity } from "../../../api/admin/CityApi";

export const useAdminCities = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchCities = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, search };
            const response = await getAdminCities(params);

            const data = response.data?.data || response.data || [];
            const metaData = response.data || {};

            setCities(Array.isArray(data) ? data : []);
            setMeta({
                current_page: metaData.current_page || 1,
                last_page: metaData.last_page || 1,
                total: metaData.total || 0
            });
            setError(null);
        } catch (err) {
            setError("Gagal memuat data kota.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchCities();
    }, [fetchCities]);

    const handleCreate = async (data) => {
        try {
            await createCity(data);
            fetchCities(); 
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal membuat kota." };
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await updateCity(id, data);
            fetchCities(); 
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal mengupdate kota." };
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCity(id);
            fetchCities(); 
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal menghapus kota." };
        }
    };

    return {
        cities,
        loading,
        error,
        meta,
        page,
        setPage,
        search,
        setSearch,
        handleCreate,
        handleUpdate,
        handleDelete,
        refresh: fetchCities
    };
};
