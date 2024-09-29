import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <h1>Bienvenido a la página principal</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default HomePage;
