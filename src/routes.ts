import { app } from "./app";
import * as TrackController from "./tracks/routes";
import * as UserController from "./user/routes";
import * as VibeController from "./vibe/routes";

// user commands
app.get("/user/:id", UserController.getUser);
app.put("/user", UserController.createUser);
app.post("/user/spotify", UserController.addSpotifyData);
app.get("/user/likes", UserController.getLikes);
app.get("/user/tokens", UserController.getLikes);

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
app.put("/queue/state", TrackController.setPlayerState);
app.put("/queue/play", TrackController.play);
app.put("/queue/pause", TrackController.pause);
app.delete("/queue/track/:uri", TrackController.removeTrack);
app.post("/queue/next", TrackController.nextTrack);

// vibe commands
app.get("/vibe/:id", VibeController.getVibe);
app.post("/vibe/:id/setGenre", VibeController.setGenre);
app.post("/vibe/:id/setExplicit", VibeController.setExplicit);

// other commands
app.get("/nearbyHost", UserController.getActiveHosts);

// app.post("/host/register", HostController.createHost);
// app.get("/hosts", HostController.getNearbyUsers);
// app.get("/host/:id/vibe", HostController.getVibe);
// app.get("/spotify/getToken/:id", HostController.getToken);
// app.post("/spotify/refresh", HostController.refreshToken);
// app.get("/user/:id/search", HostController.searchSpotify);

// app.put("/spotify/addTrack", TrackController.addTrack);
// app.post("/spotify/removeTrack", TrackController.removeTrack);
// app.get("/spotify/getTracks/:id", TrackController.getTracks);
// app.get("/spotify/nextTrack/:id", TrackController.nextTrack);
// app.post("/track/like", TrackController.likeTrack);
// app.post("/track/:trackId/unlike", TrackController.unlikeTrack);

// app.get("/queuer/:id/likes", QueuerController.getUserLikes);
// app.get("/queuer/:id/tokens", QueuerController.getUserTokens);
// app.get("/queuer/:id", QueuerController.getQueuer);
// app.post("/queuer", QueuerController.createUser);

// app.post("/player/startQueue", PlayerController.startQueue);
// app.put("/player/play", PlayerController.play);
// app.put("/player/pause", PlayerController.pause);
// app.get("/player/:id", PlayerController.getPlayer);
// app.put("/player/state", PlayerController.setPlayer);

// app.get("/user/:id", UserController.getUser);
// app.post("/user", UserController.createUser);
// app.post("/user/spotify", UserController.addSpotifyData);
