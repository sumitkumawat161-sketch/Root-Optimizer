import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import prisma from "../config/prismaClient";

export async function listUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function systemStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [users, vehicles, drivers, routes] = await Promise.all([
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.driver.count(),
      prisma.route.count()
    ]);
    res.status(200).json({ users, vehicles, drivers, routes });
  } catch (err) {
    next(err);
  }
}
