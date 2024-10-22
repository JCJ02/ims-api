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
  } | undefined
}

export type baseAdminType = {
  firstname: string;
  lastname: string;
  email: string;
};

export type adminAccountType = baseAdminType & {
  id?: number
  password: string
};

export type adminType = baseAdminType & {
  id?: number
};
