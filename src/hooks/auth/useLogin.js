import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const useLogin = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await login(email, password);
            if (!res.success) {
                setError(res.message);
            }
        } catch (err) {
            console.error("useLogin: Submission exception", err);
            setError("Terjadi kesalahan saat login");
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleSubmit
    };
};
