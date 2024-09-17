import { Request, Response } from "express";
import AppResponse from "../utils/AppResponse";
import TestService from "../services/TestService";

class AdminController {

    private testService;

    constructor() {

        this.testService = new TestService();

        this.index = this.index.bind(this);

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
    async create() {
        
    }
}

export default AdminController;
