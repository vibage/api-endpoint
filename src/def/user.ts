import { Document, Model, model, Schema } from "mongoose";

// Might need to make another interface for a user who is a host
// where the optional field are required

export interface IUser {
  name: string;
  queueOn?: boolean;
  uid: string;
  spotifyId?: string;
  accessToken?: string;
  refreshToken?: string;
  currentVibe?: string;
  player?: IPlayerState;
  playlistId?: string;
  deviceId?: string;
  tokens: number;
}

export interface IUserModel extends Document, IUser {}

export const UserSchema: Schema = new Schema({
  name: String,
  uid: String,
  queueOn: Boolean,
  accessToken: String,
  refreshToken: String,
  spotifyId: String,
  currentVibe: String,
  player: Object,
  playlistId: String,
  deviceId: String,
  tokens: Number,
});

export const User: Model<IUserModel> = model<IUserModel>("user", UserSchema);
