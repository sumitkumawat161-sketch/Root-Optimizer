import { Router } from "express";
import * as routeController from "../controllers/routeController";
import { authMiddleware, requireRole } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", requireRole("ADMIN", "DISPATCHER"), routeController.create);
router.get("/", routeController.list);
router.get("/:id", routeController.getOne);
router.patch("/:id/status", routeController.updateStatus);
router.patch("/:id/stops/:stopId/visit", routeController.markStop);
router.delete("/:id", requireRole("ADMIN", "DISPATCHER"), routeController.remove);

export default router;
