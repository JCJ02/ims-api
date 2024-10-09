import { Request } from "express";

export interface authAdminRequest extends Request {
  admin?: {
    id: number,
    email: string,
    firstname: string,
    lastname: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
    role?: string | null,
    // account: {
    //   id: number,
    //   password: string,
    //   admin_id: number,
    //   createdAt: Date,
    //   updatedAt: Date,
    //   deletedAt: Date
    // }
  } | undefined
}
