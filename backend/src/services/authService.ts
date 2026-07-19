import prisma from "../config/prismaClient";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { AppError } from "../middleware/errorMiddleware";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "DISPATCHER" | "DRIVER";
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role || "DISPATCHER"
    }
  });

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}
