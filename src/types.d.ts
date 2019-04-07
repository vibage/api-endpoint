interface IArtist {
  name: string;
}

interface ITrack {
  name: string;
  uri: string;
  id: string;
  explicit: boolean;
  artists: IArtist[];
}
