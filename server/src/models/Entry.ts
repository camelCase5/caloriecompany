// mongoose model for entries stored in mongodb
import { Schema, model } from "mongoose";

const EntrySchema = new Schema(
  {
    date: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, default: 0, min: 0 },
    carbs:   { type: Number, default: 0, min: 0 },
    fat:     { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// mongoose model used by routes
export const Entry = model("Entry", EntrySchema);
