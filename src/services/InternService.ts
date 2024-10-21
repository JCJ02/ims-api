import InternRepo from "../repo/InternRepo";
import bcrypt from "bcryptjs";
import { internAccountType, internType } from "../types/InternType";
import { Request } from "express";
import { generateToken } from "../utils/token";
import { sendEmails } from "../utils/sendEmails";
import prisma from "../utils/client";

class InternService {

    private internRepo;

    constructor() {

        this.internRepo = new InternRepo();

    }

    // CREATE INTERN
    async createIntern(data: internAccountType) {

        const plainPassword = data.password;
        const hashedPassword = bcrypt.hashSync(plainPassword, 10);

        const internData = {
            ...data,
            password: hashedPassword
        }

        // const newIntern = await this.internRepo.createIntern(internData);

        // return newIntern;

        const createdIntern = await prisma.$transaction( async (prismaTrasaction) => {

            const newIntern = await this.internRepo.createIntern(internData, prismaTrasaction);

            try {
                
                await sendEmails({
                    to: newIntern.email,
                    subject: `Welcome to the Team, ${newIntern.firstname} ${newIntern.lastname}! Your Intern Account is Ready! 🎉`,
                    message: `
                        Hello ${newIntern.firstname} ${newIntern.lastname}! <br>
                        <br>
                        Fantastic news, your <b>Intern Account</b> has been successfully created! <br>
                        <br>
                        Here are your account details: <br>
                        <br>
                        <b>Username:</b> ${newIntern.email} <br>
                        <b>Password:</b> ${plainPassword} <br>
                        <br>
                        Be sure to change your password after your first <b>Sign In</b> to keep your account secure. <br>
                        <br>
                        We're thrilled to have you onboard, and we can't wait to see all the amazing things you'll achieve. <br>
                        Let's get started!
                        <br>
                        <br>
                        Best regards, <br>
                        The Lightweight Solutions Team! 🎯 <br>
                    `
                });
        
            } catch (error) {
                        
                console.error("Failed To Send Email, Rolling Back Transaction: ", error);
                throw new Error("Email Sending Failed; Rolling Back Transaction");
        
            }

            return newIntern;

        });

        return createdIntern;

    }

    // AUTHENTICATE OR LOG IN INTERN METHOD
    async authenticate(data: { email: string, password: string }) {

        const intern = await this.internRepo.authenticate(data);

        if(!intern) {
            return null;
        } else {

            const isPasswordValid = bcrypt.compareSync(data.password, intern.account[0].password);

            if(!isPasswordValid) {
                return null;
            } else {

                const token = generateToken({
                    id: intern.id
                });

                return token;
            }

        }

    }

    // SHOW METHOD
    async show(id: number) {

        return await this.internRepo.show(id);

    }

    // UPDATE INTERN METHOD
    async updateIntern(req: Request, data: internType) {

        const internId = Number(req.params.id);

        const internData = {
            id: internId,
            ...data
        }

        return await this.internRepo.updateIntern(internData);

    }

    // UPDATE INTERN PASSWORD METHOD
    async updateInternPassword(id: number, data: { newPassword: string, currentPassword: string}) {
        
        const intern = await this.internRepo.show(id);

        if(!intern) {
            return null;
        } else {

            const isPasswordEqual = bcrypt.compareSync(data.currentPassword, intern.account[0].password);

            if(!isPasswordEqual) {

                return null;

            } else {

                const hashedNewPassword = bcrypt.hashSync(data.newPassword, 10);

                const updatedPassword = await this.internRepo.updateInternPassword(intern.account[0].id, { newPassword: hashedNewPassword });

                return updatedPassword;

            }

        }

    }

    // DELETE INTERN METHOD
    async deleteIntern(id: number) {
        
        const intern = await this.internRepo.show(id);

        if(!intern) {
            return null;
        }

        const deletedIntern = await this.internRepo.deleteIntern(intern.id);

        return deletedIntern;

    }

    // GET INTERNS w/ PAGINATION METHOD
    async getInterns(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const paginatedInterns = await this.internRepo.getInterns(skip, limit);

        return paginatedInterns;

    }

    // SEARCH INTERN w/ PAGINATION METHOD
    async searchInterns(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchInterns = await this.internRepo.searchInterns(query, skip, limit);

        return searchInterns;

    }

}

export default InternService;