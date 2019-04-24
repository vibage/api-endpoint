declare namespace Spotify {
  const Player: typeof SpotifyPlayer;

  interface Album {
    uri: string;
    name: string;
    images: Image[];
  }

  interface Artist {
    name: string;
    uri: string;
  }

  interface Error {
    message: string;
  }

  type ErrorTypes =
    | "account_error"
    | "authentication_error"
    | "initialization_error"
    | "playback_error";

  interface Image {
    url: string;
  }

  interface PlaybackContext {
    metadata: any;
    uri: string | null;
  }

  interface PlaybackDisallows {
    pausing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  }

  interface PlaybackRestrictions {
    disallow_pausing_reasons: string[];
    disallow_peeking_next_reasons: string[];
    disallow_peeking_prev_reasons: string[];
    disallow_resuming_reasons: string[];
    disallow_seeking_reasons: string[];
    disallow_skipping_next_reasons: string[];
    disallow_skipping_prev_reasons: string[];
  }

  interface PlaybackState {
    context: PlaybackContext;
    disallows: PlaybackDisallows;
    duration: number;
    paused: boolean;
    position: number;
    /**
     * 0: NO_REPEAT
     * 1: ONCE_REPEAT
     * 2: FULL_REPEAT
     */
    repeat_mode: 0 | 1 | 2;
    shuffle: boolean;
    restrictions: PlaybackRestrictions;
    track_window: PlaybackTrackWindow;
  }

  interface PlaybackTrackWindow {
    current_track: Track;
    previous_tracks: Track[];
    next_tracks: Track[];
  }

  interface PlayerInit {
    name: string;
    volume?: number;
    getOAuthToken(cb: (token: string) => void): void;
  }

  type ErrorListener = (err: Error) => void;
  type PlaybackInstanceListener = (inst: WebPlaybackInstance) => void;
  type PlaybackStateListener = (s: PlaybackState) => void;

  type AddListenerFn = ((
    event: "ready" | "not_ready",
    cb: PlaybackInstanceListener,
  ) => void) &
    ((event: "player_state_changed", cb: PlaybackStateListener) => void) &
    ((event: ErrorTypes, cb: ErrorListener) => void);

  class SpotifyPlayer {
    public addListener: AddListenerFn;
    public on: AddListenerFn;
    constructor(options: PlayerInit);

    public connect(): Promise<boolean>;
    public disconnect(): void;
    public getCurrentState(): Promise<PlaybackState | null>;
    public getVolume(): Promise<number>;
    public nextTrack(): Promise<void>;

    public removeListener(
      event: "ready" | "not_ready" | "player_state_changed" | ErrorTypes,
      cb?: ErrorListener | PlaybackInstanceListener | PlaybackStateListener,
    ): void;

    public pause(): Promise<void>;
    public previousTrack(): Promise<void>;
    public resume(): Promise<void>;
    public seek(pos_ms: number): Promise<void>;
    public setName(name: string): Promise<void>;
    public setVolume(volume: number): Promise<void>;
    public togglePlay(): Promise<void>;
  }

  interface Track {
    uri: string;
    id: string | null;
    type: "track" | "episode" | "ad";
    media_type: "audio" | "video";
    name: string;
    is_playable: boolean;
    album: Album;
    artists: Artist[];
    duration_ms: number;
    explicit: boolean;
    popularity: number;
  }

  interface WebPlaybackInstance {
    device_id: string;
  }

  interface SearchResult {
    tracks: {
      href: string;
      items: Track[];
      limit: number;
      next: string;
      offset: number;
      previous: string;
      total: number;
    };
  }
}
