import { NextFunction } from "connect";
import { Request, Response } from "express";
import { AsyncRouteWrapper } from "../utils";
import * as trackController from "./controller";

export function addTrack(req: Request, res: Response, next: NextFunction) {
  const { trackId, queuerId } = req.body;
  const { id } = req.params;
  const track = trackController.addTrack(queuerId, id, trackId);
  AsyncRouteWrapper(track, res, next);
}

export function likeTrack(req: Request, res: Response, next: NextFunction) {
  const { id, trackId } = req.params;
  const { uid } = req.body;
  const track = trackController.likeTrack(uid, id, trackId);
  AsyncRouteWrapper(track, res, next);
}

export function unlikeTrack(req: Request, res: Response, next: NextFunction) {
  const { id, trackId } = req.params;
  const { uid } = req.body;
  const track = trackController.unlikeTrack(uid, id, trackId);
  AsyncRouteWrapper(track, res, next);
}

export function getTracks(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const track = trackController.getTracks(id);
  AsyncRouteWrapper(track, res, next);
}

export function getPlayer(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const player = trackController.getPlayer(id);
  AsyncRouteWrapper(player, res, next);
}

export function search(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const { q } = req.query;
  const tracks = trackController.search(id, q);
  AsyncRouteWrapper(tracks, res, next);
}

/*========================================
     Host Functions
==========================================*/

export function startQueue(req: Request, res: Response, next: NextFunction) {
  const { uid, deviceId } = req.body;
  const tracks = trackController.startQueue(uid, deviceId);
  AsyncRouteWrapper(tracks, res, next);
}

export function setPlayerState(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { uid, player } = req.body;
  const tracks = trackController.setPlayerState(uid, player);
  AsyncRouteWrapper(tracks, res, next);
}

export function play(req: Request, res: Response, next: NextFunction) {
  const { uid } = req.body;
  const tracks = trackController.play(uid);
  AsyncRouteWrapper(tracks, res, next);
}

export function pause(req: Request, res: Response, next: NextFunction) {
  const { uid } = req.body;
  const tracks = trackController.pause(uid);
  AsyncRouteWrapper(tracks, res, next);
}

export async function removeTrack(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  const { uid } = req.body;
  const tracks = trackController.removeTrack(uid, id);
  AsyncRouteWrapper(tracks, res, next);
}

export async function nextTrack(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { uid } = req.body;
  const tracks = trackController.nextTrack(uid);
  AsyncRouteWrapper(tracks, res, next);
}

export async function playTrack(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { uid, trackId } = req.body;
  const result = trackController.playCertainTrack(uid, trackId);
  AsyncRouteWrapper(result, res, next);
}
