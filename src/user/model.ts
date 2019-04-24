import { TrackLike } from "../def/trackLike";
import { IUser, User } from "../def/user";

// TODO: add JOI validation

export function createUser(uid: string, name: string) {
  const userPayload: IUser = {
    uid,
    name,
    dateCreated: new Date(),
    tokens: 100,
  };
  return new User(userPayload).save();
}

export function getUser(userId: string) {
  return User.findById(userId);
}

export function getUserByUid(uid: string) {
  return User.findOne({
    uid,
  });
}

export async function getUserBySpotId(spotifyId: string) {
  const user = await User.findOne({
    spotifyId,
  });
  return user;
}

export async function setSpotifyData(
  userId: string,
  spotifyId: string,
  accessToken: string,
  refreshToken: string,
) {
  const user = await User.findByIdAndUpdate(userId, {
    spotifyId,
    accessToken,
    refreshToken,
    currentVibe: "5cacf99fe841dc03f351150e", // this is the default vibe
  });
  return user;
}

export async function setQueueState(userId: string, isOn: boolean) {
  const user = await User.findByIdAndUpdate(userId, {
    isOn,
  });
  return user;
}

export async function setPlayerState(id: string, player: object) {
  const user = await User.findByIdAndUpdate(id, {
    player,
  });
  return user;
}

export async function setToken(id: string, aToken: string) {
  const user = await User.findByIdAndUpdate(id, {
    accessToken: aToken,
  });
  return user;
}

export async function setDeviceId(id: string, deviceId: string) {
  const user = await User.findByIdAndUpdate(id, {
    deviceId,
  });
  return user;
}

export async function getActiveHosts() {
  const users = await User.find(
    {
      spotifyId: { $exists: true },
    },
    "name id",
  );
  return users;
}

export async function getLikes(queuerId: string) {
  const likes = await TrackLike.find({
    queuerId,
  });
  return likes;
}

export async function addTokens(userId: string, tokens: number) {
  const user = await User.findByIdAndUpdate(userId, {
    $inc: { tokens },
  });
  return user;
}

export async function setVibe(userId: string, vibeId: string) {
  const user = await User.findByIdAndUpdate(userId, {
    currentVibe: vibeId,
  });
  return user;
}
