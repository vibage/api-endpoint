import { TrackLike } from "../def/trackLike";
import { Queuer } from "../def/queuer";
export async function getLikes(userId: string) {
  const query = {
    userId,
  };
  const likes = await TrackLike.find(query);
  return likes;
}

export async function getTokens(userId: string) {
  const query = {
    uid: userId,
  };
  const user = await Queuer.findOne(query);
  return user.tokens;
}

export async function addTokens(userId: string, numTokens: number) {
  // add one like to the model
  const user = await Queuer.findOneAndUpdate(
    {
      uid: userId,
    },
    {
      $inc: { tokens: numTokens },
    },
  );
  return user;
}
