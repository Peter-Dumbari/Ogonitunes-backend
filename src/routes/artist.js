import express from "express";
import auth from "../../middleware/auth";
import {
  deleteArtist,
  getAll,
  getById,
  registerArtist,
  update,
} from "../controllers/artist";
import uploadFile from "../../config/multer";

const router = express.Router();

router.post("/register", auth, uploadFile.single("image"), registerArtist);
router.put("/update", auth, uploadFile.single("image"), update);
router.get("/all", getAll);
router.get("/:id", getById);
router.delete("/:id", auth, deleteArtist);

export default router;
