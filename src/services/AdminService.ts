import AdminRepo from "../repo/AdminRepo";
import { Request, Response } from "express";

class AdminService {

    private adminRepo;

    constructor(){
        this.adminRepo = new AdminRepo();
    }

    async createAdmin(data: any, req: Request, res: Response){
        return this.adminRepo.createAdmin(data, req, res);
    }

    async loginAdmin(data: any, req: Request, res: Response){
        return this.adminRepo.loginAdmin(data, req, res);
    }
}

export default AdminService;