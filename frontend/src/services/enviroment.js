const API_BASE_URL = 'http://localhost:3000/api';

const environment = {
    API_BASE_URL: API_BASE_URL,
    // Endpoints
    auth:{
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
    },
    usuarios: {
        listar_usuarios: `${API_BASE_URL}/pev_usuarios`,
        editar_usuario: `${API_BASE_URL}/pev_usuario`,
        eliminar_usuario: `${API_BASE_URL}/pev_usuario`,
    }
};

export default environment;
