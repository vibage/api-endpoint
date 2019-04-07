import { Document, Model, model, Schema } from "mongoose";

export interface IHostModel extends Document {
  name: string;
  spotifyId: string;
  accessToken: string;
  refreshToken: string;
  vibeId: string;
  player: string;
}

export const HostSchema: Schema = new Schema({
  name: String,
  accessToken: String,
  refreshToken: String,
  spotifyId: String,
  vibeId: String,
  player: String,
});

export const Host: Model<IHostModel> = model<IHostModel>("host", HostSchema);
