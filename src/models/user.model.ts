import { Document, Model, model, Schema } from "mongoose";
import { IHost, IUser } from "../types/user";

interface IUserModel extends Document, IUser {}

const UserSchema: Schema = new Schema({
  name: String,
  uid: String,
  dateCreated: Date,
  queueOn: Boolean,
  accessToken: String,
  refreshToken: String,
  spotifyId: String,
  currentVibe: String,
  player: Object,
  queueWaitingForSong: Boolean,
  playlistId: String,
  deviceId: String,
  tokens: Number,
});

const User: Model<IUserModel> = model<IUserModel>("user", UserSchema);

export function createUser(uid: string, name: string) {
  const userPayload = {
    uid,
    name,
    dateCreated: new Date(),
    tokens: 100,
  };
  return new User(userPayload).save() as Promise<IUser>;
}

export async function getUser(userId: string): Promise<IUser | null> {
  const user = await User.findById(userId);
  return user;
}

export async function getUserByUid(uid: string): Promise<IUser | null> {
  const user = await User.findOne({
    uid,
  });
  return user;
}

export async function getUserBySpotId(
  spotifyId: string,
): Promise<IUser | null> {
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
  currentVibe: string,
): Promise<IUser | null> {
  const user = await User.findByIdAndUpdate(userId, {
    spotifyId,
    accessToken,
    refreshToken,
    currentVibe,
    queueOn: false,
  });
  return user;
}

export async function setQueueState(userId: string, queueOn: boolean) {
  await User.findByIdAndUpdate(userId, {
    queueOn,
  });
}

export async function setPlayerState(id: string, player: object | null) {
  await User.findByIdAndUpdate(id, {
    player,
  });
}

export async function setToken(
  id: string,
  aToken: string,
): Promise<IUser | null> {
  const user = await User.findByIdAndUpdate(id, {
    accessToken: aToken,
  });
  return user;
}

export async function setDeviceId(id: string, deviceId: string) {
  await User.findByIdAndUpdate(id, {
    deviceId,
  });
}

export async function getActiveHosts(): Promise<IUser[]> {
  const users = await User.find(
    {
      spotifyId: { $exists: true },
      queueOn: true,
    },
    "name id",
  );
  return users;
}

export async function addTokens(userId: string, tokens: number) {
  await User.findByIdAndUpdate(userId, {
    $inc: { tokens },
  });
}

export async function setVibe(userId: string, vibeId: string) {
  await User.findByIdAndUpdate(userId, {
    currentVibe: vibeId,
  });
}

export async function setPlaylistId(userId: string, playlistId: string) {
  await User.findByIdAndUpdate(userId, {
    playlistId,
  });
}

export async function setQueueWaitingForSong(userId: string, state: boolean) {
  await User.findOneAndUpdate(userId, {
    queueWaitingForSong: state,
  })
}
