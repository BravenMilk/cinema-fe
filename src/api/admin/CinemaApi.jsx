import axiosClient from "../axiosClient";

export const getAdminCinemas = async (params = {}) => {
    try {
        const response = await axiosClient.get('/cinemas', { params });
        return response.data;
    } catch (error) {
        console.error("CinemaApi: Gagal mengambil data bioskop:", error);
        throw error;
    }
};

export const createCinema = async (data) => {
    try {
        const response = await axiosClient.post('/cinemas', data);
        return response.data;
    } catch (error) {
        console.error("CinemaApi: Gagal membuat bioskop baru:", error);
        throw error;
    }
};

export const updateCinema = async (id, data) => {
    try {
        const response = await axiosClient.put(`/cinemas/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`CinemaApi: Gagal update bioskop ID ${id}:`, error);
        throw error;
    }
};

export const deleteCinema = async (id) => {
    try {
        const response = await axiosClient.delete(`/cinemas/${id}`);
        return response.data;
    } catch (error) {
        console.error(`CinemaApi: Gagal menghapus bioskop ID ${id}:`, error);
        throw error;
    }
};
