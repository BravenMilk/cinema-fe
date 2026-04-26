import { createContext, useContext, useState } from "react";
import { loginApi, registerApi, logoutApi } from "../api/auth/AuthApi";

const AuthContext = createContext({
    user: null,
    token: null,
    login: async (email, password) => { },
    logout: () => { },
    register: async (data) => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('USER')));
    const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const login = async (email, password) => {
        console.log("AuthContext: Starting login for", email);
        try {
            const response = await loginApi(email, password);
            if (response.data.success) {
                const { user, token } = response.data.data;
                console.log("AuthContext: Login success, updating state", { user, token });
                setUser(user);
                setToken(token);
                localStorage.setItem('ACCESS_TOKEN', token);
                localStorage.setItem('USER', JSON.stringify(user));
                return { success: true };
            }
            console.warn("AuthContext: Login failed with response", response.data);
        } catch (error) {
            console.error("AuthContext: Login exception", error);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    };

    const register = async (formData) => {
        try {
            const response = await registerApi(formData);
            if (response.data.success) {
                return { success: true };
            }
            return { success: false, message: response.data?.message || "Registration failed" };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed"
            };
        }
    };

    const logout = async () => {
        console.log("AuthContext: Starting logout");
        try {
            await logoutApi();
        } catch (error) {
            console.error("AuthContext: Logout exception", error);
        } finally {
            console.log("AuthContext: Clearing state and storage");
            setUser(null);
            setToken(null);
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('USER');
            window.location.href = '/';
        }
    };

    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        localStorage.setItem('USER', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
