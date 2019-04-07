import { app } from "./app";
import * as HostController from "./host/routes";
import * as PlayerController from "./player/routes";
import * as QueuerController from "./queuer/routes";
import * as TrackController from "./tracks/routes";
import * as VibeController from "./vibe/routes";

app.post("/spotify", HostController.authorize);
app.get("/hosts", HostController.getNearbyUsers);
app.get("/host/:id/vibe", HostController.getVibe);
app.get("/spotify/getToken/:id", HostController.getToken);
app.post("/spotify/refresh", HostController.refreshToken);
app.get("/user/:id/search", HostController.searchSpotify);

app.put("/spotify/addTrack", TrackController.addTrack);
app.post("/spotify/removeTrack", TrackController.removeTrack);
app.get("/spotify/getTracks/:id", TrackController.getTracks);
app.get("/spotify/nextTrack/:id", TrackController.nextTrack);
app.post("/track/like", TrackController.likeTrack);
app.post("/track/:trackId/unlike", TrackController.unlikeTrack);

app.get("/queuer/:id/likes", QueuerController.getUserLikes);
app.get("/queuer/:id", QueuerController.getQueuer);
app.post("/queuer", QueuerController.createUser);

app.post("/player/startQueue", PlayerController.startQueue);
app.put("/player/play", PlayerController.play);
app.put("/player/pause", PlayerController.pause);
app.get("/player/:id", PlayerController.getPlayer);
app.put("/player/state", PlayerController.setPlayer);

app.get("/vibe/:id", VibeController.getVibe);
app.post("/vibe/:id/setGenre", VibeController.setGenre);
app.post("/vibe/:id/setExplicit", VibeController.setExplicit);

// // public queue routes
// app.put("/queue/:id/addTrack", TrackController.addTrack);
// app.post("/queue/:id/removeTrack", TrackController.removeTrack);
// app.get("/queue/:id", TrackController.getTracks);
// app.post("/queue/:id/like", TrackController.likeTrack);

// // private queue routes
// app.post("/queue/start", PlayerController.startQueue);
// app.put("/queue/play", PlayerController.play);
// app.put("/queue/pause", PlayerController.pause);
// app.post("/queue/next", TrackController.nextTrack);

// // players
// app.get("/player/:id", PlayerController.getPlayer);
// app.put("/player/state", PlayerController.setPlayer);

// // user
// app.post("/comp/auth", UserController.authorize);
// app.get("/comp/:id/getToken", UserController.getToken);
// app.post("/comp/refresh", UserController.refreshToken);
// app.get("/comp/:id/search", UserController.searchSpotify);

// // other
// app.get("/nearbyUsers", UserController.getNearbyUsers);
