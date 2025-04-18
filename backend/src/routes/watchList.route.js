import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { removeWatchedMovie } from '../controllers/movie.controller.js';

const router = express.Router();

router.delete("/:movieId", protectedRoute, removeWatchedMovie);

export default router;
