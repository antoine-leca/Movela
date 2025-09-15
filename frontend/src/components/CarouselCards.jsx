import React from 'react';
import { useNavigate } from 'react-router-dom';

const CarouselCards = ({ 
    items = [], 
    imageBaseUrl = "https://image.tmdb.org/t/p/w500/",
    // "movie" ou "tv"
    type = "movie",
    showAllLink = true,
}) => {
    const navigate = useNavigate();

    if (!items || items.length == 0) {
        return (
            <section className="p-4">
                <p className="text-center text-gray-500">
                    Aucun{type == 'movie' ? '' : 'e'} {type == 'movie' ? 'film' : 'série'} disponible
                </p>
            </section>
        );
    }

    // Fonction pour gérer le clic sur un item pui redirection vers la page détails dédiée
    const handleItemClick = (item) => {
        if (type == 'tv') {
            navigate(`/details/tv/${item.id}`);
        } else if (type == 'movie') {
            navigate(`/details/movie/${item.id}`);
        } else {
            console.error('Type inconnu:', type);
        }
    };

    // films ont 'title', séries ont 'name'
    const getItemTitle = (item) => {
        return item.title || item.name;
    };

    // films ont 'release_date', séries ont 'first_air_date'. Pas encore sûr de l'utilisation pour les cards
    const getItemDate = (item) => {
        return item.release_date || item.first_air_date; 
    };

    return (
        <section className="px-4">
            <div className="carousel carousel-center max-w-full p-4 space-x-4 rounded-box">
                {/* boucle la création de cards selon le nombre d'items fetch */}
                {items.map((item, index) => (
                    <div 
                        key={item.id || index} 
                        className="carousel-item bg-center rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleItemClick(item)}
                    >
                        <div className="card w-[250px] h-[375px] relative shadow-sm">
                            <div className="card-body h-full flex z-10 flex-col justify-end">
                                <h2 className="text-center text-xl font-bold text-white drop-shadow-lg">
                                    {getItemTitle(item)}
                                </h2>
                                <div className="card-actions justify-center">
                                    {item.vote_average && (
                                        <div className="bg-main text-white px-2 py-1 rounded-lg text-sm flex">
                                            ⭐ {item.vote_average.toFixed(1)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <img 
                                className="absolute inset-0 z-0 w-full h-full object-cover rounded-lg"
                                src={`${imageBaseUrl}${item.poster_path}`}
                                alt={getItemTitle(item) || `${type == 'movie' ? 'Movie' : 'TV Show'} Poster`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg"></div>
                        </div>
                    </div>
                ))}
                {/* Bouton qui redirige vers la page list dédiée */}
                {showAllLink && (
                    <div className='flex justify-center items-center'>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                const listPath = type == 'movie' ? '/movies/list' : '/tv/list';
                                navigate(listPath);
                            }}
                            className="text-(--primary-color) hover:cursor-pointer"
                        >
                        voir tout ❯
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CarouselCards;