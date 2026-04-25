import { useState, useEffect, useCallback } from "react";
import { getAdminRoles, createRole, updateRole, deleteRole } from "../../../api/admin/RoleApi";

export const useAdminRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, search };
            const response = await getAdminRoles(params);

            const data = response.data?.data || response.data || [];
            const metaData = response.data || {};

            setRoles(Array.isArray(data) ? data : []);
            setMeta({
                current_page: metaData.current_page || 1,
                last_page: metaData.last_page || 1,
                total: metaData.total || 0
            });
            setError(null);
        } catch (err) {
            setError("Gagal memuat data role.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleCreate = async (data) => {
        try {
            await createRole(data);
            fetchRoles();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal membuat role." };
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await updateRole(id, data);
            fetchRoles();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal mengupdate role." };
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteRole(id);
            fetchRoles();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Gagal menghapus role." };
        }
    };

    return {
        roles, loading, error, meta, page, setPage, search, setSearch,
        handleCreate, handleUpdate, handleDelete, refresh: fetchRoles
    };
};
