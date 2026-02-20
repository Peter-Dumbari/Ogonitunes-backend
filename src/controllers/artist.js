import asyncHandler from "express-async-handler";
import { Artist } from "../models/artist";

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

  const artist = await Artist.findOne({ email });
  if (!artist)
    return res
      .status(404)
      .json({ message: "Artist not found", status: "error" });

  const updateArtist = Artist.findByIdAndUpdate(artist._id, req.body, {
    new: true,
  });

  if (updateArtist) {
    res.status(200).json({
      _id: updateArtist._id,
      name: updateArtist.name,
      full_name: updateArtist.full_name,
      description: updateArtist.description,
      image: updateArtist.image,
      status: "Success",
    });
  }
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
  if (artist) {
    res.status(200).json({
      artist,
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
  } else {
    await Artist.findByIdAndDelete(id);
    res.status(200).json({
      message: "Artist deleted successfully",
      status: "Success",
    });
  }
});
