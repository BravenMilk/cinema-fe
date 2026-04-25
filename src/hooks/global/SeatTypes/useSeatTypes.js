import { useState, useEffect } from "react";
import { getAllSeatTypes } from "../../../api/global/SeatTypes/SeatTypeApi";

export const useSeatTypes = () => {
    const [seatTypes, setSeatTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSeatTypes = async () => {
        setLoading(true);
        try {
            const data = await getAllSeatTypes();
            const seatData = data.data?.data || data.data || data;
            setSeatTypes(Array.isArray(seatData) ? seatData : []);
            setError(null);
        } catch (err) {
            console.error("useSeatTypes: Error fetching seat types", err);
            setError("Gagal memuat tipe kursi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeatTypes();
    }, []);

    return { seatTypes, loading, error, refresh: fetchSeatTypes };
};
