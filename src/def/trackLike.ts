import { Document, Model, model, Schema } from "mongoose";

export interface ITrackLikeModel extends Document {
  userId: string;
  trackId: string;
  likerId: string;
}

export const TrackLikeSchema: Schema = new Schema({
  userId: String,
  likerId: String,
  trackId: String,
});

export const TrackLike: Model<ITrackLikeModel> = model<ITrackLikeModel>(
  "like",
  TrackLikeSchema,
);
