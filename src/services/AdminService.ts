    import AdminRepo from "../repo/AdminRepo";
    import { generateToken } from "../utils/token";
    import bcrypt from "bcryptjs";
    import { Request } from "express";

    class AdminService {

        private adminRepo;

        constructor() {
            this.adminRepo = new AdminRepo();
        }

        // CREATE ADMIN METHOD
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

        // AUTHENTICATE OR LOG IN ADMIN METHOD
        async authenticate(data: any){
            
            const admin = await this.adminRepo.authenticate(data);
            // console.log("Admin Data: ",admin);
            if (!admin) {
                return null;
            }

            const isPasswordValid = bcrypt.compareSync(data.password, admin.account[0].password);
            // console.log("Comparision: ", isPasswordValid);
            if (!isPasswordValid) {
                return null;
            }

            const token = generateToken({
                id: admin.id,
                role: admin.role
            });
            // console.log("Token: ", token);
            return token;

        }

        // SHOW METHOD
        async show(id: number){
            
            return await this.adminRepo.show(id);

        }

        // UPDATE ADMIN METHOD
        async updateAdmin(req: Request, data: any) {

            const id = Number(req.params.id);

            const adminData = {
                id: id,
                ...data
            }

            return await this.adminRepo.updateAdmin(adminData);

        }

        // UPDATE ADMIN PASSWORD METHOD
        async updateAdminPassword(id: number, data: { currentPassword: string, newPassword: string } ) {

            const admin = await this.adminRepo.show(id);

            if(!admin) {
                return null;
            }
            //console.log("Admin Data: ", admin);
            
            const isPasswordEqual = bcrypt.compareSync(data.currentPassword, admin.account[0].password);

            if(!isPasswordEqual) {
                return null;
            }
            //console.log(isPasswordEqual);

            const hashedNewPassword = bcrypt.hashSync(data.newPassword, 10);

            const updatedPassword = await this.adminRepo.updateAdminPassword(admin.account[0].id, { newPassword: hashedNewPassword } );

            return updatedPassword;

        }

        // GET ALL ADMIN METHOD
        async getAllAdmin(data: any) {

            const isAdminEmpty = await this.adminRepo.getAllAdmin(data);

            if(!isAdminEmpty) {
                return null;
            } else {
                return isAdminEmpty;
            }

        }

        

        // DELETE ADMIN METHOD
        async deleteAdmin(id: number) {
            
            const admin = await this.adminRepo.show(id);
            // console.log(Admin: ${admin});
            if(!admin) {
                return null;
            }

            const deletedAdmin = await this.adminRepo.deleteAdmin(admin.id);
            // console.log(ID: ${deletedAdmin});
            return deletedAdmin;

        }

    }

    export default AdminService;