import React from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = () => {
    const location = useLocation();
    
    const getPageTitle = () => {
        switch(location.pathname) {
            case '/inicio':
                return 'Inicio';
            case '/usuarios':
                return 'Usuarios';
            // Agrega más casos según tus rutas
            default:
                return 'Página no encontrada';
        }
    };

    return (
        <h1 className="page-title">
            {getPageTitle()}
        </h1>
    );
};

export default PageTitle;
