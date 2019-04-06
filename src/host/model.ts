import { Host } from "../def/host";

export async function createUser(
  name: string,
  spotifyId: string,
  aToken: string,
  rToken: string,
  playlistId: string,
  playlistURI: string,
) {
  const user = new Host({
    name,
    spotifyId,
    accessToken: aToken,
    refreshToken: rToken,
    playlistId,
    playlistURI,
  });
  await user.save();
  return user;
}

export function getUser(userId: string) {
  return Host.findById(userId);
}

export function getAllUsers() {
  return Host.find({});
}

export async function setTokens(id: string, aToken: string) {
  const user = await Host.findByIdAndUpdate(id, {
    accessToken: aToken,
  });
  return user;
}

export async function setPlayerState(id: string, player: any) {
  const user = await Host.findByIdAndUpdate(id, {
    player,
  });
  return user;
}

export async function getAccessToken(id: string) {
  const user = await Host.findById(id);
  if (user) {
    return user.accessToken;
  } else {
    throw new Error("User not found");
  }
}
