import { useState, useEffect, useCallback } from "react";
import { getAllRoles } from "../../../api/global/Roles/RoleApi";

export const useRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllRoles();
            setRoles(data.data || data);
            setError(null);
        } catch (err) {
            setError("Gagal memuat data role.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    return { roles, loading, error, refresh: fetchRoles };
};
