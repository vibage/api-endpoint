import { TrackLike } from "../def/trackLike";

export async function getLikes(userId: string) {
  const query = {
    userId,
  };
  const likes = await TrackLike.find(query);
  return likes;
}
