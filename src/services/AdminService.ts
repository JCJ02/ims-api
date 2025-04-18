
import AdminRepository from "../repositories/AdminRepository";
import { adminAccountType, adminType } from "../types/AdminType";
import { sendEmails } from "../utils/sendInternAccountDetails";
import { generateToken } from "../utils/token";
import bcrypt from "bcryptjs";
import { Request } from "express";

class AdminService {

    private adminRepository;

    constructor() {
        this.adminRepository = new AdminRepository();
    }

    // CREATE ADMIN METHOD
    async create(data: adminAccountType) {

        const isEmailExist = await this.adminRepository.validateEmail(data.email);

        if (isEmailExist) {
            return null;
        } else {

            const hashedPassword = bcrypt.hashSync(data.password, 10);
            //console.log(data.password);
            const adminData = {
                ...data,
                password: hashedPassword,
            };
            //console.log(hashedPassword);

            const newAdmin = await this.adminRepository.create(adminData);

            return newAdmin;

        }

    }
    // AUTHENTICATE OR LOG IN ADMIN METHOD
    async authenticate(data: { email: string, password: string }) {

        const admin = await this.adminRepository.authenticate(data);
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
    async show(id: number) {

        const admin = await this.adminRepository.show(id);

        if (!admin) {
            return null;
        }

        return admin;

    }

    // VALIDATE EMAIL METHOD
    async validateEmail(email: string) {

        const emailAddress = await this.adminRepository.validateEmail(email);

        if (!emailAddress) {
            return null;
        }

        return emailAddress;

    }

    // UPDATE ADMIN METHOD
    async update(id: number, data: adminType) {

        const admin = await this.adminRepository.show(id);
        console.log(`Admin ID: ${admin}`);

        if (!admin) {
            return null;
        } else {

            if (data.email) {
                const emailExist = await this.adminRepository.validateEmail(data.email);
                if (emailExist && emailExist.id !== id) {
                    return null;
                }
            }

            const adminData = {
                ...data
            }

            const updateAdminData = await this.adminRepository.update(admin.id, adminData);
            console.log(`Update Admin Data: ${updateAdminData}`);

            return updateAdminData;

        }

    }

    // UPDATE ADMIN PASSWORD METHOD
    async updatePassword(id: number, data: { currentPassword: string, newPassword: string }) {

        const admin = await this.adminRepository.show(id);

        if (!admin) {
            return null;
        }
        //console.log("Admin Data: ", admin);

        const isPasswordEqual = bcrypt.compareSync(data.currentPassword, admin.account[0].password);

        if (!isPasswordEqual) {
            return null;
        }
        //console.log(isPasswordEqual);

        const hashedNewPassword = bcrypt.hashSync(data.newPassword, 10);

        const updatedPassword = await this.adminRepository.updatePassword(admin.account[0].id, { newPassword: hashedNewPassword });

        return updatedPassword;

    }

    // DELETE ADMIN METHOD
    async delete(id: number) {

        const admin = await this.adminRepository.show(id);
        // console.log(Admin: ${admin});
        if (!admin) {
            return null;
        }

        const deletedAdmin = await this.adminRepository.delete(admin.id);
        // console.log(ID: ${deletedAdmin});
        return deletedAdmin;

    }

    // SENDING E-MAILS METHOD
    async sendEmail(data: { email: string, subject: string, message: string }) {

        const options = {
            to: data.email,
            subject: data.subject,
            message: data.message
        };

        return await sendEmails(options);

    }

    // LIST w/ SEARCH AND PAGINATION METHOD
    async list(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchAdmins = await this.adminRepository.list(query, skip, limit);

        return searchAdmins;

    }

    // ARCHIVE METHOD
    async archive(id: number) {

        const deletedAdmin = await this.adminRepository.deleted(id);

        if (!deletedAdmin) {
            return null;
        }

        const restoredAdmin = await this.adminRepository.archive(deletedAdmin.id);

        return restoredAdmin;

    }

    // ARCHIVE LIST w/ SEARCH AND PAGINATION METHOD
    async archiveList(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchDeletedAdmins = await this.adminRepository.archiveList(query, skip, limit);
        // console.log(`Search Deleted Interns: ${searchDeletedAdmins}`);
        return searchDeletedAdmins;

    }

}

export default AdminService;