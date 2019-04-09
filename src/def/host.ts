import { Document, Model, model, Schema } from "mongoose";

export interface IHostModel extends Document {
  name: string;
  uid: string;
  spotifyId: string;
  accessToken: string;
  refreshToken: string;
  currentVibe: string;
  player: string;
}

export const HostSchema: Schema = new Schema({
  name: String,
  uid: String,
  accessToken: String,
  refreshToken: String,
  spotifyId: String,
  currentVibe: String,
  player: String,
});

export const Host: Model<IHostModel> = model<IHostModel>("host", HostSchema);
