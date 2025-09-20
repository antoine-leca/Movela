import axios from 'axios';

const API_BASE = 'https://api.themoviedb.org/3';

// Suggestions pour la SearchBar (limité à 8)
export const searchMultiMedia = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const { q } = req.query;

    if (!q) {
        console.log('❌ Requête vide');
        return res.json({ results: [] });
    }

    try {
        const { data } = await axios.get(`${API_BASE}/search/multi`, {
            params: {
                api_key: API_KEY,
                language: 'fr-FR',
                query: q,
                page: 1
            }
        });

        // Inclure films, séries ET personnes, limité à 8 pour l'autocomplétion
        const filteredResults = data.results
            .filter(item =>
                item.media_type === 'movie' ||
                item.media_type === 'tv' ||
                item.media_type === 'person'
            )
            .slice(0, 8);

        res.json({ results: filteredResults });
    } catch (err) {
        console.error('❌ Erreur API:', err.response?.data || err.message);
        res.status(500).json({ 
            error: "Erreur recherche multi-media",
            details: err.response?.data || err.message
        });
    }
};

// Recherche paginée de films uniquement
export const searchMovies = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const { q, page = 1 } = req.query;

    if (!q) {
        return res.json({ results: [], total_pages: 1 });
    }

    try {
        const { data } = await axios.get(`${API_BASE}/search/movie`, {
            params: {
                api_key: API_KEY,
                language: 'fr-FR',
                query: q,
                page
            }
        });
        res.json({
            results: data.results,
            total_pages: data.total_pages,
            total_results: data.total_results
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur recherche films", details: err.response?.data || err.message });
    }
};

// Recherche paginée de séries uniquement
export const searchSeries = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const { q, page = 1 } = req.query;

    if (!q) {
        return res.json({ results: [], total_pages: 1 });
    }

    try {
        const { data } = await axios.get(`${API_BASE}/search/tv`, {
            params: {
                api_key: API_KEY,
                language: 'fr-FR',
                query: q,
                page
            }
        });
        res.json({
            results: data.results,
            total_pages: data.total_pages,
            total_results: data.total_results
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur recherche séries", details: err.response?.data || err.message });
    }
};

// Recherche paginée d'acteur·rice·s uniquement
export const searchPersons = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const { q, page = 1 } = req.query;

    if (!q) {
        return res.json({ results: [], total_pages: 1 });
    }

    try {
        const { data } = await axios.get(`${API_BASE}/search/person`, {
            params: {
                api_key: API_KEY,
                language: 'fr-FR',
                query: q,
                page
            }
        });
        res.json({
            results: data.results,
            total_pages: data.total_pages,
            total_results: data.total_results
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur recherche personnes", details: err.response?.data || err.message });
    }
};