import { Queuer } from "../def/queuer";
import { TrackLike } from "../def/trackLike";

export async function getQueuer(queuerId: string) {
  const queuer = Queuer.findOne({
    uid: queuerId,
  });
  return queuer;
}

export async function getLikes(queuerId: string) {
  const query = {
    queuerId,
  };
  const likes = await TrackLike.find(query);
  return likes;
}

export async function createQueuer(queuerId: string) {
  const queuer = new Queuer({
    uid: queuerId,
    tokens: 100,
  });
  await queuer.save();
  return queuer;
}

export async function getTokens(userId: string) {
  const query = {
    uid: userId,
  };
  const user = await Queuer.findOne(query);
  if (!user) {
    return null;
  }
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
