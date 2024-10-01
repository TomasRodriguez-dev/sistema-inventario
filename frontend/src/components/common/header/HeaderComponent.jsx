import React from 'react';
import { Button } from 'primereact/button';
import PageTitle from '../title/PageTitle';
import './HeaderComponent.css';

const Header = ({ onMenuToggle }) => {
    return (
        <header className="layout-header">
            <div className="header-content">
                <div className="header-left">
                    <Button icon="pi pi-bars" className="p-button-text menu-toggle" onClick={onMenuToggle} />
                    <PageTitle />
                </div>
                <div className="header-actions">
                    <Button icon="pi pi-refresh" className="p-button-text" />
                    <Button icon="pi pi-search" className="p-button-text" />
                    <Button icon="pi pi-bookmark" className="p-button-text" />
                    <Button icon="pi pi-envelope" className="p-button-text" />
                    <Button icon="pi pi-bell" className="p-button-text" />
                    <Button icon="pi pi-user" className="p-button-text user-profile" />
                </div>
            </div>
        </header>
    );
};

export default Header;
