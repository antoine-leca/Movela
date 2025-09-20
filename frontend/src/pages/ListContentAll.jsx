import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CustomDivider from '../components/CustomDivider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import getAPI from '../getAPI';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ListContentAll = () => {
    const navigate = useNavigate();
    useScrollToTop();
    const { type } = useParams(); // 'movies' ou 'tv'
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Configuration pour les images TMDB
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    
    // États
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 24,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Récupérer la page actuelle depuis l'URL
    const currentPage = parseInt(searchParams.get('page')) || 1;

    // Fonction pour obtenir le titre d'un item (film ou série)
    const getItemTitle = (item) => {
        return item.title || item.name || 'Titre non disponible';
    };

    // Fonction pour fetch les films
    const fetchMovies = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getAPI.getAllMovies(page, 24);
            
            setContent(response.data.movies);
            setPagination({
                currentPage: response.data.pagination.currentPage,
                totalPages: response.data.pagination.totalPages,
                totalItems: response.data.pagination.totalMovies,
                itemsPerPage: response.data.pagination.moviesPerPage,
                hasNextPage: response.data.pagination.hasNextPage,
                hasPrevPage: response.data.pagination.hasPrevPage
            });
        } catch (err) {
            setError('Erreur lors du chargement des films');
            console.error('Erreur fetch movies:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour fetch les séries
    const fetchSeries = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getAPI.getAllSeries(page, 24);
            
            setContent(response.data.series);
            setPagination({
                currentPage: response.data.pagination.currentPage,
                totalPages: response.data.pagination.totalPages,
                totalItems: response.data.pagination.totalSeries,
                itemsPerPage: response.data.pagination.seriesPerPage,
                hasNextPage: response.data.pagination.hasNextPage,
                hasPrevPage: response.data.pagination.hasPrevPage
            });
        } catch (err) {
            setError('Erreur lors du chargement des séries');
            console.error('Erreur fetch series:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour changer de page
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setSearchParams({ page: newPage.toString() });
        }
    };

    // Effect pour fetch le contenu selon le type et la page
    useEffect(() => {
        if (type === 'movies' || type === 'movie') {
            fetchMovies(currentPage);
        } else if (type === 'series' || type === 'tv') {
            fetchSeries(currentPage);
        } else {
            setError('Type de contenu invalide');
        }
    }, [type, currentPage]);

    // Effect pour mettre à jour l'URL si pas de page spécifiée
    useEffect(() => {
        if (!searchParams.get('page')) {
            setSearchParams({ page: '1' });
        }
    }, [searchParams, setSearchParams]);

    // Fonction pour obtenir le titre de la page
    const getPageTitle = () => {
        return (type === 'movies') ? 'Films' : 'Séries';
    };

    const generatePageNumbers = () => {
        const { currentPage, totalPages } = pagination;
        const delta = 2; // Nombre de pages à afficher de chaque côté de la page actuelle
        const pages = [];

        // Toujours afficher la première page
        if (totalPages > 0) {
            pages.push(1);
        }

        // Calculer la plage autour de la page actuelle
        const start = Math.max(2, currentPage - delta);
        const end = Math.min(totalPages - 1, currentPage + delta);

        // Ajouter "..." si nécessaire avant la plage
        if (start > 2) {
            pages.push('...');
        }

        // Ajouter les pages de la plage
        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i);
            }
        }

        // Ajouter "..." si nécessaire après la plage
        if (end < totalPages - 1) {
            pages.push('...');
        }

        // Toujours afficher la dernière page (si différente de la première)
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    // États de loading et d'erreur
    if (loading) {
        return (
            <div>
                <Header />
                <main className="min-h-[80vh] flex items-center justify-center">
                    <span className="loading loading-ring loading-xl text-warning"></span>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header />
                <main className="min-h-[80vh] flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-500 mb-2">Erreur</h2>
                        <p>{error}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Ici commencera le JSX de retour avec l'affichage du contenu et de la pagination
    return (
        <div>
            <Header />
            <main className='min-h-[80vh]'>
                <CustomDivider title={getPageTitle()} align="start">{getPageTitle()}</CustomDivider>
                
                {/* Informations de pagination EN HAUT */}
                <div className="text-center text-sm opacity-70 mb-4 mt-4">
                    Page {pagination.currentPage} sur {pagination.totalPages} 
                    ({pagination.totalItems} {(type === 'movies') ? 'films' : 'séries'} au total)
                </div>

                <section>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 p-4 justify-items-center'>
                        {content.map(item => (
                            <div
                                key={item.id}
                                className="card w-[167px] h-[250px] md:w-[250px] md:h-[375px] relative shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                onClick={() => navigate(`/details/${type === 'movies' ? 'movie' : 'tv'}/${item.id}`)}
                                tabIndex={0}
                                role="button"
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        navigate(`/details/${type === 'movies' ? 'movie' : 'tv'}/${item.id}`);
                                    }
                                }}
                            >
                                <div className="card-body h-full flex z-10 flex-col justify-end p-4">
                                    <h2 className="text-center text-lg font-bold text-white drop-shadow-lg line-clamp-2">
                                        {getItemTitle(item)}
                                    </h2>
                                    <div className="card-actions justify-center mt-2">
                                        {item.vote_average && item.vote_average > 0 && (
                                            <div className="bg-main text-white px-2 py-1 rounded-lg text-sm flex">
                                                ⭐ {item.vote_average.toFixed(1)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <img 
                                    className="absolute inset-0 z-0 w-full h-full object-cover rounded-lg"
                                    src={item.poster_path ? `${imageBaseUrl}${item.poster_path}` : '/placeholder.jpg'}
                                    alt={getItemTitle(item)}
                                    onError={(e) => {
                                        e.target.src = '/placeholder.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Pagination dynamique */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-8 mb-4">
                            <div className="join">
                                {/* Bouton Précédent */}
                                <button 
                                    className="join-item btn bg-(--cta-color) border-none shadow-none text-white hover:bg-(--cta-hover) hover:text-black"
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrevPage}
                                >
                                    ❮
                                </button>

                                {/* Numéros de pages */}
                                {generatePageNumbers().map((pageNum, index) => {
                                    if (pageNum === '...') {
                                        return (
                                            <button 
                                                key={`ellipsis-${index}`}
                                                className="join-item btn bg-(--cta-color) border-none shadow-none hover:cursor-default text-white opacity-90"
                                            >
                                                ...
                                            </button>
                                        );
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            className={`join-item btn bg-(--cta-color) border-none shadow-none ${
                                                pagination.currentPage === pageNum 
                                                    ? 'bg-(--cta-hover) title-font-b text-black' 
                                                    : 'text-white hover:bg-(--cta-hover) hover:text-black'
                                            }`}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {/* Bouton Suivant */}
                                <button 
                                    className="join-item btn bg-(--cta-color) border-none shadow-none text-white hover:bg-(--cta-hover) hover:text-black"
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                >
                                    ❯
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Informations de pagination EN BAS */}
                    <div className="text-center text-sm opacity-70 mb-8">
                        Affichage de {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} à{' '}
                        {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} sur{' '}
                        {pagination.totalItems} {(type === 'movies') ? 'films' : 'séries'}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ListContentAll;