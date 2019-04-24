import { IUserModel } from "../../def/user";
import { makeApiRequest } from "../../utils";

type UserData = IUserModel | string;

class SpotifyPlayer {
  public async getTrackData(trackId: string, user: UserData): Promise<ITrack> {
    const track: Spotify.Track = await makeApiRequest(
      `/v1/tracks/${trackId}`,
      "GET",
      user,
    );
    return this.toFormattedTrack(track);
  }

  public async search(query: string, user: UserData) {
    const result: { tracks: { items: Spotify.Track[] } } = await makeApiRequest(
      `/v1/search?q=${query}&type=track&userless=false&market=from_token&best_match=true`,
      "GET",
      user,
    );
    if (!result) {
      return [];
    }
    const tracks = result.tracks.items.map(this.toFormattedTrack);
    return tracks;
  }

  private toFormattedTrack(track: Spotify.Track): ITrack {
    return {
      name: track.name,
      uri: track.uri,
      id: track.id as string,
      explicit: track.explicit,
      artist: track.artists[0].name,
      popularity: track.popularity,
      imageUrl: track.album.images[0].url,
    };
  }
}

const Player = new SpotifyPlayer();
export default Player;
