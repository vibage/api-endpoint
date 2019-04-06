import { Document, Model, model, Schema } from "mongoose";

export interface ITrackLikeModel extends Document {
  hostId: string;
  trackId: string;
  queuerId: string;
}

export const TrackLikeSchema: Schema = new Schema({
  hostId: String,
  queuerId: String,
  trackId: String,
});

export const TrackLike: Model<ITrackLikeModel> = model<ITrackLikeModel>(
  "like",
  TrackLikeSchema,
);
