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

            await this.adminService.create(req.body, req, res);
    
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

            await this.adminService.loginAdmin(req.body, req, res);

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
