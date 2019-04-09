import { Host } from "../def/host";

export async function createUser(
  name: string,
  uid: string,
  spotifyId: string,
  aToken: string,
  rToken: string,
  vibeId: string,
) {
  const user = new Host({
    name,
    uid,
    spotifyId,
    vibeId,
    accessToken: aToken,
    refreshToken: rToken,
  });
  await user.save();
  return user;
}

export function getUser(userId: string) {
  return Host.findById(userId);
}

export function getHostByUid(uid: string) {
  return Host.findOne({
    uid,
  });
}

export async function doesSpotifyIdExist(spotifyId: string) {
  const host = await Host.find({
    spotifyId,
  });
  return host[0];
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
