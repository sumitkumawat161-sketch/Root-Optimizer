import { Router } from "express";
import * as adminController from "../controllers/adminController";
import { authMiddleware, requireRole } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware, requireRole("ADMIN"));

router.get("/users", adminController.listUsers);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);
router.get("/stats", adminController.systemStats);

export default router;
