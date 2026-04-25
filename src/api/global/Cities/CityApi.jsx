import axiosClient from "../../axiosClient";

export const getAllCities = async (params = {}) => {
    try {
        const response = await axiosClient.get("/cities", { params });
        return response.data;
    } catch (error) {
        console.error("CityApi: Gagal mengambil data kota:", error);
        throw error;
    }
};