import { Document, Model, model, Schema } from "mongoose";

export interface IVibeModel extends Document {
  userId: string;
  trackId: string;
  likerId: string;
}

export const VibeSchema: Schema = new Schema({
  userId: String,
  likerId: String,
  trackId: String,
});

export const Vibe: Model<IVibeModel> = model<IVibeModel>(
  "vibe",
  VibeSchema,
);
