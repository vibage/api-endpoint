import { Response } from "express";
import { app } from "./app";
import * as TrackController from "./tracks/routes";
import * as UserController from "./user/routes";
import * as VibeController from "./vibe/routes";

// user commands
app.get("/user/:id/info", UserController.getUserInfo);
app.get("/user/:id", UserController.getUser);
app.put("/user", UserController.createUser);
app.post("/user/refresh", UserController.refreshAuthToken);
app.post("/user/spotify", UserController.addSpotifyData);
app.get("/user/:id/likes", UserController.getLikes);
app.get("/user/tokens", UserController.getLikes);
app.put("/user/vibe", UserController.setVibe);

// listener commands
app.get("/queue/:id/tracks", TrackController.getTracks);
app.get("/queue/:id/player", TrackController.getPlayer);
app.put("/queue/:id/track", TrackController.addTrack);
app.post("/queue/:id/like/:trackId", TrackController.likeTrack);
app.post("/queue/:id/unlike/:trackId", TrackController.unlikeTrack);
app.get("/queue/:id/search", TrackController.search);

// host commands
// since the host will be authing and has only one queue we don't need a queueId
app.post("/queue/start", TrackController.startQueue);
app.post("/queue/resume", TrackController.resumeQueue);
app.post("/queue/stop", TrackController.stopQueue);
app.put("/queue/state", TrackController.setPlayerState);
app.put("/queue/play", TrackController.play);
app.put("/queue/pause", TrackController.pause);
// make this a delete request later
app.post("/queue/rmTrack/:id", TrackController.removeTrack);
app.post("/queue/next", TrackController.nextTrack);
app.put("/queue/playTrack", TrackController.playTrack);

// vibe commands
app.get("/vibe/pop", VibeController.getPopular);
app.get("/vibe/:id", VibeController.getVibe);
app.post("/vibe/:id/setGenre", VibeController.setGenre);
app.post("/vibe/:id/setExplicit", VibeController.setExplicit);

// other commands
app.get("/nearbyHost", UserController.getActiveHosts);

// smoke test
app.get("/ping", (_, res: Response) => res.send("pong"));
