import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { login } from '../../../services/api';
import { useAlert } from '../../../context/AlertContext';
import { setLoading } from '../../../redux/loadingSlice';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess, onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [contrasena, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const { showAlert } = useAlert();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const response = await login({ email, contrasena });
            // Simulamos un retraso de 2 segundos
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (response.success) {
                localStorage.setItem('token', response.token);
                onLoginSuccess(response);
                showAlert('success', 'Inicio de sesión exitoso', 3000);
            } else {
                // Manejamos el caso de error desde el backend
                handleLoginError(response.error || 'Ocurrió un error durante el inicio de sesión');
            }
        } catch (error) {
            // Verificamos si el error tiene la estructura esperada
            if (error.error && typeof error.success !== 'undefined') {
                handleLoginError(error.error);
            } else {
                handleLoginError('Error de conexión');
            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLoginError = (errorMessage) => {
        showAlert('error', errorMessage, 5000);
        setIsError(true);
        setEmail('');
        setPassword('');
        setTimeout(() => setIsError(false), 3000);
    };

    return (
        <div className='flex flex-column justify-content-center align-items-center h-screen p-8 w-full'>
            <div className='flex flex-column justify-content-start align-items-start w-full sm:mb-8'>
                <h1 className='text-3xl font-medium'>Bienvenido Nuevamente!</h1>
                <span className='text-base text-400 font-normal'>Ingrese sus datos para acceder a su cuenta</span>
            </div>
            <form onSubmit={handleSubmit} className='w-full'>
                <div className="flex flex-column gap-2">
                    <div className="flex flex-column gap-2 sm:mb-4">
                        <label htmlFor="email" className='text-base font-medium'>Correo Electrónico</label>
                        <InputText 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder='Ingrese su correo electrónico'
                            className={isError ? 'p-invalid' : ''}
                        />
                    </div>
                    <div className="flex flex-column gap-2 sm:mb-8">
                        <label htmlFor="password" className='text-base font-medium'>Contraseña</label>
                        <Password 
                            id="password" 
                            value={contrasena} 
                            onChange={(e) => setPassword(e.target.value)} 
                            toggleMask 
                            required 
                            placeholder='Ingrese su contraseña'
                            inputClassName={isError ? 'p-invalid' : ''}
                        />
                    </div>
                    <Button type="submit" label="Iniciar Sesión" className='sm:m-auto w-full sm:w-6 bg-black-alpha-90 border-round-lg sm:w-15rem' />
                </div>
            </form>
            <div className="mt-6 text-center">
                <span className="text-black font-medium">¿No tienes Cuenta? </span>
                <a href onClick={onRegisterClick} className="text-blue-500 cursor-pointer">
                    Crear Una
                </a>
            </div>
        </div>
    );
};

export default LoginForm;
