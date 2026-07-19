import { Response, NextFunction } from "express";
import { registerUser, loginUser, getUserProfile } from "../services/authService";
import { AuthRequest } from "../middleware/authMiddleware";

export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role } = req.body;
    const result = await registerUser({ name, email, password, role });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const profile = await getUserProfile(req.user!.userId);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}
