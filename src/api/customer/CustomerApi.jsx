import axiosClient from "../axiosClient";

export const getMyBookings = async (params = {}) => {
    try {
        const response = await axiosClient.get('/my-bookings', { params });
        return response.data;
    } catch (error) {
        console.error("CustomerApi: Gagal mengambil riwayat pemesanan:", error);
        throw error;
    }
};

export const updateProfile = async (data) => {
    try {
        const response = await axiosClient.put('/profile', data);
        return response.data;
    } catch (error) {
        console.error("CustomerApi: Gagal memperbarui profil:", error);
        throw error;
    }
};

export const cancelBooking = async (bookingCode) => {
    try {
        const response = await axiosClient.post(`/bookings/${bookingCode}/cancel`);
        return response.data;
    } catch (error) {
        console.error("CustomerApi: Gagal membatalkan booking:", error);
        throw error;
    }
};
