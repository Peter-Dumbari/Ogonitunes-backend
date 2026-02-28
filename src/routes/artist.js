import express from "express";
import auth from "../../middleware/auth.js";
import {
  deleteArtist,
  getAll,
  getById,
  registerArtist,
  update,
} from "../controllers/artist.js";
import uploadFile from "../../config/multer.js";

const router = express.Router();

router.post("/register", auth, uploadFile.single("image"), registerArtist);
router.put("/update", auth, uploadFile.single("image"), update);
router.get("/all", getAll);
router.get("/:id", getById);
router.delete("/:id", auth, deleteArtist);

export default router;
