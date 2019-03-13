import { app } from "./app";
import * as UserController from "./users/routes";
import * as TrackController from "./tracks/routes";
import * as PlayerController from "./player/routes"

app.post("/spotify", UserController.authorize);
app.get("/spotify/getToken/:id", UserController.getToken);
app.post("/spotify/refresh", UserController.refreshToken);

app.put("/spotify/addTrack", TrackController.addTrack);
app.post("/spotify/removeTrack", TrackController.removeTrack);
app.get("/spotify/getTracks/:id", TrackController.getTracks);
app.get("/spotify/nextTrack/:id", TrackController.nextTrack);

app.post("/spotify/play", PlayerController.playPlaylist);
