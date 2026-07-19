import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as analyticsService from "../services/analyticsService";

export async function dashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const summary = await analyticsService.getDashboardSummary();
    res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
}

export async function fuelReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const report = await analyticsService.getFuelReport();
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

export async function statusBreakdown(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const breakdown = await analyticsService.getRouteStatusBreakdown();
    res.status(200).json(breakdown);
  } catch (err) {
    next(err);
  }
}

export async function vehicleUtilization(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.getVehicleUtilization();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}
