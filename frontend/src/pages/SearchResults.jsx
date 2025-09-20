import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomDivider from '../components/CustomDivider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import getAPI from '../getAPI';

const imageBaseUrl = 'https://image.tmdb.org/t/p/w300';
const profileBaseUrl = 'https://image.tmdb.org/t/p/w185';

const FILTERS = [
    { key: 'movies', label: 'Films' },
    { key: 'series', label: 'Séries' },
    { key: 'persons', label: 'Acteur·rice·s' }
];

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('movies');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Met à jour le filtre et la page dans l'URL
    const updateFilter = (filterKey) => {
        setActiveFilter(filterKey);
        setPage(1);
        setSearchParams({ q: query, filter: filterKey, page: 1 });
    };

    // Met à jour la page dans l'URL
    const updatePage = (newPage) => {
        setPage(newPage);
        setSearchParams({ q: query, filter: activeFilter, page: newPage });
    };

    // Synchronise le filtre et la page avec l'URL
    useEffect(() => {
        const urlFilter = searchParams.get('filter');
        const urlPage = parseInt(searchParams.get('page')) || 1;
        if (urlFilter && FILTERS.some(f => f.key === urlFilter)) {
            setActiveFilter(urlFilter);
        }
        setPage(urlPage);
    // eslint-disable-next-line
    }, [searchParams]);

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            setLoading(false);
            setTotalPages(1);
            return;
        }
        setLoading(true);
        setError(null);

        // call API selon le filtre selectionné
        let apiCall;
        if (activeFilter === 'movies') {
            apiCall = getAPI.searchMovies(query, page);
        } else if (activeFilter === 'series') {
            apiCall = getAPI.searchSeries(query, page);
        } else if (activeFilter === 'persons') {
            apiCall = getAPI.searchPersons(query, page);
        }

        apiCall
            .then(res => {
                setResults(res.data.results || []);
                setTotalPages(res.data.total_pages || 1);
            })
            .catch(() => setError("Erreur lors de la recherche."))
            .finally(() => setLoading(false));
    }, [query, activeFilter, page]);

    const handleClick = (item) => {
        if (activeFilter === 'persons') {
            navigate(`/person/${item.id}`);
        } else {
            const mediaType = activeFilter === 'movies' ? 'movie' : 'series';
            navigate(`/details/${mediaType}/${item.id}`);
        }
    };

    // Pagination
    const Pagination = () => (
        <div className="flex justify-center items-center gap-2 my-6">
            <button
                className={`btn cta-custom border-none shadow-none btn-sm${page <= 1 ? ' btn-disabled opacity-60 cursor-not-allowed' : ''}`}
                disabled={page <= 1}
                onClick={() => updatePage(page - 1)}
            >
                Précédent
            </button>
            <span className="px-2">
                Page {page} / {totalPages}
            </span>
            <button
                className={`btn cta-custom border-none shadow-none btn-sm${page >= totalPages ? ' btn-disabled opacity-60 cursor-not-allowed' : ''}`}
                disabled={page >= totalPages}
                onClick={() => updatePage(page + 1)}
            >
                Suivant
            </button>
        </div>
    );

    // Fonction utilitaire pour le titre
    const getItemTitle = (item) => item.title || item.name || item.original_title || item.original_name || '';

    return (
        <div>
            <Header />
            <main className="min-h-[80vh]">
                <section className="container mx-auto px-4 py-8">
                    <CustomDivider color="primary" align="">
                        Résultats pour &quot;{query}&quot;
                    </CustomDivider>

                    {/* Filtres */}
                    <div className="flex gap-2 mb-6">
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                className={`px-4 py-2 rounded-full border font-semibold transition hover:cursor-pointer ${
                                    activeFilter === f.key
                                        ? 'cta-custom border-none'
                                        : 'border-(--cta-color) text-(--cta-color) hover:bg-(--cta-color) hover:text-white'
                                }`}
                                onClick={() => updateFilter(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {error && <div className="text-red-500">{error}</div>}
                    {!loading && !error && results.length === 0 && (
                        <div>Aucun résultat trouvé.</div>
                    )}

                    {/* Films */}
                    {activeFilter === 'movies' && results.length > 0 && (
                        <>
                            <Pagination />
                            <div className="flex flex-wrap gap-6 justify-center mb-8">
                                {results.map((item, index) => (
                                    <div 
                                        key={item.id || index} 
                                        className="carousel-item bg-center rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => handleClick(item)}
                                    >
                                        <div className="card w-[250px] h-[375px] relative shadow-sm">
                                            <div className="card-body h-full flex z-10 flex-col justify-end">
                                                <h2 className="text-center text-xl font-bold text-white drop-shadow-lg">
                                                    {getItemTitle(item)}
                                                </h2>
                                                <div className="card-actions justify-center">
                                                    {item.vote_average > 0 && (
                                                        <div className="bg-main text-white px-2 py-1 rounded-lg text-sm flex">
                                                            ⭐ {item.vote_average.toFixed(1)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <img 
                                                className="absolute inset-0 z-0 w-full h-full object-cover rounded-lg"
                                                src={item.poster_path ? `${imageBaseUrl}${item.poster_path}` : '/no-image.svg'}
                                                alt={getItemTitle(item) || 'Movie Poster'}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination />
                        </>
                    )}

                    {/* Séries */}
                    {activeFilter === 'series' && results.length > 0 && (
                        <>
                            <Pagination />
                            <div className="flex flex-wrap gap-6 justify-center mb-8">
                                {results.map((item, index) => (
                                    <div 
                                        key={item.id || index} 
                                        className="carousel-item bg-center rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => handleClick(item)}
                                    >
                                        <div className="card w-[250px] h-[375px] relative shadow-sm">
                                            <div className="card-body h-full flex z-10 flex-col justify-end">
                                                <h2 className="text-center text-xl font-bold text-white drop-shadow-lg">
                                                    {getItemTitle(item)}
                                                </h2>
                                                <div className="card-actions justify-center">
                                                    {item.vote_average > 0 && (
                                                        <div className="bg-main text-white px-2 py-1 rounded-lg text-sm flex">
                                                            ⭐ {item.vote_average.toFixed(1)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <img 
                                                className="absolute inset-0 z-0 w-full h-full object-cover rounded-lg"
                                                src={item.poster_path ? `${imageBaseUrl}${item.poster_path}` : '/no-image.svg'}
                                                alt={getItemTitle(item) || 'TV Show Poster'}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination />
                        </>
                    )}

                    {/* Acteur·rice·s */}
                    {activeFilter === 'persons' && results.length > 0 && (
                        <>
                            <Pagination />
                            <div className="flex flex-wrap gap-6 justify-center mb-8">
                                {results.map((item, index) => (
                                    <div 
                                        key={item.id || index} 
                                        className="carousel-item bg-center rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => handleClick(item)}
                                    >
                                        <div className="card w-[250px] h-[375px] relative shadow-sm flex flex-col items-center">
                                            <div className="card-body h-full flex z-10 flex-col justify-end">
                                                <h2 className="text-center text-xl font-bold text-white drop-shadow-lg">
                                                    {item.name}
                                                </h2>
                                                <div className="card-actions justify-center">
                                                    {item.known_for_department && (
                                                        <div className="bg-main text-white px-2 py-1 rounded-lg text-sm flex">
                                                            {item.known_for_department}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {item.profile_path ? (
                                                <img 
                                                    className="absolute inset-0 z-0 w-full h-full object-cover rounded-lg"
                                                    src={`${profileBaseUrl}${item.profile_path}`}
                                                    alt={item.name}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 z-0 w-full h-full flex items-center justify-center bg-base-300 rounded-lg">
                                                    <svg className="w-16 h-16 text-base-content/50" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination />
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default SearchResults;