import React from 'react';
import { Link } from "react-router-dom";

export function CreateFooter() {
    return (
        <div className="footer-container">
            <div className="header-indent"></div>
            <div className="header-menu">
                <Link to="/guide" className="header-link">Как использовать</Link>
            </div>
            <div className="header-indent"></div>
        </div>
    );
}