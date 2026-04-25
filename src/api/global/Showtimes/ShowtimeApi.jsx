import axiosClient from "../../axiosClient";

export const getShowtimes = async (params = {}) => {
    try {
        const response = await axiosClient.get('/showtimes', { params });
        return response.data;
    } catch (error) {
        console.error("ShowtimeApi: Gagal mengambil daftar jadwal:", error);
        throw error;
    }
};

export const getShowtimeById = async (id) => {
    try {
        const response = await axiosClient.get(`/showtimes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`ShowtimeApi: Gagal mengambil detail jadwal ${id}:`, error);
        throw error;
    }
};
