import axios from 'axios';

const API_BASE = 'https://api.themoviedb.org/3';

// Recherche globale films/séries pour la SearchBar
export const searchMultiMedia = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const { q } = req.query;

    if (!q || q.length < 2) {
        console.log('❌ Requête trop courte ou vide');
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

        // Filtrer pour ne garder que les films et séries (pas les personnes)
        const filteredResults = data.results
            .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
            // Limiter à 8 résultats pour l'autocomplétion
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