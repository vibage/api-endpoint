import { Track } from "../def/track";
import { TrackLike } from "../def/trackLike";

export async function addTrack(
  hostId: string,
  trackData: ITrack,
  addedBy: string,
) {
  const track = new Track({
    hostId,
    addedBy,
    uri: trackData.uri,
    artist: trackData.artists[0].name,
    name: trackData.name,
    likes: 0,
    trackData: JSON.stringify(trackData),
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

export async function unlikeTrack(queuerId: string, trackId: string) {
  await TrackLike.findOneAndDelete({
    trackId,
    queuerId,
  });

  await Track.findByIdAndUpdate(trackId, {
    $inc: { likes: -1 },
  });
}

export function removeTrack(trackId: string) {
  return Track.findByIdAndDelete(trackId);
}

export async function getTracks(hostId: string) {
  const tracks = await Track.find({ hostId })
    .limit(15)
    .sort({ likes: -1 });
  return tracks;
}
