import { Document, Model, model, Schema } from "mongoose";
import { ITrack, ITrackExtended } from "../types/track";

type ITrackModel = ITrackExtended & Document;

const TrackSchema: Schema = new Schema({
  name: String,
  uri: String,
  explicit: Boolean,
  artist: String,
  popularity: Number,
  imageUrl: String,
  deleted: Boolean,
  likes: Number,
  hostId: String,
  addedBy: String,
  addedAt: Date,
});

const Track: Model<ITrackModel> = model<ITrackModel>("track", TrackSchema);

export function getTrack(trackId: string) {
  return Track.findById(trackId);
}

export function addTrack(hostId: string, trackData: ITrack, addedBy: string) {
  delete trackData._id;
  const track = new Track({
    ...trackData,
    hostId,
    addedBy,
    likes: 0,
    deleted: false,
    addedAt: new Date(),
  });
  return track.save();
}

export async function incrementTrackLike(trackId: string, amount: number) {
  const track = await Track.findByIdAndUpdate(trackId, {
    $inc: { likes: amount },
  });
  return track;
}

// Make a delete flag instead of actually deleting
export function removeTrack(trackId: string) {
  return Track.findByIdAndDelete(trackId);
}

export function clearQueue(hostId: string) {
  return Track.deleteMany({
    hostId,
  });
}

export async function getTracks(hostId: string) {
  const tracks = await Track.find({ hostId })
    .limit(50)
    .sort({ likes: -1 });
  return tracks;
}

export async function getQueuedTrackByUri(hostId: string, uri: string) {
  const tracks = await Track.find({ hostId, uri });
  return tracks;
}
