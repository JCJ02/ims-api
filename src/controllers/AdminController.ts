import { Request, Response } from "express";
import AppResponse from "../utils/AppResponse";
import TestService from "../services/TestService";
import AdminService from "../services/AdminService";
import { adminSchema, adminAuthSchema } from "../utils/validations/AdminSchema";
import { authAdminRequest } from "../types/AdminType";

class AdminController {

    private testService;
    private adminService;

    constructor() {

        this.testService = new TestService();
        this.adminService = new AdminService();

        this.index = this.index.bind(this);
        this.createAdmin = this.createAdmin.bind(this);
        this.authenticate = this.authenticate.bind(this);

    }

    // TEST
    async index(req: authAdminRequest, res: Response) {

        try {

            const admin = req.admin;

            if(!admin) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: {
                        admin: admin.email
                    },
                    message: "Admin Found!",
                    code: 200
                });
            }

        } catch (error: any) {

            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
            
        }

    }

    // CREATE ADMIN
    async createAdmin(req: Request, res: Response) {

        try {

            const validation = adminSchema.safeParse(req.body);

            if(validation.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validation.error.errors[0].message,
                    code: 400
                });
            }

            const newAdmin = await this.adminService.createAdmin(validation.data);

            return AppResponse.sendSuccessful({
                res,
                data: {
                    admin: newAdmin
                },
                message: "Admin Registered Successfully!",
                code: 201
            });
    
        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // AUTHENTICATE ADMIN
    async authenticate(req: Request, res: Response) {

        try {

            const validation = adminAuthSchema.safeParse(req.body);

            if(validation.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validation.error.errors[0].message,
                    code: 400
                });
            }

            const result = await this.adminService.authenticate(validation.data);

            if (!result) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Invalid Login",  
                    code: 401
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: result,
                    message: "Login Successful!",
                    code: 200
                });
            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
        
    }
}

export default AdminController;
