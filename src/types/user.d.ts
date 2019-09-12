export interface IUser {
  name: string;
  _id: string | any;
  uid: string;
  dateCreated: Date;
  tokens: number;
}

export interface IHost extends IUser {
  queueOn: boolean;
  spotifyId: string;
  accessToken: string;
  refreshToken: string;
  currentVibe: string;
  player: IPlayerState;
  playlistId: string;
  deviceId: string;
}
