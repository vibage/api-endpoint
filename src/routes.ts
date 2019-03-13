import { app } from "./app";
import path from "path";
import * as UserController from "./users/routes";
import * as TrackController from "./tracks/routes";
import * as PlayerController from "./player/routes"
import { Request, Response } from "express";

app.post("/spotify", UserController.authorize);
app.get("/spotify/getToken/:id", UserController.getToken);
app.post("/spotify/refresh", UserController.refreshToken);

app.put("/spotify/addTrack", TrackController.addTrack);
app.post("/spotify/removeTrack", TrackController.removeTrack);
app.get("/spotify/getTracks/:id", TrackController.getTracks);
app.get("/spotify/nextTrack/:id", TrackController.nextTrack);

app.post("/spotify/play", PlayerController.playPlaylist);


const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

// public route stuff
app.get('*', (req: Request, res: Response) => {
  if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`public/${req.url}`));
  } else {
    res.sendFile(path.resolve('public/index.html'));
  }
});
