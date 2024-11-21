const API_BASE_URL = 'http://localhost:3000/api';

const environment = {
    API_BASE_URL: API_BASE_URL,
    // Endpoints
    auth:{
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
    },
    usuarios: {
        listar_usuarios: `${API_BASE_URL}/inv_usuario`,
        crear_usuario: `${API_BASE_URL}/inv_usuario`,
        editar_usuario: `${API_BASE_URL}/inv_usuario`,
        eliminar_usuario: `${API_BASE_URL}/inv_usuario`,
    },
    productos: {
        listar_productos: `${API_BASE_URL}/inv_producto`,
        crear_producto: `${API_BASE_URL}/inv_producto`,
        editar_producto: `${API_BASE_URL}/inv_producto`,
        eliminar_producto: `${API_BASE_URL}/inv_producto`,
    }
};

export default environment;
