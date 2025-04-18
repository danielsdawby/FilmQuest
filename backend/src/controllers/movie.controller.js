import Movie from "../models/movie.model.js"; 
import WatchList from "../models/watchList.model.js"; 
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const TMDB_API_URL = "https://api.themoviedb.org/3";
const HEADERS = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
};

export const getMovies = async (req, res) => {
    try {
        const { type } = req.query;
        let userId = null;

        if (req?.user) {
            userId = req.user.userId;
        }

        let url;

        switch (type) {
            case 'recommendations':
                url = `${TMDB_API_URL}/discover/movie`;
                break;
            case 'movies':
                url = `${TMDB_API_URL}/movie/popular`;
                break;
            case 'tv':
                url = `${TMDB_API_URL}/tv/popular`;
                break;
            case 'trending':
                url = `${TMDB_API_URL}/trending/all/day`;
                break;
            default:
                return res.status(400).json({ error: "Invalid type parameter" });
        }

        const response = await axios.get(url, {
            params: { language: "ru-RU" },
            headers: HEADERS,
        });

        const allMovies = response.data.results;

        if (userId) {
            const watchedMovies = await Movie.find({ userId }).select('movieId');
            const watchedMovieIds = watchedMovies.map(movie => movie.movieId);
            const filteredMovies = allMovies.filter(movie => !watchedMovieIds.includes(movie.id));
            return res.json({ results: filteredMovies });
        }

        res.json({ results: allMovies });
    } catch (error) {
        console.error("Ошибка при получении фильмов:", error.message);
        res.status(500).json({ error: "Ошибка при получении фильмов" });
    }
};



export const searchMovies = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ error: "Query is required" });

        const response = await axios.get(`${TMDB_API_URL}/search/movie`, {
            params: { query, language: "ru-RU" },
            headers: HEADERS,
        });

        res.json(response.data);
    } catch (error) {
        console.error("Ошибка при поиске фильмов:", error.message);
        res.status(500).json({ error: "Ошибка при поиске фильмов" });
    }
};

export const getRecommendations = async (req, res) => {
    try {
        const { movieId } = req.params;
        const response = await axios.get(`${TMDB_API_URL}/movie/${movieId}/recommendations`, {
            params: { language: "ru-RU" },
            headers: HEADERS,
        });

        res.json(response.data);
    } catch (error) {
        console.error("Ошибка при получении рекомендаций:", error.message);
        res.status(500).json({ error: "Ошибка при получении рекомендаций" });
    }
};

export const getTrendingMovies = async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_API_URL}/trending/movie/week`, {
            params: { language: "ru-RU" },
            headers: HEADERS,
        });

        res.json(response.data);
    } catch (error) {
        console.error("Ошибка при получении трендов:", error);
        res.status(500).json({ error: "Ошибка при получении трендов" });
    }
};

export const getUpcomingMovies = async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_API_URL}/movie/upcoming`, {
            params: { language: "ru-RU" },
            headers: HEADERS,
        });

        const movies = response.data.results;

        // Для каждого фильма получаем видео (трейлер)
        const moviesWithVideos = await Promise.all(
            movies.slice(0, 5).map(async (movie) => {
                try {
                    const videoRes = await axios.get(`${TMDB_API_URL}/movie/${movie.id}/videos`, {
                        params: { language: "ru-RU" },
                        headers: HEADERS,
                    });

                    const trailers = videoRes.data.results.filter(
                        (v) => v.type === "Trailer" && v.site === "YouTube"
                    );

                    return {
                        ...movie,
                        trailer: trailers.length > 0 ? `https://www.youtube.com/embed/${trailers[0].key}` : null,
                    };
                } catch {
                    return { ...movie, trailer: null };
                }
            })
        );

        res.json({ results: moviesWithVideos });
    } catch (error) {
        console.error("Ошибка при получении премьер:", error.message);
        res.status(500).json({ error: "Ошибка при получении премьер" });
    }
};

export const getOneMovie = async (req, res) => {
    try {
        const { id } = req.params; 

        const movieResponse = await axios.get(`${TMDB_API_URL}/movie/${id}`, {
            params: { language: 'ru-RU' },
            headers: HEADERS
        });

        const creditsResponse = await axios.get(`${TMDB_API_URL}/movie/${id}/credits`, {
            params: { language: 'ru-RU' },
            headers: HEADERS
        });

        const movieData = movieResponse.data;
        movieData.cast = creditsResponse.data.cast.slice(0, 12); 

        res.status(200).json(movieData);
    } catch (error) {
        console.error("Ошибка при получении одного фильма:", error.message);

        if (error.response) {
            return res.status(error.response.status).json({ error: error.response.data.status_message });
        }
        res.status(500).json({ error: "Ошибка при получении одного фильма" });
    }
};

export const getMoviesByGenre = async (req, res) => {
    try {
        const { genreId } = req.params;
        const response = await axios.get(`${TMDB_API_URL}/discover/movie`, {
            params: { with_genres: genreId, language: "ru-RU" },
            headers: HEADERS,
        });

        res.json(response.data);
    } catch (error) {
        console.error("Ошибка при получении фильмов по жанру:", error.message);
        res.status(500).json({ error: "Ошибка при получении фильмов по жанру" });
    }
};

export const addWatchedMovie = async (req, res) => {
    try {
        const { movieId, runtime, type } = req.body;
        const { userId } = req.user;

        if (!userId || !movieId || !runtime || !type) {
            return res.status(400).json({ error: "Отсутствуют обязательные поля" });
        }

        const existingMovie = await WatchList.findOne({ userId, movieId });

        if (existingMovie) {
            return res.status(400).json({ error: "Фильм уже отмечен как просмотренный" });
        }

        switch(type) {
            case "want":
              break;
            
            case "done":
              break;
          
            default:
                return res.status(400).json({ error: "Invalid type" });
              break;
        }

        const watchedMovie = new WatchList({ userId, movieId, runtime, type });
        await watchedMovie.save();

        res.status(201).json({ message: "Фильм добавлен в список просмотренных" });
    } catch (error) {
        console.error("Ошибка при добавлении просмотренного фильма:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

export const getWatchedMovies = async (req, res) => {
    const { userId } = req.user;

    try {

        console.log(userId);

        if(!userId) {
            return res.status(400).json({ error: "Отсутствуют обязательные поля" });
        }

        const watchlist = await WatchList.find({ userId });

        return res.status(200).json({ watchlist });
    } catch (error) {
        console.error("Ошибка при получение просмотренного фильма:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
}

export const getTotalWatchTime = async (req, res) => {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(400).json({ error: "Требуется ID пользователя" });
        }

        const totalWatchTime = await Movie.aggregate([
            { $match: { userId } },
            { $group: { _id: null, totalTime: { $sum: "$runtime" } } }
        ]);

        const time = totalWatchTime.length ? totalWatchTime[0].totalTime : 0;

        res.json({ userId, totalWatchTime: time });
    } catch (error) {
        console.error("Ошибка при расчёте общего времени просмотра:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

export const checkMovieInLists = async (req, res) => {
    try {
        const { movieId } = req.query;
        const { userId } = req.user;

        if (!userId || !movieId) {
            return res.status(400).json({ error: "Требуются ID пользователя и ID фильма" });
        }

        const watched = await Movie.findOne({ userId, movieId });
        const watchlist = await Watchlist.findOne({ userId, movieId });

        res.json({
            watched: !!watched,
            watchlist: !!watchlist,
        });

    } catch (error) {
        console.error("Ошибка при проверке фильма в списках:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export const removeWatchedMovie = async (req, res) => {
    try {
        const { movieId } = req.params; 
        const { userId } = req.user;

        if (!movieId) {
            return res.status(400).json({ error: "Не указан movieId" });
        }

        const deletedMovie = await WatchList.findOneAndDelete({ userId, movieId });

        if (!deletedMovie) {
            return res.status(404).json({ error: "Фильм не найден в вашем списке" });
        }

        res.status(200).json({ 
            message: "Фильм удалён из списка",
            deletedMovie: deletedMovie.movieId 
        });
    } catch (error) {
        console.error("Ошибка при удалении фильма:", error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

