import { Vibe } from "../def/vibe";

export async function createVibe(hostId: string) {
  const vibe = new Vibe({
    hostId,
    genres: "all",
    explicit: false,
    pricing: 0,
    defaultPlaylist: "",
    name: "Default",
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
