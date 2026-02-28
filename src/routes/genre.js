import express from "express";
import {
  createGenre,
  deleteGenre,
  getAllGenres,
  updateGenre,
} from "../controllers/genre.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createGenre);
router.get("/all", getAllGenres);
router.put("/update/:id", auth, updateGenre);
router.delete("/delete/:id", auth, deleteGenre);

export default router;
