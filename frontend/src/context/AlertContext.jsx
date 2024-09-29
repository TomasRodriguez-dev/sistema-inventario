import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = (severity, message, duration = 3000) => {
        setAlert({ severity, message });
        setTimeout(() => {
            setAlert(null);
        }, duration);
    };

    const hideAlert = () => {
        setAlert(null);
    };

    return (
        <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
