import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <h1>Bienvenido a la página principal</h1>
            <Button 
                label="Cerrar sesión" 
                icon="pi pi-sign-out" 
                onClick={handleLogout} 
                className="p-button-raised p-button-rounded"
            />
        </div>
    );
};

export default HomePage;
