import { Document, Schema, Model, model } from "mongoose";

export interface ISpotifyUserModel extends Document {
  name: string;
  spotifyId: string;
  accessToken: string;
  refreshToken: string;
  playlistId: string;
  playlistURI: string;
}

export var SpotifyUserSchema: Schema = new Schema({
  name: String,
  accessToken: String,
  refreshToken: String,
  spotifyId: String,
  playlistId: String,
  playlistURI: String,
});

export const SpotifyUser: Model<ISpotifyUserModel> = model<ISpotifyUserModel>(
  "SpotifyUser",
  SpotifyUserSchema
);
