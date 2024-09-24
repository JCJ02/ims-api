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
        // console.log("Admin Data: ",admin);
        if (!admin) {
            return null;
        }

        const isPasswordValid = bcrypt.compareSync(data.password, admin.password);
        // console.log("Comparision: ", isPasswordValid);
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

    async updateAdminPassword(id: number, data: { newPassword: string, currentPassword: string }) {

        const admin = await this.adminRepo.show(id);

        if(!admin) {
            return null
        }
        // console.log("Admin ID: ", admin);
        
        const isPasswordEqual = bcrypt.compareSync(data.currentPassword, admin.password);

        if(!isPasswordEqual) {
            return null
        }

        const hashedNewPassword = bcrypt.hashSync(data.newPassword, 10);

        const updatedPassword = await this.adminRepo.updateAdminPassword(admin.id, { newPassword: hashedNewPassword, currentPassword: data.currentPassword });

        return updatedPassword;

    }

    async getAdmin(data: any) {

    }

}

export default AdminService;