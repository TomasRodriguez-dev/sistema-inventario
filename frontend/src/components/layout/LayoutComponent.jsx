import React, { useState } from 'react';
import AppMenu from '../common/menu/AppMenu';
import Header from '../common/header/HeaderComponent';
import './LayoutComponent.css';

const Layout = ({ children }) => {
    const [menuVisible, setMenuVisible] = useState(true);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <div className="layout-wrapper">
            <div className={`layout-sidebar ${menuVisible ? 'visible' : 'hidden'}`}>
                <AppMenu menuVisible={menuVisible} />
            </div>
            <div className={`layout-main-container ${menuVisible ? '' : 'sidebar-hidden'}`}>
                <Header onMenuToggle={toggleMenu} />
                <div className="layout-main">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;