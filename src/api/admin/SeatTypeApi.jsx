import axiosClient from "../axiosClient";

export const getAdminSeatTypes = async (params = {}) => {
    try {
        const response = await axiosClient.get('/seat-types', { params });
        return response.data;
    } catch (error) {
        console.error("SeatTypeApi: Gagal mengambil data tipe kursi:", error);
        throw error;
    }
};

export const createSeatType = async (data) => {
    try {
        const response = await axiosClient.post('/seat-types', data);
        return response.data;
    } catch (error) {
        console.error("SeatTypeApi: Gagal membuat tipe kursi baru:", error);
        throw error;
    }
};

export const updateSeatType = async (id, data) => {
    try {
        const response = await axiosClient.put(`/seat-types/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`SeatTypeApi: Gagal update tipe kursi ID ${id}:`, error);
        throw error;
    }
};

export const deleteSeatType = async (id) => {
    try {
        const response = await axiosClient.delete(`/seat-types/${id}`);
        return response.data;
    } catch (error) {
        console.error(`SeatTypeApi: Gagal menghapus tipe kursi ID ${id}:`, error);
        throw error;
    }
};
