import mongoose from "mongoose";

const songSchema = mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "artist",
      required: true,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "genre",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    audio: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    year_release: {
      type: Number,
      required: true,
    },
    download_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Song = mongoose.model("song", songSchema);
