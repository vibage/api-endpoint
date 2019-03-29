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
    likes: 0,
  });
  await track.save();
  return track;
}

export async function likeTrack(
  userId: string,
  likerId: string,
  trackUri: string,
) {
  // create and save like
  const like = new TrackLike({
    userId,
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

export function removeTrack(userId: string, trackUri: string) {
  return Track.findOneAndDelete({
    userId,
    uri: trackUri,
  });
}

export async function getTracks(userId: string) {
  const tracks = await Track.find({ userId })
    .limit(10)
    .sort({ likes: -1 });

  return tracks;
}
