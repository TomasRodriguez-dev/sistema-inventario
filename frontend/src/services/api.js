import axios from 'axios';
import environment from './enviroment';

const api = axios.create({
    baseURL: environment.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (credentials) => {
    try {
        const response = await api.post(environment.auth.login, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post(environment.auth.register, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export default api;
