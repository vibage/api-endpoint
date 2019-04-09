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

interface ISpotifyUser {
  display_name: string;
  id: string;
}

interface ISpotifyAuth {
  access_token: string;
  refresh_token: string;
}
