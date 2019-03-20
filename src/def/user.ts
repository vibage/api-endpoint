import { Document, Model, model, Schema } from "mongoose";

export interface IUserModel extends Document {
  name: string;
  spotifyId: string;
  accessToken: string;
  refreshToken: string;
  playlistId: string;
  playlistURI: string;
}

export const UserSchema: Schema = new Schema({
  name: String,
  accessToken: String,
  refreshToken: String,
  spotifyId: String,
  playlistId: String,
  playlistURI: String,
});

export const SpotifyUser: Model<IUserModel> = model<IUserModel>(
  "SpotifyUser",
  UserSchema,
);
