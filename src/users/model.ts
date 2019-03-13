import { SpotifyUser } from "../def/spotifyUser";

export async function createUser (name: string, spotifyId: string, aToken: string, rToken: string, playlistId: string, playlistURI: string) {
  const user = new SpotifyUser({
    name,
    spotifyId,
    accessToken: aToken,
    refreshToken: rToken,
    playlistId,
    playlistURI
  });
  await user.save();
  return user;
}

export function getUser (userId: string) {
  return SpotifyUser.findById(userId);
}

export async function setTokens(id: string, aToken: string) {
  const user = await SpotifyUser.findByIdAndUpdate(id, {
    accessToken: aToken,
  });
  return user;
}

export async function getAccessToken(id: string) {
  const user = await SpotifyUser.findById(id);
  if (user) {
    return user.accessToken;
  } else {
    throw new Error("User not found");
  }
}

