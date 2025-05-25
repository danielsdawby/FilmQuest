import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import noteRoutes from "./routes/note.route.js";
import watchListRoutes from "./routes/watchList.route.js";
import personRoutes from "./routes/person.route.js";

const PORT = process.env.PORT;
const FRONT_URL = process.env.FRONT_URL;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/note", noteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/watch-list", watchListRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/person", personRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  connectDB();
});
