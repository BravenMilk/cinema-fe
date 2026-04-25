import axiosClient from "../../axiosClient";

export const getAllSeatTypes = async (params = {}) => {
    try {
        const response = await axiosClient.get('/seat-types', { params });
        return response.data;
    } catch (error) {
        console.error("SeatTypeApi: Gagal mengambil data tipe kursi:", error);
        throw error;
    }
};
