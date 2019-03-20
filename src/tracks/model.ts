import { Track } from "../def/track";
import { TrackLike } from "../def/trackLike";

export async function addTrack(
  userId: string,
  trackData: ITrack,
  ipAddress: string,
) {
  const track = new Track({
    userId,
    addedBy: ipAddress,
    uri: trackData.uri,
    id: trackData.id,
    artist: trackData.artists[0].name,
    name: trackData.name,
  });
  await track.save();
  return track;
}

export async function likeTrack(
  userId: string,
  likerId: string,
  trackUri: string,
) {
  const like = new TrackLike({
    userId,
    trackUri,
    likerId,
  });
  await like.save();
  return like;
}

export function removeTrack(userId: string, trackUri: string) {
  return Track.findOneAndDelete({
    userId,
    uri: trackUri,
  });
}

export async function getTracks(userId: string) {
  const tracks = await Track.find({
    userId,
  });
  return tracks;
}
