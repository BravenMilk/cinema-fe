import axiosClient from "../axiosClient";

export const getSeatLayout = async (showtimeId) => {
    try {
        const response = await axiosClient.get('/seats/layout', {
            params: { showtime_id: showtimeId }
        });
        return response.data;
    } catch (error) {
        console.error("BookingApi: Gagal mengambil layout kursi:", error);
        throw error;
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await axiosClient.post('/bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error("BookingApi: Gagal membuat pesanan:", error);
        throw error;
    }
};

export const getMyBookings = async (params = {}) => {
    try {
        const response = await axiosClient.get('/my-bookings', { params });
        return response.data;
    } catch (error) {
        console.error("BookingApi: Gagal mengambil data pesanan saya:", error);
        throw error;
    }
};
