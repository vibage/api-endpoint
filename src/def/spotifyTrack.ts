import { Document, Schema, Model, model } from "mongoose";

export interface ISpotifyTrackModel extends Document {
  uri: string;
  addedBy: string;
  userId: string;
  addedAt: Date;
  id: string;
  artist: string;
  name: string;
}

export var SpotifyTrackSchema: Schema = new Schema({
  uri: String,
  id: String,
  name: String,
  artist: String,
  addedBy: String,
  userId: String,
});

SpotifyTrackSchema.pre("save", function(next) {
  let now = new Date();
  if (!(this as ISpotifyTrackModel).addedAt) {
    (this as ISpotifyTrackModel).addedAt = now;
  }
  next();
});

export const SpotifyTrack: Model<ISpotifyTrackModel> = model<ISpotifyTrackModel>(
  "SpotifyTrack",
  SpotifyTrackSchema
);
