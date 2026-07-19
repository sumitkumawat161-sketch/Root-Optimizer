import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as driverService from "../services/driverService";

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const driver = await driverService.createDriver(req.body);
    res.status(201).json(driver);
  } catch (err) {
    next(err);
  }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const drivers = await driverService.listDrivers();
    res.status(200).json(drivers);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    res.status(200).json(driver);
  } catch (err) {
    next(err);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    res.status(200).json(driver);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await driverService.deleteDriver(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const driver = await driverService.getDriverByUserId(req.user!.userId);
    res.status(200).json(driver);
  } catch (err) {
    next(err);
  }
}
