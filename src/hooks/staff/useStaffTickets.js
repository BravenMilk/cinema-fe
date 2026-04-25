import { useState, useEffect, useCallback } from "react";
import { getAdminBookings } from "../../api/admin/BookingApi";

export const useStaffTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                search,
                status: 'paid', // Staff usually only care about paid tickets
            };
            const response = await getAdminBookings(params);

            const paginationObj = response.data || {};
            const ticketsArray = paginationObj.data || [];

            setTickets(Array.isArray(ticketsArray) ? ticketsArray : []);
            setMeta({
                current_page: paginationObj.current_page || 1,
                last_page: paginationObj.last_page || 1,
                total: paginationObj.total || 0
            });
            setError(null);
        } catch (err) {
            setError("Gagal memuat data tiket.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    return {
        tickets, loading, error, meta, page, setPage,
        search, setSearch, refresh: fetchTickets
    };
};
