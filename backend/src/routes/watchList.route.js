import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { getWatchList, createWatchList, deleteWatchList } from '../controllers/watchList.AbortController.js';

const router = express.Router();

router.get("/", protectedRoute, getWatchList);
router.get("/:movieId", protectedRoute, getOneWatchList);
router.post("/", protectedRoute, createWatchList);
router.delete("/:movieId", protectedRoute, deleteWatchList);

export default router;
