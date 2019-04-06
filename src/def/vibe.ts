import { Document, Model, model, Schema } from "mongoose";

export interface IVibeModel extends Document {
  hostId: string;
  vibeId: string
  genres: string;
  explicit: string;
  pricing: string;
  defaultPlaylist: string;
  name: string;
}

export const VibeSchema: Schema = new Schema({
    hostId: string;
    vibeId: string
    genres: string;
    explicit: string;
    pricing: string;
    defaultPlaylist: string;
    name: string;
});

export const Vibe: Model<IVibeModel> = model<IVibeModel>(
  "vibe",
  VibeSchema,
);
