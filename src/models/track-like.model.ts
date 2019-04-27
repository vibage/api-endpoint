import { Document, Model, model, Schema } from "mongoose";
import { ITrackLike } from "../types/track-like";

type ITrackLikeModel = ITrackLike & Document;

const TrackLikeSchema: Schema = new Schema({
  hostId: String,
  queuerId: String,
  trackId: String,
});

const TrackLike: Model<ITrackLikeModel> = model<ITrackLikeModel>(
  "like",
  TrackLikeSchema,
);

export async function likeTrack(
  hostId: string,
  queuerId: string,
  trackId: string,
) {
  const like = new TrackLike({
    hostId,
    trackId,
    queuerId,
  });
  await like.save();

  return like;
}

export async function getLikesForUser(queuerId: string) {
  const likes = await TrackLike.find({
    queuerId,
  });
  return likes;
}

export async function getLikes(trackId: string) {
  const likes = TrackLike.find({ trackId });
  return likes;
}

export async function unlikeTrack(queuerId: string, trackId: string) {
  await TrackLike.findOneAndDelete({
    trackId,
    queuerId,
  });
}
