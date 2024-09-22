import AdminRepo from "../repo/AdminRepo";
import { generateToken } from "../utils/token";
import bcrypt from "bcryptjs";

class AdminService {

    private adminRepo;

    constructor() {
        this.adminRepo = new AdminRepo();
    }

    async createAdmin(data: any) {

        const hashPassword = bcrypt.hashSync(data.password, 10);

        const adminData = {
            ...data,
            password: hashPassword,
        };

        const newAdmin = await this.adminRepo.createAdmin(adminData);

        return newAdmin;

    }

    async authenticate(data: any){
        
        const admin = await this.adminRepo.authenticate(data.email);

        if (!admin) {
            return null;
        }

        const isPasswordValid = bcrypt.compareSync(data.password, admin.password);
        if (!isPasswordValid) {
            return null;
        }

        const token = generateToken({
            id: data.id
        });
        
        return token;

    }

    async show(id: number){
        
        const admin = await this.adminRepo.show(id);

        return admin;

    }

}

export default AdminService;