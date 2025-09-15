import axios from 'axios';

const API_BASE = 'https://api.themoviedb.org/3';

// Get details d'une personne et ses crédits par son person.ID
export const getPersonById = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const { id } = req.params;

    try {
        // Get détails de la personne
        const personResponse = await axios.get(`${API_BASE}/person/${id}`, {
            params: { 
                api_key: API_KEY, 
                language: 'fr-FR'
            }
        });

        // Get ses films
        const creditsResponse = await axios.get(`${API_BASE}/person/${id}/movie_credits`, {
            params: { 
                api_key: API_KEY, 
                language: 'en-US'
            }
        });

        // Get ses series
        const tvCreditsResponse = await axios.get(`${API_BASE}/person/${id}/tv_credits`, {
            params: { 
                api_key: API_KEY, 
                language: 'en-US'
            }
        });

        // Merge tous les crédits films et séries pour une seule réponse
        const allCredits = {
            cast: [
                ...(creditsResponse.data.cast || []).map(item => ({ ...item, media_type: 'movie' })),
                ...(tvCreditsResponse.data.cast || []).map(item => ({ ...item, media_type: 'tv' }))
            ],
            crew: [
                ...(creditsResponse.data.crew || []).map(item => ({ ...item, media_type: 'movie' })),
                ...(tvCreditsResponse.data.crew || []).map(item => ({ ...item, media_type: 'tv' }))
            ]
        };

        const responseData = {
            details: personResponse.data,
            credits: allCredits
        };
        
        res.json(responseData);
    } catch (err) {
        console.error('Erreur API:', err.response?.data || err.message);
        res.status(500).json({ 
            error: "Erreur lors de la récupération des données de la personne",
            details: err.response?.data || err.message
        });
    }
};

export default getPersonById;