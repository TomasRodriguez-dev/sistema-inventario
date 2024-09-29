import React from 'react';
import { useAlert } from '../../../context/AlertContext';
import { Message } from 'primereact/message';
import './AlertComponent.css';

const AlertComponent = () => {
    const { alert } = useAlert();

    if (!alert) return null;

    return (
        <div className="alert-container">
            <Message 
                severity={alert.severity} 
                text={alert.message}
                style={{ display: 'block' }}
                className="w-full justify-content-center"
            />
        </div>
    );
};

export default AlertComponent;
