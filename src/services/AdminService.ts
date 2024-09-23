import AdminRepo from "../repo/AdminRepo";
import { generateToken } from "../utils/token";
import bcrypt from "bcryptjs";
import { Request } from "express";

class AdminService {

    private adminRepo;

    constructor() {
        this.adminRepo = new AdminRepo();
    }

    async createAdmin(data: any) {

        const hashedPassword = bcrypt.hashSync(data.password, 10);
        //console.log(data.password);
        const adminData = {
            ...data,
            password: hashedPassword,
        };
        //console.log(hashedPassword);

        const newAdmin = await this.adminRepo.createAdmin(adminData);

        return newAdmin;

    }

    async authenticate(data: any){
        
        const admin = await this.adminRepo.authenticate(data);

        if (!admin) {
            return null;
        }

        const isPasswordValid = bcrypt.compare(data.password, admin.password);
        
        if (!isPasswordValid) {
            return null;
        }

        const token = generateToken({
            id: admin.id,
            role: admin.role
        });
        // console.log("Token: ", token);
        return token

    }

    async show(id: number){
        
        const admin = await this.adminRepo.show(id);

        return admin;

    }

    async updateAdmin(req: Request, data: any) {

        const id = Number(req.params.id);

        const adminData = {
            id: id,
            ...data
        }

        const editAdmin = await this.adminRepo.updateAdmin(adminData);

        if(!editAdmin) {
            return null
        }

        return editAdmin;

    }

    async updateAdminPassword(req: Request, data: any) {

        const id = Number(req.params.id);

        const admin = await this.adminRepo.show(id);

        if (!admin) {
            return null;
        }

        const isPasswordValid = bcrypt.compareSync(data.password, admin.password);

        if (!isPasswordValid) {
            return null
        }

        const hashedNewPassword = bcrypt.hashSync(data.password, 10);

        const editedAdminPassword = await this.adminRepo.updateAdminPassword(id, hashedNewPassword);

        return editedAdminPassword;

    }

    async getAdmin(data: any) {


    }

}

export default AdminService;