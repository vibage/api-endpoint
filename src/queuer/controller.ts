import * as model from "./model";

export async function getUserLikes(userId: string) {
  const likes = await model.getLikes(userId);
  return likes;
}

export async function getUserTokens(userId: string) {
  const tokens = await model.getTokens(userId);
  return tokens;
}

export async function addUserTokens(userId: string, numTokens: number) {
  const user = await model.addTokens(userId, numTokens);
  return user;
}

export async function removeUserTokens(userId: string, numTokens: number) {
  const user = await model.addTokens(userId, -numTokens);
  return user;
}