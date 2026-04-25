import axiosClient from "../axiosClient";

export const loginApi = async (email, password) => {
    try {
        const response = await axiosClient.post('/login', { email, password });
        return response;
    } catch (error) {
        console.error("AuthApi: Login error", error.response?.data || error.message);
        throw error;
    }
};

export const registerApi = async (data) => {
    try {
        const response = await axiosClient.post('/register', {
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.passwordConfirmation,
            phone: data.phone
        });
        return response;
    } catch (error) {
        console.error("AuthApi: Register error", error.response?.data || error.message);
        throw error;
    }
};

export const logoutApi = async () => {
    try {
        const response = await axiosClient.post('/logout');
        return response;
    } catch (error) {
        console.error("AuthApi: Logout error", error.response?.data || error.message);
        throw error;
    }
};

export const updateProfileApi = async (data) => {
    try {
        const response = await axiosClient.put('/profile', data);
        return response;
    } catch (error) {
        console.error("AuthApi: Update profile error", error.response?.data || error.message);
        throw error;
    }
};
