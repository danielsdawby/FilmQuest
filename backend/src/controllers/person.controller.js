import axios from 'axios';

const TMDB_API_KEY = process.env.ACCESS_TOKEN;
const TMDB_API_URL = "https://api.themoviedb.org/3";

const HEADERS = {
    Authorization: `Bearer ${TMDB_API_KEY}`,
};

export const getPersonDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Требуется ID актёра' });
        }

        const response = await axios.get(`${TMDB_API_URL}/person/${id}`, {
            headers: HEADERS,
            params: {
                language: 'ru-RU',
                append_to_response: 'movie_credits,tv_credits'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Ошибка при получении данных актёра:', error.message);
        res.status(500).json({ error: 'Ошибка сервера при получении данных актёра' });
    }
};
