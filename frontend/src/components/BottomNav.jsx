import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PawPrint, Calendar, User } from 'lucide-react';
import './BottomNav.css'; // Optional: if you want isolated styles

const BottomNav = () => {
    return (
        <div className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={24} />
                <span>Início</span>
            </NavLink>
            <NavLink to="/pets" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <PawPrint size={24} />
                <span>Pets</span>
            </NavLink>
            <NavLink to="/schedule" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Calendar size={24} />
                <span>Agenda</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <User size={24} />
                <span>Perfil</span>
            </NavLink>
        </div>
    );
};

export default BottomNav;
