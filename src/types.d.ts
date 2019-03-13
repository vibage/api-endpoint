interface IArtist {
  name: string
}

interface ITrack {
  name: string;
  uri: string;
  id: string;
  artists: IArtist[]
}
