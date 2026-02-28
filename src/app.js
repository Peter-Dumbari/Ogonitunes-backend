import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

import artistRoutes from "./routes/artist.js";
import genreRoutes from "./routes/genre.js";
import songRoutes from "./routes/song.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/artist", artistRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/song", songRoutes);

export default app;
