import axiosClient from "../axiosClient";

export const scanTicket = async (ticketSerial) => {
    try {
        const response = await axiosClient.post('/tickets/scan', { serial: ticketSerial });
        return response.data;
    } catch (error) {
        console.error("StaffApi: Gagal scan tiket:", error);
        throw error;
    }
};

export const getDailyStats = async () => {
    try {
        const response = await axiosClient.get('/bookings', { params: { start_date: new Date().toISOString().split('T')[0] } });
        return response.data;
    } catch (error) {
        console.error("StaffApi: Gagal mengambil statistik harian:", error);
        throw error;
    }
};
