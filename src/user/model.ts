import { TrackLike } from "../def/trackLike";
import { IUser, User } from "../def/user";

// TODO: add JOI validation

export function createUser(uid: string, name: string) {
  const userPayload: IUser = {
    uid,
    name,
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
  });
  return user;
}

export async function setQueueState(userId: string, isOn: boolean) {
  const user = await User.findByIdAndUpdate(userId, {
    isOn,
  });
  return user;
}

export async function setPlayerState(id: string, player: string) {
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
  const query = {
    queuerId,
  };
  const likes = await TrackLike.find(query);
  return likes;
}

export async function addTokens(userId: string, tokens: number) {
  const user = await User.findByIdAndUpdate(userId, {
    $inc: { tokens },
  });
  return user;
}
