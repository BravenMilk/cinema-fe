import axiosClient from "../../axiosClient";

export const getAllRoles = async () => {
    try {
        const response = await axiosClient.get('/roles');
        return response.data;
    } catch (error) {
        console.error("RoleApi: Gagal mengambil data roles:", error);
        throw error;
    }
};
