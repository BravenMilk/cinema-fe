import axiosClient from "../axiosClient";

export const getAdminRoles = async (params = {}) => {
    try {
        const response = await axiosClient.get('/roles', { params });
        return response.data;
    } catch (error) {
        console.error("RoleApi: Gagal mengambil data role:", error);
        throw error;
    }
};

export const createRole = async (data) => {
    try {
        const response = await axiosClient.post('/roles', data);
        return response.data;
    } catch (error) {
        console.error("RoleApi: Gagal membuat role baru:", error);
        throw error;
    }
};

export const updateRole = async (id, data) => {
    try {
        const response = await axiosClient.put(`/roles/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`RoleApi: Gagal update role ID ${id}:`, error);
        throw error;
    }
};

export const deleteRole = async (id) => {
    try {
        const response = await axiosClient.delete(`/roles/${id}`);
        return response.data;
    } catch (error) {
        console.error(`RoleApi: Gagal menghapus role ID ${id}:`, error);
        throw error;
    }
};
