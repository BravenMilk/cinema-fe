import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const useRegister = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", passwordConfirmation: ""});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.passwordConfirmation) {
            setError("Password tidak cocok");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const res = await register(formData);
            if (res.success) {
                navigate('/login', { state: { registered: true } });
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError("Terjadi kesalahan saat pendaftaran");
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, error, loading, handleSubmit };
};
