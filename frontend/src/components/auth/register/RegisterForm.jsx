import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { register } from '../../../services/api';
import { useAlert } from '../../../context/AlertContext';

const RegisterForm = ({ onRegisterSuccess, onLoginClick }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [isError, setIsError] = useState(false);
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ nombre, email, contrasena });
      
      if ( response.success) {
        onRegisterSuccess(response.success);
        showAlert('success', 'Registro exitoso. Por favor, inicie sesión.', 3000);
        // Cambiamos el setTimeout por una llamada directa a onLoginClick
        onLoginClick();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        handleRegisterError(error.response.data.error);
      } else if (error.error) {
        handleRegisterError(error.error);
      } else {
        handleRegisterError('Error desconocido');
      }
    }
  };

  const handleRegisterError = (errorMessage) => {
    showAlert('error', errorMessage, 5000);
    setIsError(true);
    setNombre('');
    setEmail('');
    setContrasena('');
    setTimeout(() => setIsError(false), 3000);
  };

  return (
    <div className='flex flex-column justify-content-center align-items-center h-screen p-8 w-full'>
      <div className='flex flex-column justify-content-start align-items-start w-full sm:mb-8'>
        <h1 className='text-3xl font-medium'>Empieza Ahora!</h1>
        <span className='text-base text-400 font-normal'>Ingrese sus datos para poder crear su cuenta</span>
      </div>
      <form onSubmit={handleSubmit} className='w-full'>
        <div className="flex flex-column gap-2">
          <div className="flex flex-column gap-2 sm:mb-4">
            <label htmlFor="nombre" className='text-base font-medium'>Nombre</label>
            <InputText 
              id="nombre" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required  
              placeholder='Ingrese su nombre'
              className={isError ? 'p-invalid' : ''}
            />
          </div>
          <div className="flex flex-column gap-2 sm:mb-4">
            <label htmlFor="email" className='text-base font-medium'>Correo Electrónico</label>
            <InputText 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} required 
              placeholder='Ingrese su correo electrónico'
              className={isError ? 'p-invalid' : ''}
            />
          </div>
          <div className="flex flex-column gap-2 sm:mb-8">
            <label htmlFor="password" className='text-base font-medium'>Contraseña</label>
            <Password 
              id="password" 
              value={contrasena} 
              onChange={(e) => setContrasena(e.target.value)} 
              toggleMask 
              required 
              placeholder='Ingrese su contraseña'
              inputClassName={isError ? 'p-invalid' : ''}
            />
          </div>
          <Button type="submit" label="Registrarse" className="sm:m-auto w-full sm:w-6 bg-black-alpha-90 border-round-lg sm:w-15rem" />
        </div>
      </form>
      <div className="mt-6 text-center">
          <span className="text-black font-medium">¿Ya tienes Cuenta? </span>
          <a href onClick={onLoginClick} className="text-blue-500 cursor-pointer">
            Iniciar Sesión
          </a>
      </div>
    </div>
  );
};

export default RegisterForm;
