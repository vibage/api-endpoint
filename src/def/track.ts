import { Document, Model, model, Schema } from "mongoose";

export interface ITrackModel extends Document {
  uri: string;
  addedBy: string;
  userId: string;
  addedAt: Date;
  id: string;
  artist: string;
  name: string;
  likes: number;
}

export let TrackSchema: Schema = new Schema({
  uri: String,
  id: String,
  name: String,
  artist: String,
  addedBy: String,
  userId: String,
  likes: Number,
});
TrackSchema.pre("save", function(next) {
  const now = new Date();
  if (!(this as ITrackModel).addedAt) {
    (this as ITrackModel).addedAt = now;
  }
  next();
});

export const Track: Model<ITrackModel> = model<ITrackModel>(
  "SpotifyTrack",
  TrackSchema,
);
