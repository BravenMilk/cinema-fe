import { useState, useEffect, useCallback } from "react";
import { getAllCinemas, getCinemasByCity } from "../../../api/global/Cinemas/CinemaApi";

export const useCinemas = (initialCityId = "") => {
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [cityId, setCityId] = useState(initialCityId);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchCinemas = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                search: search || undefined,
                city_id: cityId || undefined
            };

            const response = await getAllCinemas(params);

            const cinemaData = response.data?.data || response.data || [];
            const metaData = response.data || {};

            setCinemas(Array.isArray(cinemaData) ? cinemaData : []);
            setMeta({
                current_page: metaData.current_page || 1,
                last_page: metaData.last_page || 1,
                total: metaData.total || 0
            });
            setError(null);
        } catch (err) {
            console.error("useCinemas: Error fetching cinemas", err);
            setError("Gagal memuat daftar bioskop.");
        } finally {
            setLoading(false);
        }
    }, [page, search, cityId]);

    useEffect(() => {
        fetchCinemas();
    }, [fetchCinemas]);

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

    const handleCityChange = useCallback((value) => {
        setCityId((prevCityId) => {
            if (value !== prevCityId) {
                setPage(1);
                return value;
            }
            return prevCityId;
        });
    }, []);

    return {
        cinemas,
        loading,
        error,
        meta,
        page,
        search,
        cityId,
        setSearch: handleSearch,
        setCityId: handleCityChange,
        setPage: changePage,
        refresh: fetchCinemas
    };
};
