import { useState } from "react";
import { updateProfileApi } from "../../api/auth/AuthApi";
import { useAuth } from "../../context/AuthContext";

export const useProfile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const updateProfile = async (formData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await updateProfileApi(formData);
            if (response.data.success) {
                updateUser(response.data.data);
                setSuccess(true);
                return { success: true };
            }
        } catch (err) {
            const message = err.response?.data?.message || "Gagal memperbarui profil";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    return {
        updateProfile,
        loading,
        error,
        success,
        setSuccess,
        setError
    };
};
