import axiosClient from "../axiosClient";

export const getAdminMovies = async (params = {}) => {
    try {
        const response = await axiosClient.get('/movies', { params });
        return response.data;
    } catch (error) {
        console.error("MovieApi: Gagal mengambil data film:", error);
        throw error;
    }
};

export const createMovie = async (data) => {
    try {
        const response = await axiosClient.post('/movies', data);
        return response.data;
    } catch (error) {
        console.error("MovieApi: Gagal membuat film:", error);
        throw error;
    }
};

export const updateMovie = async (id, data) => {
    try {
        const response = await axiosClient.put(`/movies/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("MovieApi: Gagal mengupdate film:", error);
        throw error;
    }
};

export const deleteMovie = async (id) => {
    try {
        const response = await axiosClient.delete(`/movies/${id}`);
        return response.data;
    } catch (error) {
        console.error("MovieApi: Gagal menghapus film:", error);
        throw error;
    }
};
