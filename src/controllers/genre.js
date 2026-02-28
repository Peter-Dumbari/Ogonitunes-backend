import { Genre } from "../models/genre.js";
import asyncHandler from "express-async-handler";

export const createGenre = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  try {
    const existingGenre = await Genre.findOne({ title });
    if (existingGenre)
      return res.status(400).json({
        message: "Genre with same name already exist",
        status: "error",
      });
    const genre = await Genre.create({
      title,
      description,
    });

    res.status(200).json({
      message: `${title} genre created successfully`,
      genre,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating genre", error });
  }
});

export const getAllGenres = asyncHandler(async (req, res) => {
  try {
    const genres = await Genre.find();
    res
      .status(200)
      .json({ message: "Genres retrieved", genres, status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve genres", error, status: "error" });
  }
});

export const updateGenre = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const genre = await Genre.findById(id);
    if (!genre)
      return res.status(404).json({ message: "Oga that genre no exit" });

    const updatedGenre = await Genre.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Genre updated!", status: "success", updatedGenre });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update genre", error, status: "error" });
  }
});

export const deleteGenre = asyncHandler(async (req, res) => {
  const id = req.params;

  try {
    const genre = Genre.findById(id);
    if (!genre)
      return res
        .status(404)
        .json({ message: "Genre not found", status: "error" });

    await Genre.findByIdAndDelete(id);
    res.status(200).json({ message: "Genre deleted", status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete genre", error, status: "error" });
  }
});
