import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselCards from '../components/CarouselCards';
import CustomDivider from '../components/CustomDivider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import getAPI from '../getAPI'; // Import du service API
import { useScrollToTop } from '../hooks/useScrollToTop';

function Home() {
    useScrollToTop(); // Hook pour remonter en haut de la page à chaque navigation
    const [movies, setMovies] = useState([]);
    const [popularSeries, setPopularSeries] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const API_IMG_URL = "https://image.tmdb.org/t/p/original/";

    useEffect(() => {
        let completedRequests = 0;
        const totalRequests = 3;

        const checkAllLoaded = () => {
            completedRequests++;
            if (completedRequests === totalRequests) {
                setLoading(false);
            }
        };

        // fetch des films now playing - REMPLACÉ
        getAPI.getNowPlayingMovies()
            .then(response => {
                console.log('Données reçues:', response.data);
                setMovies(response.data);
                checkAllLoaded();
            })
            .catch(err => {
                console.error('Erreur frontend:', err);
                setError(err.message);
                setLoading(false);
            });
        
        // fetch des films populaires - REMPLACÉ
        getAPI.getPopularMovies()
            .then(response => {
                console.log('Films populaires:', response.data);
                setPopularMovies(response.data);
                checkAllLoaded();
            })
            .catch(err => {
                console.error('Erreur films populaires:', err);
                setError(err.message);
                setLoading(false);
            });
        
        // fetch des séries populaires - REMPLACÉ
        getAPI.getPopularSeries()
            .then(response => {
                console.log('Séries populaires:', response.data);
                setPopularSeries(response.data);
                checkAllLoaded();
            })
            .catch(err => {
                console.error('Erreur séries populaires:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

// Animation carousel Hero

    useEffect(() => {
        if (movies.length === 0) return;

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    return 0;
                } else {
                    return prev + 1.25; // 100 ÷ (8000ms ÷ 100ms) = 1.25
                }
            });
        }, 100);

        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % movies.length);
            setProgress(0);
        }, 8000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(slideInterval);
        };
    }, [movies.length, currentSlide]);

    const updateHashWithoutScroll = (hash) => {
        // Seulement empêcher le scroll si on est déjà sur la page Home
        // et que c'est un changement automatique du carousel
        if (window.location.pathname === '/' || window.location.pathname === '/home') {
            const scrollPosition = window.pageYOffset;
            window.location.hash = hash;
            window.scrollTo(0, scrollPosition);
        }
    };

    useEffect(() => {
        if (movies.length > 0) {
            updateHashWithoutScroll(`slide${currentSlide + 1}`);
        }
        
        // Cleanup function pour nettoyer le hash quand on quitte cette page
        return () => {
            if (window.location.hash.startsWith('#slide')) {
                window.history.replaceState(null, null, window.location.pathname);
            }
        };
    }, [currentSlide, movies.length]);

    if (loading) {
        return (
            <div>
                <Header />
                <main className="min-h-[80vh] flex items-center justify-center">
                    <span className="loading loading-ring text-warning loading-xl"></span>
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
                    <div className="text-center text-red-500">Erreur: {error}</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className='min-h-[80vh]'>
                <section className="carousel w-full">
                    {/* boucle la création de page du carousel selon le nombre de films fetchs, ici max 6 */}
                    {movies.map((movie, index) => (
                        <div onClick={() => navigate(`/details/movie/${movie.id}`)} key={movie.id} id={`slide${index + 1}`} className="carousel-item relative w-full hover:cursor-pointer">
                            <div
                            className="hero min-h-120 lg:min-h-180 bg-top"
                            style={{
                                backgroundImage:
                                `url(${API_IMG_URL}${movie.backdrop_path})`,
                            }}
                            >
                                <div className="hero-overlay">
                                    <div className="w-full flex justify-center gap-2 mt-2">
                                        {movies.map((_, progressIndex) => (
                                            <progress 
                                                key={progressIndex}
                                                className="progress text-(--cta-color) w-1/10 h-1" 
                                                value={
                                                    progressIndex === currentSlide ? progress :
                                                    progressIndex < currentSlide ? 100 : 0
                                                } 
                                                max="100"
                                            ></progress>
                                        ))}
                                    </div>
                                </div>
                                <div className="hero-content h-full flex-col justify-end text-neutral-content lg:w-1/2">
                                    <div className="max-w-md lg:max-w-full">
                                        <h1 className="mb-5 text-3xl font-bold">{movie.title}</h1>
                                        <p className="line-clamp-2">
                                            {movie.overview ? movie.overview : "Aucune description disponible."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newSlide = index === 0 ? movies.length - 1 : index - 1;
                                        setCurrentSlide(newSlide);
                                        setProgress(0);
                                        updateHashWithoutScroll(`slide${newSlide + 1}`);
                                    }}
                                    className="btn btn-circle cta-custom"
                                >
                                    ❮
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newSlide = index === movies.length - 1 ? 0 : index + 1;
                                        setCurrentSlide(newSlide);
                                        setProgress(0);
                                        updateHashWithoutScroll(`slide${newSlide + 1}`);
                                    }}
                                    className="btn btn-circle cta-custom"
                                >
                                    ❯
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
                <CustomDivider color="primary">Films</CustomDivider>
                <CarouselCards 
                    items={popularMovies} 
                    type="movie"
                    showAllLink={true}
                />
                <div className='flex justify-center pt-4 pb-4'>
                    <a className='cta-custom px-3 py-2 rounded' href="/movies/list">voir tout</a>
                </div>
                
                <CustomDivider color="primary">Séries</CustomDivider>
                <CarouselCards 
                    items={popularSeries} 
                    type="tv"
                    showAllLink={true}
                />
                <div className='flex justify-center mt-4'>
                    <a className='cta-custom px-3 py-2 rounded' href="/tv/list">voir tout</a>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Home;