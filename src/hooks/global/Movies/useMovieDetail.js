import { useState, useCallback } from "react";
import { getMovieById } from "../../../api/global/Movies/MovieApi";

export const useMovieDetail = () => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const fetchMovieDetail = useCallback(async (id) => {
        if (!id) return;

        setIsOpen(true);
        setLoading(true);
        setError(null);

        try {
            const response = await getMovieById(id);
            const data = response.data || response;
            setMovie(data);
        } catch (err) {
            console.error("useMovieDetail: Error", err);
            setError("Gagal memuat detail film. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => {
            setMovie(null);
            setError(null);
        }, 300);
    }, []);

    return {
        movie,
        loading,
        error,
        isOpen,
        fetchMovieDetail,
        closeModal
    };
};
