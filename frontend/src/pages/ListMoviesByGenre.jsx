import { useEffect, useState } from 'react';
import CarouselCards from '../components/CarouselCards';
import CustomDivider from '../components/CustomDivider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import getAPI from '../getAPI'; // Import du service API
import { useScrollToTop } from '../hooks/useScrollToTop';

function ListMovies() {
    useScrollToTop(); // Hook pour remonter en haut de la page à chaque navigation
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [genresWithMovies, setGenresWithMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get now playing - REMPLACÉ
        getAPI.getNowPlayingMovies()
            .then(response => {
                console.log('Données reçues:', response.data);
                setNowPlayingMovies(response.data);
            })
            .catch(err => {
                console.error('Erreur frontend:', err);
                setError(err.message);
            });
        
        // Get les films par genre - REMPLACÉ
        getAPI.getMoviesByGenres()
            .then(response => {
                setGenresWithMovies(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Erreur lors du chargement des films par genre:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

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
                    <div className="text-center text-red-500">Erreur: {error}</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className="min-h-[80vh]">
                {genresWithMovies.map((genreData, index) => (
                    <div key={index} className="mb-8">
                        <CustomDivider color="primary">{genreData.genre}</CustomDivider>
                        <CarouselCards 
                            items={genreData.movies} 
                            type="movie"
                            showAllLink={false}
                        />
                    </div>
                ))}
            </main>
            <Footer />
        </div>
    );
}

export default ListMovies;