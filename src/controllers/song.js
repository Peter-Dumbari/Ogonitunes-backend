import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { Song } from "../models/song.js";
import cloudinary from "../../config/cloudinary.js";
import { Artist } from "../models/artist.js";
import axios from "axios";

export const upload = asyncHandler(async (req, res) => {
  const { title, artist, genre, year_release } = req.body;

  const artistName = await Artist.findById(artist);

  const image = req.files?.image;
  const audio = req.files?.audio;
  const slug = slugify(`${title} ${artistName?.name}`, {
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

export const downloadSong = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const song = await Song.findById(id).populate("artist", "name");
  if (!song)
    return res.status(404).json({ message: "Song not found", status: "error" });

  const fileUrl = song.audio.url;

  const filename =
    `${song.title} - ${song.artist.name} | Ogonitunes.mp3`.replace(
      /[^\w\d\s.-]/g,
      "",
    );

  const response = await axios.get(fileUrl, {
    responseType: "stream",
  });

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  res.setHeader("Content-Type", "audio/mpeg");

  song.download_count = (song.download_count || 0) + 1;
  await song.save();

  response.data.pipe(res);
});
export const deleteSong = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const song = await Song.findById(id);

  if (!song) {
    res.status(404);
    throw new Error("Song not found");
  }

  // delete image
  if (song.image?.public_id) {
    await cloudinary.uploader.destroy(song.image.public_id);
  }

  // delete audio (very important: resource_type)
  if (song.audio?.public_id) {
    await cloudinary.uploader.destroy(song.audio.public_id, {
      resource_type: "video", // Cloudinary stores audio as video
    });
  }

  await song.deleteOne();

  res.status(200).json({
    message: "Song deleted successfully",
    status: "success",
  });
});
