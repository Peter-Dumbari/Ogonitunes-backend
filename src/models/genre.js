import mongoose from "mongoose";

const genreSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Genre = mongoose.model("genre", genreSchema);
