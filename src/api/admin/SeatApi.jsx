import axiosClient from "../axiosClient";

export const getAdminSeats = async (params = {}) => {
    try {
        const response = await axiosClient.get('/seats', { params });
        return response.data;
    } catch (error) {
        console.error("SeatApi: Gagal mengambil data kursi:", error);
        throw error;
    }
};

export const createSeat = async (data) => {
    try {
        const response = await axiosClient.post('/seats', data);
        return response.data;
    } catch (error) {
        console.error("SeatApi: Gagal membuat kursi baru:", error);
        throw error;
    }
};

export const updateSeat = async (id, data) => {
    try {
        const response = await axiosClient.put(`/seats/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`SeatApi: Gagal update kursi ID ${id}:`, error);
        throw error;
    }
};

export const deleteSeat = async (id) => {
    try {
        const response = await axiosClient.delete(`/seats/${id}`);
        return response.data;
    } catch (error) {
        console.error(`SeatApi: Gagal menghapus kursi ID ${id}:`, error);
        throw error;
    }
};
