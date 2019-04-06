import { Track } from "../def/track";
import { TrackLike } from "../def/trackLike";

export async function addTrack(
  hostId: string,
  trackData: ITrack,
  queuerId: string,
) {
  const track = new Track({
    hostId,
    queuerId,
    uri: trackData.uri,
    id: trackData.id,
    artist: trackData.artists[0].name,
    name: trackData.name,
    likes: 0,
  });
  await track.save();
  return track;
}

export async function likeTrack(
  hostId: string,
  likerId: string,
  trackUri: string,
) {
  // create and save like
  const like = new TrackLike({
    hostId,
    trackUri,
    likerId,
  });
  await like.save();

  // add one like to the model
  await Track.findOneAndUpdate(
    {
      uri: trackUri,
    },
    {
      $inc: { likes: 1 },
    },
  );

  return like;
}

export function removeTrack(hostId: string, trackUri: string) {
  return Track.findOneAndDelete({
    hostId,
    uri: trackUri,
  });
}

export async function getTracks(hostId: string) {
  const tracks = await Track.find({ hostId })
    .limit(10)
    .sort({ likes: -1 });

  return tracks;
}
