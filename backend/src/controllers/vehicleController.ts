import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as vehicleService from "../services/vehicleService";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vehicles = await vehicleService.listVehicles();
    res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.status(200).json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.status(200).json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function updateLocation(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { latitude, longitude } = req.body;
    const vehicle = await vehicleService.updateVehicleLocation(req.params.id, latitude, longitude);
    res.status(200).json(vehicle);
  } catch (err) {
    next(err);
  }
}
