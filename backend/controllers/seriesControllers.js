import axios from 'axios';

const API_BASE = 'https://api.themoviedb.org/3';

// Get les séries populaires pour la page d'accueil et le premier carousel de la page series 

export const getPopularSeries = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    try {
        const { data } = await axios.get(`${API_BASE}/tv/popular`, {
        params: { api_key: API_KEY, language: 'fr-FR', page: 1 }
        });
        res.json(data.results.slice(1, 20));
    } catch (err) {
        res.status(500).json({ error: "Erreur séries populaires" });
    }
};

// Get toutes les séries pour la page list/all
export const getAllSeries = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;

    try {
        // Calculer quelle page de l'API TMDB nous devons récupérer
        // L'API TMDB retourne 20 séries par page, nous voulons 24
        const startIndex = (page - 1) * limit;
        const tmdbPage = Math.floor(startIndex / 20) + 1;
        const nextTmdbPage = Math.floor((startIndex + limit - 1) / 20) + 1;

        let allSeries = [];

        // Récupérer une ou deux pages de l'API TMDB selon le besoin
        const pagesToFetch = tmdbPage === nextTmdbPage ? [tmdbPage] : [tmdbPage, nextTmdbPage];
        
        for (const pageNum of pagesToFetch) {
            const response = await axios.get(`${API_BASE}/discover/tv`, {
                params: {
                    api_key: API_KEY,
                    language: 'fr-FR',
                    sort_by: 'popularity.desc',
                    page: pageNum,
                    include_adult: false
                }
            });
            allSeries = allSeries.concat(response.data.results);
        }

        // Calculer les indices pour extraire exactement 24 séries
        const indexInFirstPage = startIndex % 20;
        const seriesSlice = allSeries.slice(indexInFirstPage, indexInFirstPage + limit);

        // Informations de pagination
        const totalSeries = 10000; // TMDB limite à ~500 pages de 20 séries
        const totalPages = Math.ceil(totalSeries / limit);

        res.json({
            series: seriesSlice,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalSeries: totalSeries,
                seriesPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        console.error('Erreur API getAllSeries:', err.response?.data || err.message);
        res.status(500).json({ 
            error: "Erreur récupération toutes les séries",
            details: err.response?.data || err.message
        });
    }
};

// Get les séries par genre pour la page list/genre

export const getSeriesByMultipleGenres = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    
    const genres = [
        { id: 18, name: 'Drame' },
        { id: 35, name: 'Comédie' },
        { id: 80, name: 'Crime' },
        { id: 10759, name: 'Action & Aventure' },
        { id: 10765, name: 'Science-Fiction & Fantastique' },
        { id: 10767, name: 'Talk-show' },
        { id: 10768, name: 'Guerre & Politique' },
        { id: 37, name: 'Western' },
        { id: 16, name: 'Animation' },
        { id: 10751, name: 'Familial' },
        { id: 10762, name: 'Kids' },
        { id: 10770, name: 'Téléfilm' }
    ];

    try {
        const usedSeriesIds = new Set();
        const genresWithSeries = [];

        for (const genre of genres) {
            const promises = [1, 2, 3].map(page => 
                axios.get(`${API_BASE}/discover/tv`, {
                    params: {
                        api_key: API_KEY,
                        language: 'fr-FR',
                        sort_by: 'popularity.desc',
                        with_genres: genre.id,
                        page: page
                    }
                })
            );

            const responses = await Promise.all(promises);
            const allSeries = responses.flatMap(response => response.data.results);

            const uniqueSeries = allSeries
                .filter(serie => !usedSeriesIds.has(serie.id))
                .slice(0, 12);

            uniqueSeries.forEach(serie => usedSeriesIds.add(serie.id));

            if (uniqueSeries.length > 0) {
                genresWithSeries.push({
                    genre: genre.name,
                    genreId: genre.id,
                    series: uniqueSeries
                });
            }
        }

        res.json(genresWithSeries);
    } catch (err) {
        res.status(500).json({ 
            error: "Erreur series by multiple genres",
            details: err.response?.data || err.message
        });
    }
};

export const getSeriesDetails = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const { id } = req.params;

    try {
        // Get les détails principaux de la série
        const detailsResponse = await axios.get(`${API_BASE}/tv/${id}`, {
            params: { api_key: API_KEY, language: 'fr-FR' }
        });

        // Get les crédits (acteurs, réalisateurs)
        const creditsResponse = await axios.get(`${API_BASE}/tv/${id}/credits`, {
            params: { api_key: API_KEY, language: 'fr-FR' }
        });

        // Get les recommandations
        const recommendationsResponse = await axios.get(`${API_BASE}/tv/${id}/recommendations`, {
            params: { api_key: API_KEY, language: 'fr-FR', page: 1 }
        });

        // Get les reviews
        const reviewsResponse = await axios.get(`${API_BASE}/tv/${id}/reviews`, {
            params: { api_key: API_KEY, language: 'en-US', page: 1 }
        });

        res.json({
            details: detailsResponse.data,
            credits: creditsResponse.data,
            recommendations: recommendationsResponse.data.results,
            reviews: reviewsResponse.data.results.slice(0, 10)
        });
    } catch (err) {
        res.status(500).json({ 
            error: "Erreur series details",
            details: err.response?.data || err.message
        });
    }
};