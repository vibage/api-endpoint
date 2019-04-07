import { Document, Model, model, Schema } from "mongoose";

export interface IVibeModel extends Document {
  hostId: string;
  genres: string;
  explicit: boolean;
  pricing: string;
  defaultPlaylist: string;
  name: string;
}

export const VibeSchema: Schema = new Schema({
  hostId: String,
  genres: String,
  explicit: Boolean,
  pricing: String,
  defaultPlaylist: String,
  name: String,
});

export const Vibe: Model<IVibeModel> = model<IVibeModel>("vibe", VibeSchema);
