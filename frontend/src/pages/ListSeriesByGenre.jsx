import { useEffect, useState } from 'react';
import CarouselCards from '../components/CarouselCards';
import CustomDivider from '../components/CustomDivider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import getAPI from '../getAPI'; // Import du service API
import { useScrollToTop } from '../hooks/useScrollToTop';

function ListSeries() {
    useScrollToTop(); // Hook pour remonter en haut de la page à chaque navigation
    const [popularSeries, setPopularSeries] = useState([]);
    const [genresWithSeries, setGenresWithSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get séries populaires - REMPLACÉ
        getAPI.getPopularSeries()
            .then(response => {
                console.log('Données séries populaires reçues:', response.data);
                setPopularSeries(response.data);
            })
            .catch(err => {
                console.error('Erreur frontend:', err);
                setError(err.message);
            });
        
        // Get les séries par genre - REMPLACÉ
        getAPI.getSeriesByGenres()
            .then(response => {
                setGenresWithSeries(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Erreur lors du chargement des séries par genre:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

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
            <main className="min-h-[80vh]">
                {/* Carousel Séries Populaires en premier */}
                <div className="mb-8">
                    <CustomDivider color="primary">Séries populaires</CustomDivider>
                    <CarouselCards 
                        items={popularSeries} 
                        type="tv"
                        showAllLink={false}
                    />
                </div>

                {/* Carousels par genre */}
                {genresWithSeries.map((genreData, index) => (
                    <div key={index} className="mb-8">
                        <CustomDivider color="primary">{genreData.genre}</CustomDivider>
                        <CarouselCards 
                            items={genreData.series} 
                            type="tv"
                            showAllLink={false}
                        />
                    </div>
                ))}
            </main>
            <Footer />
        </div>
    );
}

export default ListSeries;