import { Response, NextFunction } from "express";
import AppResponse from "../utils/AppResponse";
import { verifyToken } from "../utils/token";
import { JsonWebTokenError } from "jsonwebtoken";
import AdminService from "../services/AdminService";
import InternService from "../services/InternService";
import { authMiddlewareRequest } from "../types/AuthMiddlewareType";

const authMiddleware = async (req: authMiddlewareRequest, res: Response, next: NextFunction) => {
    
    try {

        const adminService = new AdminService();
        const internService = new InternService();

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return AppResponse.sendErrors({ 
                res,
                data: null,
                message: "No Token Provided!",
                code: 403
            });
        }

        const verifiedToken = verifyToken(token) as any;
        //console.log(verifiedToken);
        if(verifiedToken.role === "Admin") {

            const admin = await adminService.show(verifiedToken.id);
            //console.log(admin);
            if(!admin) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 403
                });
            } else {
                req.user = admin;

                next();
            }

        } else if(verifiedToken.role !== "Admin") {

            const intern = await internService.show(verifiedToken.id);

            if(!intern) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Intern Not Found!",
                    code: 403
                });
            } else {
                req.user = intern;

                next();
            }

        } else {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: "Unauthorized",
                code: 403
            });
        }

    } catch (error: any) {

        if(error instanceof JsonWebTokenError) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: "Invalid Token",
                code: 401
            });
        } else {
            console.error(error);
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

}

export default authMiddleware;