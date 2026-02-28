import express from "express";
import {
  deleteSong,
  downloadSong,
  getAllSongs,
  getSongBySlug,
  updateSong,
  upload,
} from "../controllers/song.js";
import auth from "../../middleware/auth.js";
import uploadFile from "../../config/multer.js";

const router = express.Router();

router.post(
  "/",
  auth,
  uploadFile.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  upload,
);
router.get("/", getAllSongs);
router.put(
  "/update/:id",
  auth,
  uploadFile.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  updateSong,
);
router.delete("/delete/:id", auth, deleteSong);
router.get("/:id/download", downloadSong);
router.get("/:slug", getSongBySlug);

export default router;
