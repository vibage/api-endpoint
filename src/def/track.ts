import { Document, Model, model, Schema } from "mongoose";

export interface ITrackModel extends Document {
  uri: string;
  addedBy: string;
  hostId: string;
  addedAt: Date;
  id: string;
  artist: string;
  name: string;
  likes: number;
  trackData: string;
}

export let TrackSchema: Schema = new Schema({
  uri: String,
  id: String,
  name: String,
  artist: String,
  addedBy: String,
  hostId: String,
  likes: Number,
  trackData: String,
});

TrackSchema.pre("save", function(next) {
  const now = new Date();
  if (!(this as ITrackModel).addedAt) {
    (this as ITrackModel).addedAt = now;
  }
  next();
});

export const Track: Model<ITrackModel> = model<ITrackModel>(
  "track",
  TrackSchema,
);
