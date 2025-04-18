import { Request } from "express";

export interface authInternRequest extends Request {
  intern?: {
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

export type baseInternType = {
    firstname: string;
    lastname: string;
    email: string;
    birthdate: Date;
    school: string;
    mentor: string;
    role: string;
};

export type internAccountType = baseInternType & {
    id?: number
    password: string
};

export type internType = baseInternType & {
    id?: number
};
