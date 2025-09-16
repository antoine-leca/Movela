import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://movela.onrender.com/api/';

// Configuration axios avec interceptors
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Interceptors pour gérer les erreurs globalement
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

const getAPI = {
    // ===== FILMS =====
    
    // Films populaires pour le hero carousel
    getNowPlayingMovies: () => 
        api.get('/api/movies/now-playing'),
    
    // Films populaires pour la page d'accueil
    getPopularMovies: () => 
        api.get('/api/movies/popular'),
    
    // Tous les films avec pagination
    getAllMovies: (page = 1, limit = 24) => 
        api.get('/api/movies/all', { params: { page, limit } }),
    
    // Films par multiples genres
    getMoviesByGenres: () => 
        api.get('/api/movies/by-genres'),
    
    // Détails d'un film
    getMovieDetails: (id) => 
        api.get(`/api/movies/${id}`),

    // ===== SÉRIES =====
    
    // Séries populaires
    getPopularSeries: () => 
        api.get('/api/series/popular'),
    
    // Toutes les séries avec pagination
    getAllSeries: (page = 1, limit = 24) => 
        api.get('/api/series/all', { params: { page, limit } }),
    
    // Séries par multiples genres
    getSeriesByGenres: () => 
        api.get('/api/series/by-genres'),
    
    // Détails d'une série
    getSeriesDetails: (id) => 
        api.get(`/api/series/${id}`),

    // ===== RECHERCHE =====
    
    // Recherche globale films/séries
    searchMultiMedia: (query) => 
        api.get('/api/search', { params: { q: query } }),

    // ===== PERSONNES =====
    
    // Détails d'une personne et ses crédits
    getPersonDetails: (id) => 
        api.get(`/api/person/${id}`)
};

export default getAPI;