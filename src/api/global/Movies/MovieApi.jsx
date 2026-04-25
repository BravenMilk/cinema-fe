import axiosClient from "../../axiosClient";

export const getAllMovies = async (params = {}) => {
    try {
        const response = await axiosClient.get('/movies', { params });
        return response.data;
    } catch (error) {
        console.error("MovieApi: Gagal mengambil data film:", error);
        throw error;
    }
};

export const getMovieById = async (id) => {
    if (!id) throw new Error("ID Film tidak valid.");
    const cleanId = String(id).trim();
    try {
        const response = await axiosClient.get(`/movies/${cleanId}`);
        return response.data;
    } catch (error) {
        console.error(`MovieApi: Detail error for ID [${cleanId}]:`, error.response?.status, error.message);
        throw error;
    }
};

export const getAllCinemas = async (params = {}) => {
    try {
        const response = await axiosClient.get('/cinemas', { params });
        return response.data;
    } catch (error) {
        console.error("CinemaApi: Gagal mengambil data bioskop:", error);
        throw error;
    }
};
