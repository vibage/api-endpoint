import fetch from "node-fetch";
import { ITrack } from "../../types/track";
import { IHost, IUser } from "../../types/user";
import { makeApiRequest } from "../../utils";

export const clientId = "a7e126eaee8b4c6f9e689a8b3b15efa5";
export const clientSecret = "7de3ad7d3a6a4669926a627b5c4588a8";

class SpotifyPlayer {
  public async getTrackData(trackId: string, user: IUser): Promise<ITrack> {
    const track: Spotify.Track = await makeApiRequest(
      `/v1/tracks/${trackId}`,
      "GET",
      user,
    );
    return this.toFormattedTrack(track);
  }

  public async search(query: string, user: IUser) {
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
    user: IUser,
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

  public pause(user: IUser) {
    return makeApiRequest("/v1/me/player/pause", "PUT", user);
  }

  public async getPlaylistTracks(user: IUser, playlistId: string) {
    const res: {
      tracks: { items: Array<{ track: Spotify.Track }> };
    } = await makeApiRequest(`/v1/playlists/${playlistId}`, "GET", user);
    return res.tracks.items.map((track) => this.toFormattedTrack(track.track));
  }

  public async getProfile(accessToken: string) {
    const userDataRes = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const spotifyUser: ISpotifyUser = await userDataRes.json();
    return spotifyUser;
  }

  public async authorize(code: string) {
    const redirectUri = encodeURIComponent("https://fizzle.tgt101.com");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      body:
        `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}` +
        `&client_id=${clientId}&client_secret=${clientSecret}`,
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
    const tokens: ISpotifyAuth = await response.json();
    if (tokens.error) {
      throw new Error("Spotify Auth Expired");
    }
    return tokens;
  }

  public async refreshToken(user: IUser) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      body: `grant_type=refresh_token&refresh_token=${
        (user as IHost).refreshToken
      }&client_id=${clientId}&client_secret=${clientSecret}`,
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
    const data: ISpotifyAuth = await response.json();
    return data;
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
