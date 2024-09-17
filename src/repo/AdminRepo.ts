import bcrypt from "bcryptjs";
import prisma from "../utils/client";
import userSchema from "../utils/validations/admin.schema";
import { Request, Response } from "express";
import AppResponse from "../utils/AppResponse";
import generateToken from "../utils/token";

class AdminRepo {

    async create(data: any, req: Request, res: Response) {
        try {

            const validation = userSchema.safeParse(req.body);

            if(validation.error) {
                AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validation.error.errors[0].message,
                    code: 400
                })
            }

            const hashPassword = bcrypt.hashSync(data.password, 10);
            
            const newAdminUser = await prisma.admin.create({
                data: {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    password: hashPassword,
                },
            });
    
            return newAdminUser;

        } catch (error: any) {
            AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
    }

    async loginAdmin(data: any, req: Request, res: Response) {

        try {

            const validateAdminUser = await prisma.admin.findUnique({
                where: {
                    email: data.email   
                }
            });
    
            if (!validateAdminUser) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 500
                });
            }
    
            const isPasswordValid = bcrypt.compareSync(data.password, validateAdminUser.password);
            
            if (!isPasswordValid) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Invalid Password!",
                    code: 500
                });
            }

            const token = generateToken(validateAdminUser);
    
            return AppResponse.sendSuccessfull({
                res,
                data: { 
                    user: validateAdminUser,
                    token: token
                },
                message: "Login Successful!",
                code: 200
            });
    
        } catch (error: any) {
            AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // async get() {
    //     return "GET!";
    // }

    // async delete() {
    //     return "DELETE!";
    // }

    // async update() {
    //     return "UPDATE!";
    // }
}

export default AdminRepo;