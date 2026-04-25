import axiosClient from "../axiosClient";

export const getAdminHalls = async (params = {}) => {
    try {
        const response = await axiosClient.get('/halls', { params });
        return response.data;
    } catch (error) {
        console.error("HallApi: Gagal mengambil data studio:", error);
        throw error;
    }
};

export const createHall = async (data) => {
    try {
        const response = await axiosClient.post('/halls', data);
        return response.data;
    } catch (error) {
        console.error("HallApi: Gagal membuat studio baru:", error);
        throw error;
    }
};

export const updateHall = async (id, data) => {
    try {
        const response = await axiosClient.put(`/halls/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`HallApi: Gagal update studio ID ${id}:`, error);
        throw error;
    }
};

export const deleteHall = async (id) => {
    try {
        const response = await axiosClient.delete(`/halls/${id}`);
        return response.data;
    } catch (error) {
        console.error(`HallApi: Gagal menghapus studio ID ${id}:`, error);
        throw error;
    }
};
