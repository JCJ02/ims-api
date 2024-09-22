import { Request } from "express";

export interface authAdminRequest extends Request {
  admin?: {
    id: number,
    email: string,
    firstname: string,
    lastname: string,
    password: string,
    confirmPassword?: string | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
    role?: string | null
  } | undefined
}
