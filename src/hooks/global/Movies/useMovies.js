import { useState, useEffect, useCallback } from "react";
import { getAllMovies } from "../../../api/global/Movies/MovieApi";

export const useMovies = () => {
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
            const params = {
                page,
                search: search || undefined,
                rating: rating || undefined
            };

            const response = await getAllMovies(params);

            const movieData = response.data?.data || response.data || [];
            const metaData = response.data || {};

            setMovies(Array.isArray(movieData) ? movieData : []);
            setMeta({
                current_page: metaData.current_page || 1,
                last_page: metaData.last_page || 1,
                total: metaData.total || 0
            });
            setError(null);
        } catch (err) {
            console.error("useMovies: Error fetching movies", err);
            setError("Gagal memuat daftar film.");
        } finally {
            setLoading(false);
        }
    }, [page, search, rating]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const changePage = useCallback((newPage) => {
        setPage((prevPage) => {
            if (newPage >= 1 && newPage <= meta.last_page && newPage !== prevPage) {
                return newPage;
            }
            return prevPage;
        });
    }, [meta.last_page]);

    const handleSearch = useCallback((value) => {
        setSearch((prevSearch) => {
            if (value !== prevSearch) {
                setPage(1); 
                return value;
            }
            return prevSearch;
        });
    }, []);

    const handleFilter = useCallback((value) => {
        setRating((prevRating) => {
            if (value !== prevRating) {
                setPage(1); 
                return value;
            }
            return prevRating;
        });
    }, []);

    return {
        movies,
        loading,
        error,
        meta,
        page,
        search,
        rating,
        setSearch: handleSearch,
        setRating: handleFilter,
        setPage: changePage,
        refresh: fetchMovies
    };
};
