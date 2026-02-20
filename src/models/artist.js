import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    full_name: {
      type: String,
      require: true,
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    description: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Artist = mongoose.model("artist", artistSchema);
