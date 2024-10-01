import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { Ripple } from 'primereact/ripple';
import { Badge } from 'primereact/badge';
import { ScrollPanel } from 'primereact/scrollpanel'; 
import './AppMenu.css';

const AppMenu = ({ menuVisible }) => {
    const [activeMenu, setActiveMenu] = useState('');

    const menu = [
        {
            label: 'Home',
            items: [{
                label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/inicio'
            }]
        },
        {
            label: 'Rutas',
            items: [
                { label: 'Usuarios', icon: 'pi pi-user', to: '/usuarios' },
            ]
        }
    ];

    const onMenuItemClick = (event, item, index) => {
        if (activeMenu === item) {
            setActiveMenu(null);
        } else {
            setActiveMenu(item);
        }

        if (item.items) {
            event.preventDefault();
        }
    };

    const renderLink = (item, i) => {
        const content = (
            <>
                <i className={item.icon}></i>
                <span>{item.label}</span>
                {item.items && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>}
                {item.badge && <Badge value={item.badge} />}
                <Ripple />
            </>
        );

        return (
            <NavLink 
                to={item.to} 
                className={({ isActive }) => classNames('p-ripple', { 'router-link-active': isActive })}
                onClick={(e) => onMenuItemClick(e, item, i)} 
                exact="true"
            >
                {content}
            </NavLink>
        );
    };

    const renderSubMenu = (item, index) => {
        return (
            <CSSTransition classNames="layout-submenu-wrapper" timeout={{ enter: 1000, exit: 450 }} in={activeMenu === item} unmountOnExit>
                <ul>
                    {item.items.map((child, i) => {
                        return (
                            <li key={child.label || i}>
                                {renderLink(child, i)}
                            </li>
                        );
                    })}
                </ul>
            </CSSTransition>
        );
    };

    return (
        <ScrollPanel 
            style={{ 
                width: '100%', 
                height: 'calc(100vh - 2rem)',
                transition: 'all 0.3s ease-in-out'
            }} 
            className={`custom-scrollbar ${menuVisible ? 'visible' : 'hidden'}`}
            options={{ scrollMode: 'native' }}
        >
            <div className="layout-menu-container">
                <ul className="layout-menu">
                    {menu.map((item, i) => {
                        return (
                            <React.Fragment key={item.label || i}>
                                <li className="menu-separator"></li>
                                <li className="layout-menuitem-category">
                                    {item.label}
                                </li>
                                {item.items.map((subItem, j) => (
                                    <li key={subItem.label || j} className={classNames({ 'active-menuitem': activeMenu === subItem })}>
                                        {renderLink(subItem, j)}
                                        {subItem.items && renderSubMenu(subItem, j)}
                                    </li>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </ul>
            </div>
        </ScrollPanel>
    );
};

export default AppMenu;