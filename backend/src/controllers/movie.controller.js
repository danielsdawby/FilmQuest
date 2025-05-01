import Movie from "../models/movie.model.js";
import WatchList from "../models/watchList.model.js";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const TMDB_API_URL = "https://api.themoviedb.org/3";
const HEADERS = { Authorization: `Bearer ${ACCESS_TOKEN}` };

const TMDB_PAGE_SIZE = 20;

export const getMovies = async (req, res) => {
  try {
    const { type, page = 1, genre, country, year } = req.query;
    const resultsPerPage = 42;
    const userId = req.user?.userId ?? null;

    let url;
    switch (type) {
      case 'recommendations':
        url = `${TMDB_API_URL}/discover/movie`;
        break;
      case 'movies':
        url = `${TMDB_API_URL}/discover/movie`;
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

    const startIndex = (page - 1) * resultsPerPage;
    const firstPage = Math.floor(startIndex / TMDB_PAGE_SIZE) + 1;
    const offsetInFirst = startIndex % TMDB_PAGE_SIZE;
    const pagesNeeded = Math.ceil((offsetInFirst + resultsPerPage) / TMDB_PAGE_SIZE);

    const requests = [];
    for (let i = 0; i < pagesNeeded; i++) {
      requests.push(
        axios.get(url, {
          params: {
            language: "ru-RU",
            page: firstPage + i,
            ...(genre && { with_genres: genre }),
            ...(country && { with_origin_country: country }),
            ...(year && { primary_release_year: year }),
          },
          headers: HEADERS,
        })
      );
    }

    const responses = await Promise.all(requests);
    let allResults = responses.flatMap(r => r.data.results);
    let sliced = allResults.slice(offsetInFirst, offsetInFirst + resultsPerPage);

    if (userId) {
      const watched = await WatchList.find({ userId }).select("movieId");
      const watchedIds = watched.map(m => m.movieId);
      sliced = sliced.filter(m => !watchedIds.includes(m.id));
    }

    const totalResults = responses[0].data.total_results;
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    return res.json({
      results: sliced,
      totalResults,
      totalPages,
    });
  } catch (error) {
    console.error("Ошибка при получении фильмов:", error);
    return res.status(500).json({ error: "Ошибка при получении фильмов" });
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
    console.error("Ошибка при поиске фильмов:", error);
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
    console.error("Ошибка при получении рекомендаций:", error);
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
    const moviesWithVideos = await Promise.all(
      movies.slice(0, 5).map(async (movie) => {
        try {
          const videoRes = await axios.get(`${TMDB_API_URL}/movie/${movie.id}/videos`, {
            params: { language: "ru-RU" },
            headers: HEADERS,
          });
          const trailers = videoRes.data.results.filter(
            v => v.type === "Trailer" && v.site === "YouTube"
          );
          return {
            ...movie,
            trailer: trailers.length
              ? `https://www.youtube.com/embed/${trailers[0].key}`
              : null,
          };
        } catch {
          return { ...movie, trailer: null };
        }
      })
    );
    res.json({ results: moviesWithVideos });
  } catch (error) {
    console.error("Ошибка при получении премьер:", error);
    res.status(500).json({ error: "Ошибка при получении премьер" });
  }
};

export const getOneMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movieRes = await axios.get(`${TMDB_API_URL}/movie/${id}`, {
      params: { language: "ru-RU" },
      headers: HEADERS,
    });
    const creditsRes = await axios.get(`${TMDB_API_URL}/movie/${id}/credits`, {
      params: { language: "ru-RU" },
      headers: HEADERS,
    });
    const movieData = movieRes.data;
    movieData.cast = creditsRes.data.cast.slice(0, 12);
    res.status(200).json(movieData);
  } catch (error) {
    console.error("Ошибка при получении одного фильма:", error);
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
    console.error("Ошибка при получении фильмов по жанру:", error);
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
    const existing = await WatchList.findOne({ userId, movieId });
    if (existing) {
      return res.status(400).json({ error: "Фильм уже отмечен как просмотренный" });
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
  try {
    const { userId } = req.user;
    if (!userId) return res.status(400).json({ error: "Отсутствуют обязательные поля" });
    const watchlist = await WatchList.find({ userId });
    res.status(200).json({ watchlist });
  } catch (error) {
    console.error("Ошибка при получении просмотренных:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

export const getTotalWatchTime = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) return res.status(400).json({ error: "Требуется ID пользователя" });
    const agg = await Movie.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalTime: { $sum: "$runtime" } } }
    ]);
    const totalTime = agg.length ? agg[0].totalTime : 0;
    res.json({ userId, totalWatchTime: totalTime });
  } catch (error) {
    console.error("Ошибка при расчёте времени:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

export const checkMovieInLists = async (req, res) => {
  try {
    const { movieId } = req.query;
    const { userId } = req.user;
    if (!userId || !movieId) {
      return res.status(400).json({ error: "Требуются ID пользователя и фильма" });
    }
    const watched = await WatchList.findOne({ userId, movieId });
    const inWatchlist = await WatchList.findOne({ userId, movieId, type: "want" });
    res.json({ watched: !!watched, watchlist: !!inWatchlist });
  } catch (error) {
    console.error("Ошибка при проверке в списках:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

export const removeWatchedMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { userId } = req.user;
    if (!movieId) return res.status(400).json({ error: "Не указан movieId" });
    const deleted = await WatchList.findOneAndDelete({ userId, movieId });
    if (!deleted) {
      return res.status(404).json({ error: "Фильм не найден в вашем списке" });
    }
    res.status(200).json({ message: "Фильм удалён", deletedMovie: deleted.movieId });
  } catch (error) {
    console.error("Ошибка при удалении фильма:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};
