import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/auth/AuthPage';
import HomePage from '../pages/home/HomePage';
import PrivateRoute from './PrivateRoutes';
import PublicRoute from './PublicRoute';
import Layout from '../components/layout/LayoutComponent';
import UsuarioPage from '../pages/usuarios/UsuarioPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute>
                    <AuthPage />
                </PublicRoute>
            } />
            <Route path="/registro" element={
                <PublicRoute>
                    <AuthPage />
                </PublicRoute>
            } />
            <Route path="/inicio" element={
                <PrivateRoute>
                    <Layout>
                        <HomePage />
                    </Layout>
                </PrivateRoute>
            } />
            <Route path="/usuarios" element={
                <PrivateRoute>
                    <Layout>
                        <UsuarioPage />
                    </Layout>
                </PrivateRoute>
            } />
            {/* Agrega aquí más rutas privadas envueltas en el componente Layout */}
            <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
    );
};

export default AppRoutes;
