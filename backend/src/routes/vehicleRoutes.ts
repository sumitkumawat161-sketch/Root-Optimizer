import { Router } from "express";
import * as vehicleController from "../controllers/vehicleController";
import { authMiddleware, requireRole } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", requireRole("ADMIN", "DISPATCHER"), vehicleController.create);
router.get("/", vehicleController.list);
router.get("/:id", vehicleController.getOne);
router.put("/:id", requireRole("ADMIN", "DISPATCHER"), vehicleController.update);
router.delete("/:id", requireRole("ADMIN"), vehicleController.remove);
router.patch("/:id/location", vehicleController.updateLocation);

export default router;
