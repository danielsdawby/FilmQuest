import express from 'express';
import { signup, login, logout, checkAuth } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/users", signup);
router.post("/sessions", login);
router.delete("/sessions", logout);

router.get("/check-auth", protectedRoute, checkAuth);

export default router;