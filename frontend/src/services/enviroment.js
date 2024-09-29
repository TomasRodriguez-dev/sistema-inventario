const API_BASE_URL = 'http://localhost:3000/api';

const environment = {
    API_BASE_URL: API_BASE_URL,
    // Endpoints
    auth:{
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
    }
};

export default environment;
