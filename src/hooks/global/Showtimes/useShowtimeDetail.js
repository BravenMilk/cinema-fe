import { useState, useCallback } from "react";
import { getShowtimeById } from "../../../api/global/Showtimes/ShowtimeApi";

export const useShowtimeDetail = () => {
    const [showtime, setShowtime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchShowtimeDetail = useCallback(async (id) => {
        setLoading(true);
        try {
            const data = await getShowtimeById(id);
            setShowtime(data.data || data);
            setError(null);
        } catch (err) {
            setError("Gagal memuat detail jadwal.");
        } finally {
            setLoading(false);
        }
    }, []);

    return { showtime, loading, error, fetchShowtimeDetail };
};
