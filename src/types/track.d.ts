export interface ITrack {
  name: string;
  uri: string;
  _id: string;
  explicit: boolean;
  artist: string;
  popularity: number;
  imageUrl: string;
}

export interface ITrackExtended extends ITrack {
  deleted: boolean;
  likes: number;
  hostId: string;
  addedBy: string;
  addedAt: Date;
}
