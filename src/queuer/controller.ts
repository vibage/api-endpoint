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
