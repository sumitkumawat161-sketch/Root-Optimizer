import { Router } from "express";
import { uploadStopsCsv } from "../controllers/uploadController";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadCsv } from "../middleware/uploadMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/stops", uploadCsv.single("file"), uploadStopsCsv);

export default router;
