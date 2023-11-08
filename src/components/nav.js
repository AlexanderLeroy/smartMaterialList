import React from 'react';
import { Link } from "react-router-dom";

export function CreateHeader({ }) {
    return (
        <div className="header-container">
            <div className="header-indent">
                <div className="header-logo-container">
                </div>
            </div>
            <div className="header-menu">
                <Link to="/" className="header-link">Таблица</Link>
                <Link to="/crafts" className="header-link">Крафты</Link>
            </div>
            <div className="header-indent"></div>
        </div>
    );
}