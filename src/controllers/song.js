import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { Song } from "../models/song";
import cloudinary from "../../config/cloudinary";

export const upload = asyncHandler(async (req, res) => {
  const { title, artist, genre, year_release } = req.body;

  const image = req.files?.image;
  const audio = req.files?.audio;
  const slug = slugify(`${title} ${artist}`, {
    lower: true,
    strict: true,
  });

  try {
    const oldSong = await Song.findOne({ title });
    if (oldSong) {
      res.status(400);
      throw new Error("Song already exists");
    }
    const newSong = await Song.create({
      title,
      artist,
      genre,
      slug,
      year_release,
      image: {
        url: image[0].path,
        public_id: image[0].filename,
      },
      audio: {
        url: audio[0].path,
        public_id: audio[0].filename,
      },
    });

    return res.status(201).json({
      newSong,
      message: "Song uploaded successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to upload song",
      status: "error",
      error: error.message,
    });
  }
});

export const getAllSongs = asyncHandler(async (req, res) => {
  try {
    const songs = await Song.find()
      .populate("artist", "name")
      .populate("genre", "title");
    return res.status(200).json({
      songs,
      message: "Songs retrieved successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve songs",
      status: "error",
      error: error.message,
    });
  }
});

export const getSongBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const song = await Song.findOne({ slug })
      .populate("artist", "name")
      .populate("genre", "title");
    if (!song) {
      res.status(404);
      throw new Error("Song not found");
    }

    const relatedSongs = await Song.find({
      artist: song.artist._id,
      _id: { $ne: song._id },
    })
      .populate("artist", "name")
      .populate("genre", "title")
      .limit(6)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      song,
      relatedSongs,
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve song",
      status: "error",
      error: error.message,
    });
  }
});

export const updateSong = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, artist, genre, year_release, isBestOfWeek } = req.body;
  const slug = slugify(`${title} ${artist}`, {
    lower: true,
    strict: true,
  });

  try {
    const song = await Song.findById(id);
    if (!song) {
      res.status(404);
      throw new Error("Song not found");
    }

    song.title = title || song.title;
    song.artist = artist || song.artist;
    song.isBestOfWeek = isBestOfWeek || song.isBestOfWeek;
    song.genre = genre || song.genre;
    song.year_release = year_release || song.year_release;
    song.slug = slug || song.slug;

    const updatedSong = await song.save();

    return res.status(200).json({
      updatedSong,
      message: "Song updated successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update song",
      status: "error",
      error: error.message,
    });
  }
});

export const deleteSong = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const song = await Song.findById(id);
    if (!song) {
      res.status(404);
      throw new Error("Song not found");
    }

    await song.remove();

    if (song.image && song.image.public_id) {
      // delete image from cloudinary
      await cloudinary.uploader.destroy(song.image.public_id);
    }

    if (song.audio && song.audio.public_id) {
      // delete audio from cloudinary
      await cloudinary.uploader.destroy(song.audio.public_id, {
        resource_type: "auto", // VERY important for audio deletion
      });
    }

    return res.status(200).json({
      message: "Song deleted successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete song",
      error,
      status: "error",
    });
  }
});
