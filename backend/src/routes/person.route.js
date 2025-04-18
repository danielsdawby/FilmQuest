import express from 'express';
import { getPersonDetails } from '../controllers/person.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:id', protectedRoute, getPersonDetails);

export default router;