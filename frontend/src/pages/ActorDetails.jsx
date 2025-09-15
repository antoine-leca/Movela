import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CarouselCards from '../components/CarouselCards';
import CustomDivider from '../components/CustomDivider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ActorDetails = () => {
    useScrollToTop();
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [actor, setActor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:3000/api';
    const API_IMG_URL = 'https://image.tmdb.org/t/p/original';

    const fetchActorDetails = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const endpoint = `${API_BASE_URL}/person/${id}`;
            const response = await fetch(endpoint);
            
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('👤 Données acteur reçues:', data);
            setActor(data);
        } catch (err) {
            console.error('❌ Erreur lors du fetch:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id, API_BASE_URL]);

    useEffect(() => {
        fetchActorDetails();
    }, [fetchActorDetails]);

    if (loading) {
        return (
            <div>
                <Header />
                <main className="min-h-[80vh] p-4 flex items-center justify-center">
                    <div className="text-center">
                        <div className="loading loading-spinner loading-lg"></div>
                        <p className="mt-4 text-gray-300">Chargement des détails de l'acteur...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header />
                <main className="min-h-[80vh] p-4 flex items-center justify-center">
                    <div className="text-center">
                        <div className="alert alert-error">
                            <span>Erreur: {error}</span>
                        </div>
                        <button 
                            onClick={() => navigate(-1)}
                            className="btn btn-warning mt-4"
                        >
                            Retour
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!actor) {
        return (
            <div>
                <Header />
                <main className="min-h-[80vh] p-4 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-300">Aucun acteur trouvé.</p>
                        <button 
                            onClick={() => navigate(-1)}
                            className="btn btn-warning mt-4"
                        >
                            Retour
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const actorData = actor.details || actor;
    const credits = actor.credits || {};
    
    const name = actorData.name || 'Nom non disponible';
    const biography = actorData.biography || "Aucune biographie disponible.";
    const profilePath = actorData.profile_path;
    const birthday = actorData.birthday;
    const deathday = actorData.deathday;
    const placeOfBirth = actorData.place_of_birth;
    const knownFor = actorData.known_for_department;
    
    // Filmographie
    const movieCredits = credits.cast?.filter(item => item.media_type === 'movie' || !item.media_type) || [];
    const tvCredits = credits.cast?.filter(item => item.media_type === 'tv') || [];
    
    // Trier par popularité ou date
    const sortedMovies = movieCredits.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 10);
    const sortedTvShows = tvCredits.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 10);

    return (
        <div>
            <Header />
            <main className="min-h-[80vh] p-4">
                <div className="container mx-auto">
                    {/* Section principale avec image et détails */}
                    <section className="mb-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Photo de l'acteur */}
                            <div className="lg:w-1/3">
                                <figure className="w-full">
                                    {profilePath ? (
                                        <img 
                                            src={`${API_IMG_URL}${profilePath}`}
                                            alt={`Photo de ${name}`}
                                            className="w-full h-auto rounded-lg shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-96 bg-gray-700 rounded-lg shadow-lg flex items-center justify-center">
                                            <p className="text-gray-400">Aucune photo disponible</p>
                                        </div>
                                    )}
                                </figure>
                            </div>
                            
                            {/* Détails de l'acteur */}
                            <div className="lg:w-2/3">
                                <div className="mb-6">
                                    <CustomDivider color="primary" className='text-4xl mb-8'>{name}</CustomDivider>
                                    
                                    {/* Informations personnelles */}
                                    <div className="mb-6 space-y-3">
                                        {knownFor && (
                                            <div>
                                                <span className="text-gray-400">Connu pour : </span>
                                                <span className="text-white">{knownFor}</span>
                                            </div>
                                        )}
                                        
                                        {birthday && (
                                            <div>
                                                <span className="text-gray-400">Date de naissance : </span>
                                                <span className="text-white">
                                                    {new Date(birthday).toLocaleDateString('fr-FR')}
                                                </span>
                                                {!deathday && birthday && (
                                                    <span className="text-gray-400 ml-2">
                                                        ({Math.floor((new Date() - new Date(birthday)) / (365.25 * 24 * 60 * 60 * 1000))} ans)
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        {deathday && (
                                            <div>
                                                <span className="text-gray-400">Date de décès : </span>
                                                <span className="text-white">
                                                    {new Date(deathday).toLocaleDateString('fr-FR')}
                                                </span>
                                                {birthday && deathday && (
                                                    <span className="text-gray-400 ml-2">
                                                        ({Math.floor((new Date(deathday) - new Date(birthday)) / (365.25 * 24 * 60 * 60 * 1000))} ans)
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        {placeOfBirth && (
                                            <div>
                                                <span className="text-gray-400">Lieu de naissance : </span>
                                                <span className="text-white">{placeOfBirth}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Biographie */}
                                    <div className="mb-6">
                                        <CustomDivider color="primary">Biographie</CustomDivider>
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">{biography}</p>
                                    </div>
                                </div>
                                
                                {/* Bouton retour */}
                                <button 
                                    onClick={() => navigate(-1)}
                                    className="btn btn-warning"
                                >
                                    Retour
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Section films */}
                    {sortedMovies.length > 0 && (
                        <section className="mb-8">
                            <CustomDivider color="primary">Films</CustomDivider>
                            <CarouselCards 
                                items={sortedMovies}
                                type="movie"
                                showAllLink={false}
                            />
                        </section>
                    )}

                    {/* Section séries */}
                    {sortedTvShows.length > 0 && (
                        <section className="mb-8">
                            <CustomDivider color="primary">Séries TV</CustomDivider>
                            <CarouselCards 
                                items={sortedTvShows}
                                type="tv"
                                showAllLink={false}
                            />
                        </section>
                    )}

                    {/* Section filmographie complète */}
                    {(movieCredits.length > 10 || tvCredits.length > 10) && (
                        <section className="mb-8">
                            <CustomDivider color="primary">Filmographie complète</CustomDivider>
                            <div className="bg-gray-800 rounded-lg p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Films Timeline */}
                                    {movieCredits.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className="h-5 w-5 text-primary mr-2"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zm0 4.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Films ({movieCredits.length})
                                            </h3>
                                            <div className="max-h-96 overflow-y-auto pr-2">
                                                <ul className="timeline timeline-vertical">
                                                    {movieCredits
                                                        .sort((a, b) => {
                                                            const dateA = new Date(a.release_date || '1900-01-01');
                                                            const dateB = new Date(b.release_date || '1900-01-01');
                                                            return dateB - dateA;
                                                        })
                                                        .map((movie, index) => (
                                                        <li key={`movie-${movie.id}`}>
                                                            <div className="timeline-start">
                                                                {movie.release_date && (
                                                                    <span className="text-sm font-semibold text-primary">
                                                                        {new Date(movie.release_date).getFullYear()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="timeline-middle">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                    className="h-4 w-4 text-primary"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">
                                                                <div className="font-bold text-black">{movie.title}</div>
                                                                {movie.character && (
                                                                    <div className="text-sm text-gray-400">en tant que {movie.character}</div>
                                                                )}
                                                            </div>
                                                            {index < movieCredits.length - 1 && <hr />}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* TV Shows Timeline */}
                                    {tvCredits.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className="h-5 w-5 text-secondary mr-2"
                                                >
                                                    <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.801a2 2 0 01-1.99-1.79L2 7.5zm5.22 1.72a.75.75 0 011.06 0L10 10.94l1.72-1.72a.75.75 0 111.06 1.06L11.06 12l1.72 1.72a.75.75 0 11-1.06 1.06L10 13.06l-1.72 1.72a.75.75 0 01-1.06-1.06L8.94 12l-1.72-1.72a.75.75 0 010-1.06z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Séries TV ({tvCredits.length})
                                            </h3>
                                            <div className="max-h-96 overflow-y-auto pr-2">
                                                <ul className="timeline timeline-vertical">
                                                    {tvCredits
                                                        .sort((a, b) => {
                                                            const dateA = new Date(a.first_air_date || '1900-01-01');
                                                            const dateB = new Date(b.first_air_date || '1900-01-01');
                                                            return dateB - dateA;
                                                        })
                                                        .map((show, index) => (
                                                        <li key={`tv-${show.id}`}>
                                                            <div className="timeline-start">
                                                                {show.first_air_date && (
                                                                    <span className="text-sm font-semibold text-secondary">
                                                                        {new Date(show.first_air_date).getFullYear()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="timeline-middle">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                    className="h-4 w-4 text-secondary"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="timeline-end timeline-box">
                                                                <div className="font-bold text-black">{show.name}</div>
                                                                {show.character && (
                                                                    <div className="text-sm text-gray-400">en tant que {show.character}</div>
                                                                )}
                                                            </div>
                                                            {index < tvCredits.length - 1 && <hr />}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ActorDetails;