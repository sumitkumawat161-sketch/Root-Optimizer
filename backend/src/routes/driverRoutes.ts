import { Router } from "express";
import * as driverController from "../controllers/driverController";
import { authMiddleware, requireRole } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", requireRole("ADMIN", "DISPATCHER"), driverController.create);
router.get("/", driverController.list);
router.get("/me", driverController.me);
router.get("/:id", driverController.getOne);
router.put("/:id", requireRole("ADMIN", "DISPATCHER"), driverController.update);
router.delete("/:id", requireRole("ADMIN"), driverController.remove);

export default router;
