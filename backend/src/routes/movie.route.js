import express from "express";
import {
    getMovies,
    searchMovies,
    getRecommendations,
    getTrendingMovies,
    getUpcomingMovies, 
    getOneMovie,
    getMoviesByGenre,
    addWatchedMovie,
    getWatchedMovies,
    getTotalWatchTime,
    checkMovieInLists,
} from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/search", searchMovies);
router.get("/trending", getTrendingMovies);
router.get("/upcoming", getUpcomingMovies); // ← Добавь этот маршрут
router.get("/recommendations/:movieId", getRecommendations);
router.get("/genre/:genreId", getMoviesByGenre);
router.get("/watched", getWatchedMovies);
router.get("/total-watch-time", getTotalWatchTime);
router.get("/check", checkMovieInLists);
router.get("/:id", getOneMovie);
router.post("/watched", addWatchedMovie);

export default router;