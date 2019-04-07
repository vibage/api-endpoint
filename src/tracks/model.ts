import { Track } from "../def/track";
import { TrackLike } from "../def/trackLike";
import * as QueuerController from "../queuer/controller";

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
  // create and save like
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

export async function unlikeTrack(trackId: string, queuerId: string) {
  await TrackLike.findOneAndDelete({
    trackId,
    queuerId,
  });

  await Track.findByIdAndUpdate(trackId, {
    $inc: { likes: -1 },
  });
}

export async function pay4Track(
  hostId: string,
  trackUri: string,
  queuerId: string,
) {
  // find queuer's tokens
  const user = await QueuerController.getQueuer(queuerId);

  if (!user) {
    return null;
  }

  if (user.tokens >= 1) {
    await QueuerController.removeUserTokens(queuerId, 1);
    const currTrack = await Track.findOneAndUpdate(
      {
        uri: trackUri,
        queuerId,
        hostId,
      },
      {
        $inc: { paid: 1 },
      },
    );

    return currTrack;
  }
  throw new Error("out of tokens");
}

export function removeTrack(hostId: string, trackUri: string) {
  return Track.findOneAndDelete({
    hostId,
    uri: trackUri,
  });
}

export async function getTracks(hostId: string) {
  const tracks = await Track.find({ hostId })
    .limit(15)
    .sort({ likes: -1 });
  return tracks;
}
