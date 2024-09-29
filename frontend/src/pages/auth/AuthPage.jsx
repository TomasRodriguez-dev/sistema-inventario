import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/login/LoginForm';
import RegisterForm from '../../components/auth/register/RegisterForm';

const AuthPage = () => {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate('/'); 
    };

    const handleRegisterSuccess = () => {
        setIsLoginForm(true);
    };

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
    };

    return (
        <div className='flex flex-row h-screen w-full'>
            <div className='w-6 h-full relative hidden  md:flex flex-auto items-center justify-center w-1/2 h-full p-16 lg:px-28 overflow-hidden bg-gray-800 dark:border-l'>
                <svg class="absolute inset-0 pointer-events-none" viewBox="0 0 960 540" width="100%" height="100%"
                    preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                    <g class="text-gray-700 opacity-25" fill="none" stroke="currentColor" stroke-width="100">
                        <circle r="234" cx="196" cy="23"></circle>
                        <circle r="234" cx="790" cy="491"></circle>
                    </g>
                </svg>
                <svg class="absolute -top-16 -right-16 text-gray-700" viewBox="0 0 220 192" width="220" height="192"
                    fill="none">
                    <defs>
                        <pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20"
                            patternUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
                        </pattern>
                    </defs>
                    <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"></rect>
                </svg>
            </div>
            <div className='w-6 h-full flex items-center justify-center'>
                {isLoginForm ? (
                    <LoginForm onLoginSuccess={handleLoginSuccess} onRegisterClick={toggleForm} />
                ) : (
                    <RegisterForm onRegisterSuccess={handleRegisterSuccess} onLoginClick={toggleForm} />
                )}
            </div>
        </div>
    );
};

export default AuthPage;
