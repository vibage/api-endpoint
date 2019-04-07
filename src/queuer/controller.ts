import { createLogger } from "bunyan";
import * as QueuerModel from "./model";

const log = createLogger({
  name: "Queuer",
});

export async function getUserLikes(queuerId: string) {
  log.info(`Get Queuer Likes, queuerId=${queuerId}`);
  const likes = await QueuerModel.getLikes(queuerId);
  return likes;
}

export async function getQueuer(queuerId: string) {
  log.info(`Get Queuer qid=${queuerId}`);
  const queuer = await QueuerModel.getQueuer(queuerId);
  return queuer;
}

export function createQueuer(queuerId: string) {
  log.info(`Creating Queuer queueId: ${queuerId}`);
  return QueuerModel.createQueuer(queuerId);
}

export async function getUserTokens(queuerId: string) {
  log.info(`Getting Tokens: queuerId: ${queuerId}`);
  const tokens = await QueuerModel.getTokens(queuerId);
  return tokens;
}

export async function addUserTokens(userId: string, numTokens: number) {
  const user = await QueuerModel.addTokens(userId, numTokens);
  return user;
}

export async function removeUserTokens(queuerId: string, numTokens: number) {
  const tokens = await QueuerModel.getTokens(queuerId);
  if (!tokens) {
    return null;
  }

  if (tokens < numTokens) {
    throw new Error("Not enough tokens");
  }

  const user = await QueuerModel.addTokens(queuerId, -numTokens);
  return user;
}
