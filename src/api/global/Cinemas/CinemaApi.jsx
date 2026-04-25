import axiosClient from "../../axiosClient";

export const getAllCinemas = async (params = {}) => {
    try {
        const response = await axiosClient.get('/cinemas', { params });
        return response.data;
    } catch (error) {
        console.error("CinemaApi: Gagal mengambil data bioskop:", error);
        throw error;
    }
};

export const getCinemasByCity = async (cityId) => {
    try {
        const response = await axiosClient.get(`/cities/${cityId}/cinemas`);
        return response.data;
    } catch (error) {
        console.error(`CinemaApi: Gagal mengambil bioskop untuk kota ${cityId}:`, error);
        throw error;
    }
};
