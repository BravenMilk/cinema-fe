import { useState, useEffect, useCallback } from "react";
import { getMyBookings } from "../../api/customer/CustomerApi";

export const useCustomerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                search
            };
            const response = await getMyBookings(params);

            const paginationObj = response.data || {};
            const bookingsArray = paginationObj.data || [];

            setBookings(Array.isArray(bookingsArray) ? bookingsArray : []);
            setMeta({
                current_page: paginationObj.current_page || 1,
                last_page: paginationObj.last_page || 1,
                total: paginationObj.total || 0
            });
            setError(null);
        } catch (err) {
            setError("Gagal memuat riwayat pemesanan.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return {
        bookings, loading, error, meta, page, setPage,
        search, setSearch, refresh: fetchBookings
    };
};
