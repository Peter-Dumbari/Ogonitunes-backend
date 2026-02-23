import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "Ogonitune/others";

    // music files
    if (file.mimetype.startsWith("audio/")) {
      folder = "Ogonitune/music";
    }

    // images (covers, artists images, etc)
    if (file.mimetype.startsWith("image/")) {
      folder = "Ogonitune/images";
    }

    return {
      folder,
      resource_type: "auto", // VERY important for audio upload
    };
  },
});

const uploadFile = multer({ storage });
export default uploadFile;
