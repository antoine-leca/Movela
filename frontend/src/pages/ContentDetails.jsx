import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CarouselCards from '../components/CarouselCards';
import CustomDivider from '../components/CustomDivider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import getAPI from '../getAPI';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ContentDetails = () => {
    useScrollToTop();
    const navigate = useNavigate();
    const { type, id } = useParams(); // type = 'movie' ou 'tv'
    const location = useLocation();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedComments, setExpandedComments] = useState(new Set());
    
    const API_IMG_URL = 'https://image.tmdb.org/t/p/original';

    const toggleCommentExpansion = (commentIndex) => {
        setExpandedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentIndex)) {
                newSet.delete(commentIndex);
            } else {
                newSet.add(commentIndex);
            }
            return newSet;
        });
    };

    const isCommentExpanded = (commentIndex) => {
        return expandedComments.has(commentIndex);
    };


    const fetchContentDetails = useCallback(async () => {
        if (!type || !id) return;

        setLoading(true);
        setError(null);

        try {
            let response;
            if (type === 'movie' || type === 'movies') {
                response = await getAPI.getMovieDetails(id);
            } else {
                response = await getAPI.getSeriesDetails(id);
            }
            const data = response.data;
            setContent(data);
        } catch (err) {
            console.error('❌ Erreur lors du fetch:', err);
            setError(err.message || 'Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    }, [type, id]);
    
    useEffect(() => {
        fetchContentDetails();
    }, [fetchContentDetails]);

    if (loading) {
        return (
            <div>
                <Header />
                <main className="min-h-[80vh] p-4 flex items-center justify-center">
                    <div className="text-center">
                        <div className="loading loading-spinner loading-lg"></div>
                        <p className="mt-4 text-gray-300">Chargement des détails...</p>
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

    if (!content) {
        return (
            <div>
                <Header />
                <main className="min-h-[80vh] p-4 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-300">Aucun contenu trouvé.</p>
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

    // Extraction des données selon la structure de votre API
    const movieData = content.details || content;
    const credits = content.credits || {};
    const recommendations = content.recommendations || [];
    const reviews = content.reviews || [];

    const title = movieData.title || movieData.name || 'Titre non disponible';
    const releaseDate = movieData.release_date || movieData.first_air_date;
    const overview = movieData.overview || "Aucune description disponible.";
    const backdropPath = movieData.backdrop_path || movieData.poster_path;
    const posterPath = movieData.poster_path;

    // Filtrer les acteurs principaux (premiers 10)
    const mainCast = credits.cast?.slice(0, 10) || [];
    
    // Filtrer l'équipe technique (réalisateur, producteur, etc.)
    const crew = credits.crew || [];
    const director = crew.find(person => person.job === 'Director');
    const producers = crew.filter(person => person.job === 'Producer').slice(0, 3);

    return (
        <div>
            <Header />
            <main className="min-h-[80vh] p-4">
                <div className="container mx-auto">
                    {/* Section principale avec image et détails */}
                    <section className="mb-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Image du contenu */}
                            <div className="lg:w-1/3">
                                <figure className="w-full">
                                    {posterPath ? (
                                        <img 
                                            src={`${API_IMG_URL}${posterPath}`}
                                            alt={`Affiche de ${title}`}
                                            className="w-full h-auto rounded-lg shadow-lg"
                                            onError={(e) => {
                                                e.target.src = `${API_IMG_URL}${backdropPath}`;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-96 bg-gray-700 rounded-lg shadow-lg flex items-center justify-center">
                                            <p className="text-gray-400">Aucune image disponible</p>
                                        </div>
                                    )}
                                </figure>
                            </div>
                            
                            {/* Détails du contenu */}
                            <div className="lg:w-2/3">
                                <div className="mb-6">
                                    <CustomDivider color="primary" className='text-4xl mb-8'>{title}</CustomDivider>
                                    
                                    {/* Genres */}
                                    {movieData.genres && movieData.genres.length > 0 && (
                                        <div className="mb-4">
                                            {movieData.genres.map(genre => (
                                                <span key={genre.id} className="badge badge-large badge-outline badge-warning mr-2">
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Informations de base */}
                                    <div className="mb-4 space-y-2">
                                        {releaseDate && (
                                            <div>
                                                <span className="text-gray-400">Date de sortie : </span>
                                                <span className="text-white">
                                                    {new Date(releaseDate).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-4">
                                            {movieData.runtime && movieData.runtime > 0 && (
                                                <div>
                                                    <span className="text-gray-400">Durée : </span>
                                                    <span className="text-white">{movieData.runtime} minutes</span>
                                                </div>
                                            )}
                                            
                                            {movieData.number_of_seasons && movieData.number_of_seasons > 0 && (
                                                <div>
                                                    <span className="text-gray-400">Saisons : </span>
                                                    <span className="text-white">{movieData.number_of_seasons}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Note */}
                                    {movieData.vote_average && movieData.vote_average > 0 && (
                                        <div className="mb-4">
                                            <span className="text-gray-400">Note : </span>
                                            <span className="text-yellow-500 font-bold">
                                                {Number(movieData.vote_average).toFixed(1)}/10
                                            </span>
                                            <span className="text-gray-400 ml-2">
                                                ({movieData.vote_count} votes)
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Synopsis */}
                                    <div className="mb-6">
                                        <CustomDivider color="primary" align="start">synopsis</CustomDivider>
                                        <p className="text-gray-300 leading-relaxed">{overview}</p>
                                    </div>

                                    <div className='mb-8'>
                                        <CustomDivider color="primary" align="start">équipe technique</CustomDivider>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {director && (
                                                <div>
                                                    <h3 className="font-semibold text-white">Réalisateur</h3>
                                                    <p className="text-gray-300">{director.name}</p>
                                                </div>
                                            )}
                                            {producers.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-white">Producteurs</h3>
                                                    <p className="text-gray-300">
                                                        {producers.map(p => p.name).join(', ')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
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

                    {/* Section acteurs */}
                    {mainCast.length > 0 && (
                        <section className="mb-8">
                            <CustomDivider color="primary" align="start">Acteurs principaux</CustomDivider>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 pt-4">
                                {mainCast.map(actor => (
                                    <div 
                                        key={actor.id} 
                                        className="text-center hover:cursor-pointer"
                                        onClick={() => navigate(`/person/${actor.id}`)}
                                    >
                                        <div className="mb-2 flex justify-center">
                                            {actor.profile_path ? (
                                                <img 
                                                    src={`${API_IMG_URL}${actor.profile_path}`}
                                                    alt={actor.name}
                                                    className="w-[200px] h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                                                    <span className="text-gray-400 text-sm">Pas de photo</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-white text-sm">{actor.name}</h3>
                                        <p className="text-gray-400 text-xs">{actor.character}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {/* Section recommandations */}
                    {recommendations.length > 0 && (
                        <section className="">
                            <CustomDivider color="primary" align="start">Recommandations</CustomDivider>
                            <CarouselCards 
                                items={recommendations}
                                type={type}
                                showAllLink={false}
                            />
                        </section>
                    )}

                    {/* Section commentaires (placeholder) */}
                    <section className="mb-8">
                        <CustomDivider color="primary" align="start">Commentaires</CustomDivider>
                        
                        {reviews && reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map((comment, index) => {
                                    const isExpanded = isCommentExpanded(index);
                                    const contentLength = comment.content?.length || 0;
                                    // Seuil max des caractères avant de toggle
                                    const shouldShowToggle = contentLength > 300;
                                    
                                    return (
                                        <div key={comment.id || index} className="bg-gray-800 rounded-lg p-6">
                                            <div className="flex items-start gap-4">
                                                {/* Avatar utilisateur */}
                                                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold">
                                                        {comment.author?.charAt(0)?.toUpperCase() || comment.author_details?.username?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                
                                                {/* Contenu du commentaire */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-white">
                                                            {comment.author || comment.author_details?.username || 'Utilisateur anonyme'}
                                                        </span>
                                                        {(comment.created_at || comment.updated_at) && (
                                                            <span className="text-gray-400 text-sm">
                                                                {new Date(comment.created_at || comment.updated_at).toLocaleDateString('fr-FR')}
                                                            </span>
                                                        )}
                                                        {(comment.rating || comment.author_details?.rating) && (
                                                            <div className="bg-yellow-600 text-white px-2 py-1 rounded text-sm">
                                                                ⭐ {comment.rating || comment.author_details?.rating}/10
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={`text-gray-300 leading-relaxed ${
                                                            !isExpanded && shouldShowToggle ? 'line-clamp-3' : ''
                                                        }`}>
                                                            {comment.content || comment.comment || 'Contenu non disponible'}
                                                        </p>
                                                        {shouldShowToggle && (
                                                            <button
                                                                onClick={() => toggleCommentExpansion(index)}
                                                                className="text-(--primary-color) hover:text-(--cta-hover) text-sm mt-2 underline"
                                                            >
                                                                {isExpanded ? 'Voir moins' : 'Voir plus'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-gray-800 rounded-lg p-6 text-center">
                                <p className="text-gray-400">Aucun commentaire pour le moment...</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContentDetails;