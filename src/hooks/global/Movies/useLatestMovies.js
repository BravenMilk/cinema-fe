import { useState, useEffect } from "react";
import { getAllMovies } from "../../../api/global/Movies/MovieApi";

export const useLatestMovies = (limit = 6) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const response = await getAllMovies({ page: 1, per_page: limit, sort: "latest" });
                const data = response.data?.data || response.data || [];
                setMovies(Array.isArray(data) ? data.slice(0, limit) : []);
            } catch {
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [limit]);

    return { movies, loading };
};
