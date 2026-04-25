import { useState, useEffect, useCallback } from "react";
import { getAdminMovies, createMovie, updateMovie, deleteMovie } from "../../../api/admin/MovieApi";

export const useAdminMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [rating, setRating] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchMovies = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, search, rating };
            const response = await getAdminMovies(params);

            const data = response.data?.data || response.data || [];
            const metaData = response.data || {};

            setMovies(Array.isArray(data) ? data : []);
            setMeta({
                current_page: metaData.current_page || 1,
                last_page: metaData.last_page || 1,
                total: metaData.total || 0
            });
            setError(null);
        } catch (err) {
            setError("Gagal memuat data film.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, rating]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleCreate = async (data) => {
        try {
            await createMovie(data);
            fetchMovies();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal membuat film." };
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await updateMovie(id, data);
            fetchMovies();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal mengupdate film." };
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteMovie(id);
            fetchMovies();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal menghapus film." };
        }
    };

    return {
        movies, loading, error, meta, page, setPage, search, setSearch, rating, setRating,
        handleCreate, handleUpdate, handleDelete, refresh: fetchMovies
    };
};
