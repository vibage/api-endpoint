import { Document, Model, model, Schema } from "mongoose";
import { IHost, IUser } from "../types/user";

interface IUserModel extends Document, IHost {}

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
  playlistId: String,
  deviceId: String,
  tokens: Number,
});

const User: Model<IUserModel> = model<IUserModel>("user", UserSchema);

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
  currentVibe: string,
) {
  const user = await User.findByIdAndUpdate(userId, {
    spotifyId,
    accessToken,
    refreshToken,
    currentVibe,
  });
  return user;
}

export async function setQueueState(userId: string, isOn: boolean) {
  const user = await User.findByIdAndUpdate(userId, {
    isOn,
  });
  return user;
}

export async function setPlayerState(id: string, player: object | null) {
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

export function setPlaylistId(userId: string, playlistId: string) {
  return User.findByIdAndUpdate(userId, {
    playlistId,
  });
}
