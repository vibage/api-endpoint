import { app } from "./app";
import * as PlayerController from "./player/routes";
import * as TrackController from "./tracks/routes";
import * as UserController from "./users/routes";

app.post("/spotify", UserController.authorize);
app.get("/users", UserController.getNearbyUsers);
app.get("/spotify/getToken/:id", UserController.getToken);
app.post("/spotify/refresh", UserController.refreshToken);
app.get("/user/:id/search", UserController.searchSpotify);

app.put("/spotify/addTrack", TrackController.addTrack);
app.post("/spotify/removeTrack", TrackController.removeTrack);
app.get("/spotify/getTracks/:id", TrackController.getTracks);
app.get("/spotify/nextTrack/:id", TrackController.nextTrack);
app.post("/track/like", TrackController.likeTrack);

app.post("/player/startQueue", PlayerController.startQueue);
app.put("/player/play", PlayerController.play);
app.put("/player/pause", PlayerController.pause);
app.get("/player/:id", PlayerController.getPlayer);
app.put("/player/state", PlayerController.setPlayer);
