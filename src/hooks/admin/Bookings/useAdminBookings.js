import { useState, useEffect, useCallback } from "react";
import { getAdminBookings, getBookingRecap } from "../../../api/admin/BookingApi";

export const useAdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                search,
                status,
                start_date: startDate,
                end_date: endDate
            };
            const response = await getAdminBookings(params);

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
            setError("Gagal memuat data pemesanan.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, status, startDate, endDate]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const fetchRecap = async (params) => {
        try {
            const response = await getBookingRecap(params);
            return response;
        } catch (err) {
            console.error("Gagal memuat rekap", err);
            return null;
        }
    };

    return {
        bookings, loading, error, meta, page, setPage,
        search, setSearch, status, setStatus,
        startDate, setStartDate, endDate, setEndDate,
        fetchRecap, refresh: fetchBookings
    };
};
