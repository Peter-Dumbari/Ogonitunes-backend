import asyncHandler from "express-async-handler";
import { Artist } from "../models/artist.js";
import { Song } from "../models/song.js";
import cloudinary from "../../config/cloudinary.js";

export const registerArtist = asyncHandler(async (req, res) => {
  const { name, full_name, description } = req.body;

  const image = req.file;

  const existedName = await Artist.findOne({ name });
  if (existedName) {
    res.status(400);
    throw new Error("Name already taken");
  }

  const newArtist = await Artist.create({
    name,
    full_name,
    description,
    image: {
      url: image.path,
      public_id: image.filename,
    },
  });

  if (newArtist) {
    res.status(201).json({
      _id: newArtist._id,
      name: newArtist.name,
      full_name: newArtist.full_name,
      description: newArtist.description,
      image: newArtist.image,
      status: "Success",
    });
  } else {
    res.status(400);
    throw new Error("Invalid artist data");
  }
});

export const update = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const file = req.file;

  const artist = await Artist.findOne({ email }).populate("songs");

  if (!artist) {
    res.status(404);
    throw new Error("Artist not found");
  }

  // ✅ delete old image if new one is uploaded
  if (file && artist.image?.public_id) {
    await cloudinary.uploader.destroy(artist.image.public_id);
  }

  // ✅ prepare update object
  const updateData = {
    ...req.body,
  };

  // ✅ if new image was uploaded
  if (file) {
    updateData.image = {
      url: file.path,
      public_id: file.filename,
    };
  }

  const updatedArtist = await Artist.findByIdAndUpdate(artist._id, updateData, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    artist: updatedArtist,
  });
});

export const getAll = asyncHandler(async (req, res) => {
  const artists = await Artist.find();
  if (artists) {
    res.status(200).json({
      artists,
      status: "Success",
    });
  } else {
    res.status(404).json({
      message: "No artists found",
      status: "Error",
    });
  }
});

export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const artist = await Artist.findById(id);
  const songs = await Song.find({ artist: id }).populate("genre", "title");
  if (artist) {
    res.status(200).json({
      artist,
      songs,
      status: "Success",
    });
  } else {
    res.status(404).json({
      message: "Artist not found",
      status: "Error",
    });
  }
});

export const deleteArtist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const artist = await Artist.findById(id);

  if (!artist) {
    res.status(404).json({
      message: "Artist not found",
      status: "Error",
    });
  }

  if (artist.image && artist.image.public_id) {
    await cloudinary.uploader.destroy(artist.image.public_id);
  }

  await Artist.findByIdAndDelete(id);
  res.status(200).json({
    message: "Artist deleted successfully",
    status: "Success",
  });
});
