import { Router } from "express";
import * as analyticsController from "../controllers/analyticsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/dashboard", analyticsController.dashboard);
router.get("/fuel-report", analyticsController.fuelReport);
router.get("/status-breakdown", analyticsController.statusBreakdown);
router.get("/vehicle-utilization", analyticsController.vehicleUtilization);

export default router;
