import axiosClient from "../axiosClient";

export const getAdminShowtimes = async (params = {}) => {
    try {
        const response = await axiosClient.get('/showtimes', { params });
        return response.data;
    } catch (error) {
        console.error("ShowtimeApi: Gagal mengambil data jadwal:", error);
        throw error;
    }
};

export const createShowtime = async (data) => {
    try {
        const response = await axiosClient.post('/showtimes', data);
        return response.data;
    } catch (error) {
        console.error("ShowtimeApi: Gagal membuat jadwal baru:", error);
        throw error;
    }
};

export const updateShowtime = async (id, data) => {
    try {
        const response = await axiosClient.put(`/showtimes/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`ShowtimeApi: Gagal update jadwal ID ${id}:`, error);
        throw error;
    }
};

export const deleteShowtime = async (id) => {
    try {
        const response = await axiosClient.delete(`/showtimes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`ShowtimeApi: Gagal menghapus jadwal ID ${id}:`, error);
        throw error;
    }
};
