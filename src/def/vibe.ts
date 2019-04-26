import { Document, Model, model, Schema } from "mongoose";

export interface IVibeModel extends Document {
  hostId: string;
  genres: string;
  explicit: boolean;
  canUserAddTrack: boolean;
  playlistId: string;
  name: string;
}

export const VibeSchema: Schema = new Schema({
  hostId: String,
  genres: String,
  explicit: Boolean,
  canUserAddTrack: Boolean,
  playlistId: String,
  name: String,
});

export const Vibe: Model<IVibeModel> = model<IVibeModel>("vibe", VibeSchema);
