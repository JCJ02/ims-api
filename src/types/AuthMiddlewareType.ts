import { Request } from "express";

export interface authMiddlewareRequest extends Request {
  user?: {
    id: number,
    email: string,
    firstname: string,
    lastname: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
    role?: string | null,
  } | undefined
}