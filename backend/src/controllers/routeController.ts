import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as routeService from "../services/routeService";
import { getIo } from "../sockets/trackingSocket";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const route = await routeService.createOptimizedRoute(req.body);
    res.status(201).json(route);
  } catch (err) {
    next(err);
  }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const routes = await routeService.listRoutes();
    res.status(200).json(routes);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const route = await routeService.getRouteById(req.params.id);
    res.status(200).json(route);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const route = await routeService.updateRouteStatus(req.params.id, req.body.status);
    getIo().emit("route:status-changed", { routeId: route.id, status: route.status });
    res.status(200).json(route);
  } catch (err) {
    next(err);
  }
}

export async function markStop(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stop = await routeService.markStopVisited(req.params.id, req.params.stopId);
    getIo().emit("route:stop-visited", { routeId: req.params.id, stopId: stop.id });
    res.status(200).json(stop);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await routeService.deleteRoute(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
