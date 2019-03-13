import { SpotifyTrack } from "../def/spotifyTrack"

export async function addTrack(userId: string, trackData: ITrack, ipAddress: string) {
  const track = new SpotifyTrack({
    userId,
    addedBy: ipAddress,
    uri: trackData.uri,
    id: trackData.id,
    artist: trackData.artists[0].name,
    name: trackData.name
  })
  await track.save();
  return track;
}

export function removeTrack(userId: string, trackUri: string) {
  return SpotifyTrack.findOneAndDelete({
    userId,
    uri: trackUri
  })
}

export async function getTracks(userId: string) {
  const tracks = await SpotifyTrack.find({
    userId
  });
  return tracks;
}
