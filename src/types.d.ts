interface IArtist {
  name: string;
}

interface ITrack {
  name: string;
  uri: string;
  id: string;
  explicit: boolean;
  artist: string;
  popularity: number;
  imageUrl: string;
}

interface ISpotifyUser {
  display_name: string;
  id: string;
}

interface ISpotifyAuth {
  access_token: string;
  refresh_token: string;
  error?: any;
}

interface IPlayerState {
  duration: number;
  position: number;
  track_window: {
    current_track: {
      uri: string;
    };
  };
}
