import { useState, useEffect, useCallback } from "react";
import { getAllHalls, getHallById } from "../../../api/global/Halls/HallApi";

export const useHalls = () => {
    const [halls, setHalls] = useState([]);
    const [hall, setHall] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHalls = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const data = await getAllHalls(params);
            setHalls(data.data || data);
            setError(null);
        } catch (err) {
            setError("Gagal memuat data studio.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchHallDetail = useCallback(async (id) => {
        setLoading(true);
        try {
            const data = await getHallById(id);
            setHall(data.data || data);
            setError(null);
        } catch (err) {
            setError("Gagal memuat detail studio.");
        } finally {
            setLoading(false);
        }
    }, []);

    return { halls, hall, loading, error, fetchHalls, fetchHallDetail };
};
