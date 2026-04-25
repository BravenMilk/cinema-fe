import { useState, useEffect, useCallback } from "react";
import { getAllCities } from "../../../api/global/Cities/CityApi";

export const useCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        search: search || undefined
      };

      const response = await getAllCities(params);
      const cityData = response.data?.data || response.data || [];
      const metaData = response.data || {};

      setCities(Array.isArray(cityData) ? cityData : []);
      setMeta({
        current_page: metaData.current_page || 1,
        last_page: metaData.last_page || 1,
        total: metaData.total || 0
      });
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data kota");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

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

  return {
    cities,
    loading,
    error,
    meta,
    page,
    search,
    setSearch: handleSearch,
    setPage: changePage,
    refresh: fetchCities
  };
};