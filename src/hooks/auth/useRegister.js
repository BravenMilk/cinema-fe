import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const useRegister = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", passwordConfirmation: ""});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.passwordConfirmation) {
            console.warn("useRegister: Password mismatch");
            setError("Passwords do not match");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const res = await register(formData);
            if (!res.success) {
                setError(res.message);
            }
        } catch (err) {
            console.error("useRegister: Submission exception", err);
            setError("Terjadi kesalahan saat pendaftaran");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        handleChange,
        error,
        loading,
        handleSubmit
    };
};
