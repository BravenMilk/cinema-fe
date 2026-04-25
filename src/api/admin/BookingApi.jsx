import axiosClient from "../axiosClient";

export const getAdminBookings = async (params = {}) => {
    try {
        const response = await axiosClient.get('/bookings', { params });
        return response.data;
    } catch (error) {
        console.error("BookingApi: Gagal mengambil data pemesanan:", error);
        throw error;
    }
};

export const getBookingRecap = async (params = {}) => {
    try {
        const response = await axiosClient.get('/bookings/recap', { params });
        return response.data;
    } catch (error) {
        console.error("BookingApi: Gagal mengambil rekapitulasi:", error);
        throw error;
    }
};
