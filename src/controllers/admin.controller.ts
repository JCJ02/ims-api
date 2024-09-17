import { Request, Response } from "express";
import AppResponse from "../utils/AppResponse";
import TestService from "../services/TestService";
import AdminService from "../services/AdminService";

class AdminController {

    private testService;
    private adminService;

    constructor() {

        this.testService = new TestService();
        this.adminService = new AdminService();

        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.loginAdmin = this.loginAdmin.bind(this);

    }

    // TEST
    async index(req: Request, res: Response) {

        const message = await this.testService.index();

        return AppResponse.sendSuccessfull({
            res,
            data: message,
            message: "Successfull!",
            code: 200
        });

    }

    // CREATE ADMIN
    async create(req: Request, res: Response) {

        try {
            const admin = await this.adminService.create(req.body, req, res);
    
            if (!admin) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Registration Unsuccessful!",
                    code: 400
                });
            }
    
            return AppResponse.sendSuccessfull({
                res,
                data: { user: admin },
                message: "Successfully Registered!",
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

    // LOGIN ADMIN
    async loginAdmin(req: Request, res: Response) {
        try {
            const admin = await this.adminService.loginAdmin(req.body, req, res);

            return AppResponse.sendSuccessfull({
                res,
                data: { user: admin },
                message: "Login Successful!",
                code: 200
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
}

export default AdminController;
