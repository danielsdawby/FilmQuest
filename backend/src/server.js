import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();

import { connectDB } from "./lib/db.js";
import authRoutes from './routes/auth.route.js';
import movieRoutes from './routes/movie.route.js';
import noteRoutes from './routes/note.route.js';

const PORT = process.env.PORT;
const FRONT_URL = process.env.FRONT_URL;

const app = express();
app.use(express.json()); 
app.use(cookieParser());
app.use(
    cors({
        origin: FRONT_URL,
        credentials: true,
      })
);


app.use('/api/auth', authRoutes);
app.use('/api/movie', movieRoutes);
app.use('/api/note', noteRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
    connectDB();
});