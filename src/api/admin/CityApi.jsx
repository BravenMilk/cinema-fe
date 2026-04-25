import axiosClient from "../axiosClient";

export const getAdminCities = async (params = {}) => {
    try {
        const response = await axiosClient.get('/cities', { params });
        return response.data;
    } catch (error) {
        console.error("CityApi: Gagal mengambil data kota:", error);
        throw error;
    }
};

export const createCity = async (data) => {
    try {
        const response = await axiosClient.post('/cities', data);
        return response.data;
    } catch (error) {
        console.error("CityApi: Gagal membuat kota baru:", error);
        throw error;
    }
};

export const updateCity = async (id, data) => {
    try {
        const response = await axiosClient.put(`/cities/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`CityApi: Gagal update kota ID ${id}:`, error);
        throw error;
    }
};

export const deleteCity = async (id) => {
    try {
        const response = await axiosClient.delete(`/cities/${id}`);
        return response.data;
    } catch (error) {
        console.error(`CityApi: Gagal menghapus kota ID ${id}:`, error);
        throw error;
    }
};
