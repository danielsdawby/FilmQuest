import express from 'express';
import { 
    getMovies, 
    searchMovies, 
    getRecommendations, 
    getTrendingMovies, 
    getUpcomingMovies, 
    getMoviesByGenre, 
    addWatchedMovie, 
    getTotalWatchTime, 
    checkMovieInLists,
    getOneMovie,
    getWatchedMovies
} from '../controllers/movie.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/", getMovies);
router.get("/search", searchMovies);
router.get("/recommendations/:movieId", getRecommendations);
router.get("/trending", getTrendingMovies);
router.get("/upcoming", getUpcomingMovies);
router.get("/genre/:genreId", getMoviesByGenre);


router.post("/watched", protectedRoute, addWatchedMovie);
router.get("/watched", protectedRoute, getWatchedMovies);


router.get("/watchtime/:userId", protectedRoute, getTotalWatchTime);
router.get("/check", protectedRoute, checkMovieInLists);

router.get("/:id", getOneMovie);



export default router;