import { Document, Model, model, Schema } from "mongoose";
import { IVibe } from "../types/vibe";

type IVibeModel = IVibe & Document;

const VibeSchema: Schema = new Schema({
  hostId: String,
  genres: String,
  explicit: Boolean,
  canUserAddTrack: Boolean,
  playlistId: String,
  name: String,
});

const Vibe: Model<IVibeModel> = model<IVibeModel>("vibe", VibeSchema);

export async function createVibe(
  name: string,
  explicit: boolean,
  canUserAddTrack: boolean,
) {
  const vibe = new Vibe({
    genres: "all",
    explicit,
    name,
    canUserAddTrack,
  });
  await vibe.save();
  return vibe;
}

export async function removeVibe(vibeId: string) {
  return await Vibe.findByIdAndDelete(vibeId);
}

export function getVibe(vibeId: string) {
  return Vibe.findById(vibeId);
}

export function getVibeByName(name: string) {
  return Vibe.findOne({ name });
}

export function setGenera(vibeId: string, genres: string) {
  return Vibe.findByIdAndUpdate(vibeId, {
    genres,
  });
}

export function setExplicit(vibeId: string, explicit: boolean) {
  return Vibe.findByIdAndUpdate(vibeId, {
    explicit,
  });
}

export function getAll() {
  return Vibe.find({});
}
