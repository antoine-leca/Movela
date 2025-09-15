import axios from 'axios';

const API_BASE = 'https://api.themoviedb.org/3';

// Get les films populaires pour le hero carousel sur la page d'accueil

export const getNowPlaying = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;

    try {
        const response = await axios.get(`${API_BASE}/movie/now_playing`, {
        params: { 
            api_key: API_KEY, 
            language: 'fr-FR', 
            page: 1 
        }
        });
        
        res.json(response.data.results.slice(0, 6));
    } catch (err) {
        console.error('Erreur API:', err.response?.data || err.message);
        res.status(500).json({ 
        error: "Erreur now_playing",
        details: err.response?.data || err.message
        });
    }
};
    
    export const getPopularMovies = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    
    try {
        const { data } = await axios.get(`${API_BASE}/movie/popular`, {
        params: { api_key: API_KEY, language: 'fr-FR', page: 1 }
        });
        res.json(data.results.slice(7, 20)); // Limiter à 13 films populaires pour la page d'accueil, en ignorant les 6 premiers présents dans le Hero Carousel
    } catch (err) {
        res.status(500).json({ error: "Erreur popular movies" });
    }
    
};

// Get tous les films pour la page list/all
export const getAllMovies = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;

    try {
        // Calculer quelle page de l'API TMDB nous devons récupérer
        // L'API TMDB retourne 20 films par page, nous voulons 24
        const startIndex = (page - 1) * limit;
        const tmdbPage = Math.floor(startIndex / 20) + 1;
        const nextTmdbPage = Math.floor((startIndex + limit - 1) / 20) + 1;

        let allMovies = [];

        // Récupérer une ou deux pages de l'API TMDB selon le besoin
        const pagesToFetch = tmdbPage === nextTmdbPage ? [tmdbPage] : [tmdbPage, nextTmdbPage];
        
        for (const pageNum of pagesToFetch) {
            const response = await axios.get(`${API_BASE}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    language: 'fr-FR',
                    sort_by: 'popularity.desc',
                    page: pageNum,
                    include_adult: false
                }
            });
            allMovies = allMovies.concat(response.data.results);
        }

        // Calculer les indices pour extraire exactement 24 films
        const indexInFirstPage = startIndex % 20;
        const moviesSlice = allMovies.slice(indexInFirstPage, indexInFirstPage + limit);

        // Informations de pagination
        const totalMovies = 10000; // TMDB limite à ~500 pages de 20 films
        const totalPages = Math.ceil(totalMovies / limit);

        res.json({
            movies: moviesSlice,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalMovies: totalMovies,
                moviesPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        console.error('Erreur API getAllMovies:', err.response?.data || err.message);
        res.status(500).json({ 
            error: "Erreur récupération tous les films",
            details: err.response?.data || err.message
        });
    }
};

// Get les films par genre pour la page list/genre

export const getMoviesByGenre = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const { genreId } = req.params;

    try {
        const { data } = await axios.get(`${API_BASE}/discover/movie`, {
            params: {
                api_key: API_KEY,
                language: 'fr-FR',
                sort_by: 'popularity.desc',
                with_genres: genreId,
                page: 1
            }
        });
        res.json(data.results.slice(0, 12));
    } catch (err) {
        res.status(500).json({ 
            error: "Erreur movies by genre",
            details: err.response?.data || err.message
        });
    }
};

// Get les films par genre pour la page list avec plusieurs genres
export const getMoviesByMultipleGenres = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    
    // Genres populaires avec leurs IDs
    const genres = [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Aventure' },
        { id: 35, name: 'Comédie' },
        { id: 53, name: 'Thriller' },
        { id: 18, name: 'Drame' },
        { id: 27, name: 'Horreur' },
        { id: 80, name: 'Crime' },
        { id: 14, name: 'Fantastique' },
        { id: 878, name: 'Science-Fiction' },
        { id: 10752, name: 'Guerre' },
        { id: 16, name: 'Animation' },
        { id: 10751, name: 'Familial' }
    ];

    try {
        const usedMovieIds = new Set();
        const genresWithMovies = [];

        for (const genre of genres) {
            // Récupérer plusieurs pages pour avoir plus de choix
            const promises = [1, 2, 3].map(page => 
                axios.get(`${API_BASE}/discover/movie`, {
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
            const allMovies = responses.flatMap(response => response.data.results);

            // Filtrer les films déjà utilisés et prendre les 12 premiers
            const uniqueMovies = allMovies
                .filter(movie => !usedMovieIds.has(movie.id))
                .slice(0, 12);

            // Ajouter les IDs des films sélectionnés au Set
            uniqueMovies.forEach(movie => usedMovieIds.add(movie.id));

            // Ne pas ajouter le genre s'il n'y a pas assez de films uniques
            if (uniqueMovies.length > 0) {
                genresWithMovies.push({
                    genre: genre.name,
                    genreId: genre.id,
                    movies: uniqueMovies
                });
            }
        }

        res.json(genresWithMovies);
    } catch (err) {
        res.status(500).json({ 
            error: "Erreur movies by multiple genres",
            details: err.response?.data || err.message
        });
    }
};

export const getMovieDetails = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const { id } = req.params;

    try {
        // Fetch détails principaux
        const detailsResponse = await axios.get(`${API_BASE}/movie/${id}`, {
            params: { api_key: API_KEY, language: 'fr-FR' }
        });

        // Fetch crédits (acteurs, réalisateurs)
        const creditsResponse = await axios.get(`${API_BASE}/movie/${id}/credits`, {
            params: { api_key: API_KEY, language: 'fr-FR' }
        });

        // Fetch recommandations
        const recommendationsResponse = await axios.get(`${API_BASE}/movie/${id}/recommendations`, {
            params: { api_key: API_KEY, language: 'fr-FR', page: 1 }
        });

        // Fetch les commentaire 
        const reviewsResponse = await axios.get(`${API_BASE}/movie/${id}/reviews`, {
            params: { api_key: API_KEY, language: 'en-US', page: 1 }
        });

        res.json({
            details: detailsResponse.data,
            credits: creditsResponse.data,
            recommendations: recommendationsResponse.data.results,
            reviews: reviewsResponse.data.results.slice(0, 10) // Limiter à 5 commentaires
        });
    } catch (err) {
        res.status(500).json({ 
            error: "Erreur movie details",
            details: err.response?.data || err.message
        });
    }
};

// // Recherche globale films/séries pour la SearchBar
// export const searchMultiMedia = async (req, res) => {
//     const API_KEY = process.env.TMDB_API_KEY;
//     const { q } = req.query;

//     if (!q || q.length < 2) {
//         return res.json({ results: [] });
//     }

//     try {
//         const { data } = await axios.get(`${API_BASE}/search/multi`, {
//             params: {
//                 api_key: API_KEY,
//                 language: 'fr-FR',
//                 query: q,
//                 page: 1
//             }
//         });

//         // Filtrer pour ne garder que les films et séries (pas les personnes)
//         const filteredResults = data.results
//             .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
//             .slice(0, 8); // Limiter à 8 résultats pour l'autocomplétion

//         res.json({ results: filteredResults });
//     } catch (err) {
//         res.status(500).json({ 
//             error: "Erreur recherche multi-media",
//             details: err.response?.data || err.message
//         });
//     }
// };