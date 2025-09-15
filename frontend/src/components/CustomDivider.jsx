import React from 'react';

import { useNavigate } from 'react-router-dom';

const CustomDivider = ({ children, className = '', color = 'primary', linkto, onClick }) => {
    const navigate = useNavigate();
    const colorMap = {
        primary: 'var(--primary-color)',
        cta: 'var(--cta-color)',
        new: 'var(--new-films)'
    };

    // Si on a besoin de rediriger vers une autre page, on peut utiliser navigate ici
    const handleClick = () => {
        if (linkto) {
            navigate(linkto);
        }
        if (onClick) {
            onClick();
        }
    };

    return (
        <div 
            className={`divider divider-start pl-2 text-2xl title-font-sm capitalize ${className}`}
            style={{ '--divider-color': colorMap[color] || color, color: colorMap[color] || color }}
            onClick={handleClick}
        >
            {children}
        </div>
    );
};

export default CustomDivider;