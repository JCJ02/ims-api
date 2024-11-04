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

        let user;

        if(verifiedToken.role === "Admin") {

            user = await adminService.show(verifiedToken.id);
            //console.log(admin);
            if(!user) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 403
                });
            }

        } else if(verifiedToken.role !== "Admin") {

            user = await internService.show(verifiedToken.id);

            if(!user) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Intern Not Found!",
                    code: 403
                });
            }

        } else {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: "Unauthorized",
                code: 403
            });
        }

        req.user = user;

        next();

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