import { useNavigate } from 'react-router-dom';

const CustomDivider = ({
    children,
    className = '',
    color = 'primary',
    align = '', // 'start', 'end', ou '' (milieu)
    linkto,
    onClick
}) => {
    const navigate = useNavigate();
    const colorMap = {
        primary: 'var(--primary-color)',
        cta: 'var(--cta-color)',
        new: 'var(--new-films)'
    };

    // Détermine la classe d'alignement
    let alignClass = '';
    if (align === 'start') alignClass = 'divider-start';
    else if (align === 'end') alignClass = 'divider-end';
    // sinon centré (par défaut)

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
            className={`divider ${alignClass} pl-2 text-2xl title-font-sm capitalize ${className}`}
            style={{ '--divider-color': colorMap[color] || color, color: colorMap[color] || color }}
            onClick={handleClick}
        >
            {children}
        </div>
    );
};

export default CustomDivider;