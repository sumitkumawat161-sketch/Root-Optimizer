import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { parseStopsCsv } from "../utils/csvParser";
import { AppError } from "../middleware/errorMiddleware";

interface MulterRequest extends AuthRequest {
  file?: Express.Multer.File;
}

export async function uploadStopsCsv(req: MulterRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError("No CSV file uploaded", 400);
    }

    const stops = parseStopsCsv(req.file.buffer);
    res.status(200).json({ count: stops.length, stops });
  } catch (err) {
    next(err);
  }
}
