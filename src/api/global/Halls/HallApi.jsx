import axiosClient from "../../axiosClient";

export const getAllHalls = async (params = {}) => {
    try {
        const response = await axiosClient.get('/halls', { params });
        return response.data;
    } catch (error) {
        console.error("HallApi: Gagal mengambil data hall:", error);
        throw error;
    }
};

export const getHallById = async (id) => {
    try {
        const response = await axiosClient.get(`/halls/${id}`);
        return response.data;
    } catch (error) {
        console.error(`HallApi: Gagal mengambil detail hall ${id}:`, error);
        throw error;
    }
};
