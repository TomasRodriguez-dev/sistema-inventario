import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token') !== null; // Verifica si hay un token
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirige a la página de login si no está autenticado
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
