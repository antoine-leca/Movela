import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
    const location = useLocation();
    
    useEffect(() => {
        // Ne pas scroll si on a un hash dans l'URL (pour les ancres)
        if (!location.hash) {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]); // Se déclenche à chaque changement de route
};