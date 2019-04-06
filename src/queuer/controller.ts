import * as model from "./model";

export async function getUserLikes(userId: string) {
  const likes = await model.getLikes(userId);
  return likes;
}
