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
  });
  await queuer.save();
  return queuer;
}
