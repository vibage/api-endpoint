export interface IVibe extends Document {
  hostId: string;
  genres: string;
  explicit: boolean;
  canUserAddTrack: boolean;
  playlistId: string;
  name: string;
}
