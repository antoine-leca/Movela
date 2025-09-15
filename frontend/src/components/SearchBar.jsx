import { useEffect, useRef, useState } from 'react';
import getAPI from '../getAPI'; // Import du service API

const SearchBar = ({ className = "" }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    // Fonction pour rechercher des films/séries - REMPLACÉE
    const searchMovies = async (query) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        console.log('🔍 Recherche frontend:', query);
        setIsLoading(true);
        try {
            const response = await getAPI.searchMultiMedia(query);
            console.log('📝 Données reçues:', response.data);
            
            setSuggestions(response.data.results || []);
        } catch (error) {
            console.error('❌ Erreur lors de la recherche:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce pour éviter trop de requêtes
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            searchMovies(searchTerm);
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchTerm]);

    // Gérer les clics en dehors pour fermer les suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (item) => {
        setSearchTerm(item.title || item.name);
        setShowSuggestions(false);
        // Navigation vers la page de détails selon le type
        const mediaType = item.media_type === 'movie' ? 'movie' : 'series';
        window.location.href = `/details/${mediaType}/${item.id}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setShowSuggestions(false);
            // Redirection vers une page de résultats de recherche
            window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
        }
    };

    return (
        <div className={`relative w-2/10 ${className}`} ref={searchRef}>
            <form onSubmit={handleSubmit} className="w-full">
                <label className="input input-neutral bg-(--primary-color) text-black flex items-center w-full">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input 
                        type="search" 
                        required 
                        placeholder="Rechercher films/séries..." 
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full"
                    />
                    {isLoading && (
                        <span className="loading loading-spinner loading-xs"></span>
                    )}
                </label>
            </form>

            {/* Menu des suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-(--primary-color) border border-base-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {suggestions.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="flex items-center p-3 hover:bg-base-200 cursor-pointer border-b border-base-300 last:border-b-0"
                            onClick={() => handleSuggestionClick(item)}
                        >
                            {/* Image du film/série */}
                            {item.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                    alt={item.title || item.name}
                                    className="w-12 h-18 object-cover rounded mr-3"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-12 h-18 bg-base-300 rounded mr-3 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-base-content/50" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            
                            <div className="flex-1">
                                <div className="font-semibold text-black text-sm">
                                    {item.title || item.name}
                                </div>
                                {(item.release_date || item.first_air_date) && (
                                    <div className="text-xs text-base-content/70">
                                        {new Date(item.release_date || item.first_air_date).getFullYear()}
                                    </div>
                                )}
                                {item.media_type && (
                                    <div className="text-xs text-base-content/50 capitalize">
                                        {item.media_type === 'movie' ? 'Film' : 'Série'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Message quand aucun résultat */}
            {showSuggestions && searchTerm.length >= 2 && suggestions.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-(--primary-color) rounded-lg shadow-lg z-50 p-4 text-center text-base-content/70">
                    Aucun résultat trouvé
                </div>
            )}
        </div>
    );
};

export default SearchBar;