import express from 'express';
import { addMovieNote, getMovieNote, deleteMovieNote, getOneMovieNote } from '../controllers/note.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protectedRoute, addMovieNote);
router.get('/:userId', protectedRoute, getMovieNote);
router.get('/:movieId', protectedRoute, getOneMovieNote);
router.delete('/:id', protectedRoute, deleteMovieNote);

export default router;
