import { Track } from "../def/track";
import { TrackLike } from "../def/trackLike";

export function getTrack(trackId: string) {
  return Track.findById(trackId);
}

export async function addTrack(
  hostId: string,
  trackData: ITrack,
  addedBy: string,
) {
  const track = new Track({
    hostId,
    addedBy,
    uri: trackData.uri,
    artist: trackData.artist,
    name: trackData.name,
    imageUrl: trackData.imageUrl,
    likes: 0,
  });
  await track.save();
  return track;
}

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

  // add one like to the model
  await Track.findByIdAndUpdate(trackId, {
    $inc: { likes: 1 },
  });

  return like;
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

  await Track.findByIdAndUpdate(trackId, {
    $inc: { likes: -1 },
  });
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
