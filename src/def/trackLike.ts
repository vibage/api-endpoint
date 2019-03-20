import { Document, Model, model, Schema } from "mongoose";

export interface ITrackLikeModel extends Document {
  userId: string;
  trackUri: string;
  likerId: string;
}

export const TrackLikeSchema: Schema = new Schema({
  userId: String,
  likerId: String,
  trackUri: String,
});

export const TrackLike: Model<ITrackLikeModel> = model<ITrackLikeModel>(
  "TrackLike",
  TrackLikeSchema,
);
