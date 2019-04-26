import { IUserModel } from "../../def/user";
import { makeApiRequest } from "../../utils";

type UserData = IUserModel | string;

class SpotifyPlayer {
  public ITrack;
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
    if (!result || !result.tracks) {
      return [];
    }
    const tracks = result.tracks.items.map(this.toFormattedTrack);
    return tracks;
  }

  public play(
    user: UserData,
    deviceId: string,
    trackUri?: string,
    position?: number,
  ) {
    const payload: any = {
      uris: [trackUri],
    };
    if (position) {
      payload.position_ms = position;
    }

    if (!trackUri) {
      return makeApiRequest(
        `/v1/me/player/play?device_id=${deviceId}`,
        "PUT",
        user,
      );
    }
    return makeApiRequest(
      `/v1/me/player/play?device_id=${deviceId}`,
      "PUT",
      user,
      payload,
    );
  }

  public pause(user: UserData) {
    return makeApiRequest("/v1/me/player/pause", "PUT", user);
  }

  public async getPlaylistTracks(user: UserData, playlistId: string) {
    const res: {
      tracks: { items: Array<{ track: Spotify.Track }> };
    } = await makeApiRequest(`/v1/playlists/${playlistId}`, "GET", user);
    return res.tracks.items.map((track) => this.toFormattedTrack(track.track));
  }

  private toFormattedTrack(track: Spotify.Track) {
    return {
      name: track.name,
      uri: track.uri,
      _id: track.id as string,
      explicit: track.explicit,
      artist: track.artists[0].name,
      popularity: track.popularity,
      imageUrl: track.album.images[0].url,
    };
  }
}

const Player = new SpotifyPlayer();
export default Player;
