import InternRepo from "../repo/InternRepo";
import bcrypt from "bcryptjs";
import { internAccountType, internType } from "../types/InternType";
import { Request } from "express";
import { generateToken } from "../utils/token";
import { sendEmails } from "../utils/sendEmails";
import prisma from "../utils/client";
import { generatePassword } from "../utils/generatePassword";

class InternService {

    private internRepo;

    constructor() {

        this.internRepo = new InternRepo();

    }

    // CREATE INTERN
    async create(data: internAccountType) {

        const isEmailExist = await this.internRepo.validateEmail(data.email);

        if(isEmailExist) {
            return null
        } else {
            const plainPassword = data.password;
            const hashedPassword = bcrypt.hashSync(plainPassword, 10);

            const internData = {
                ...data,
                password: hashedPassword
            }

            const createdIntern = await prisma.$transaction( async (prismaTrasaction) => {

                const newIntern = await this.internRepo.create(internData, prismaTrasaction);

                try {
                        
                    await sendEmails({
                        to: newIntern.email,
                        subject: `Welcome to the Team, ${newIntern.firstname} ${newIntern.lastname}! Your Intern Account is Ready! 🎉`,
                        message: `
                            Hello, ${newIntern.firstname} ${newIntern.lastname}!

                            Fantastic news, your Intern Account has been created. Here are your account details:

                            Username: ${newIntern.email}
                            Password: ${plainPassword}

                            Be sure to change your password after your first Sign In to keep your account secure.

                            We're thrilled to have you onboard, and we can't wait to see all the amazing things you'll achieve.
                            Let's get started!
                                
                            Best regards,
                            The Lightweight Solutions Team!
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

        const intern = await this.internRepo.show(id);

        if(!intern) {
            return null;
        }

        return intern;

    }

    // VALIDATE EMAIL METHOD
    async validateEmail(email: string) {

        const emailAddress = await this.internRepo.validateEmail(email);

        if(!emailAddress) {
            return null;
        }

        return emailAddress;

    }

    // UPDATE INTERN METHOD
    async update(id: number, data: internType) {

        const intern = await this.internRepo.show(id);

        if(!intern) {
            return null;
        } else {

            if(data.email) {
                const isEmailExist = await this.internRepo.validateEmail(data.email);
                if(isEmailExist && isEmailExist.id !== id) {
                    return null;
                }
            }

            const internData = {
                ...data
            }

            const updateInternData = this.internRepo.update(intern.id, internData);

            return updateInternData;

        }

    }

    // UPDATE INTERN PASSWORD METHOD
    async updatePassword(id: number, data: { newPassword: string, currentPassword: string}) {
        
        const intern = await this.internRepo.show(id);

        if(!intern) {
            return null;
        } else {

            const isPasswordEqual = bcrypt.compareSync(data.currentPassword, intern.account[0].password);

            if(!isPasswordEqual) {

                return null;

            } else {

                const hashedNewPassword = bcrypt.hashSync(data.newPassword, 10);

                const updatedPassword = await this.internRepo.updatePassword(intern.account[0].id, { newPassword: hashedNewPassword });

                return updatedPassword;

            }

        }

    }

    // DELETE INTERN METHOD
    async delete(id: number) {
        
        const intern = await this.internRepo.show(id);

        if(!intern) {
            return null;
        }

        const deletedIntern = await this.internRepo.delete(intern.id);

        return deletedIntern;

    }

    // INTERN LIST w/ SEARCH AND PAGINATION METHOD
    async list(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchInterns = await this.internRepo.list(query, skip, limit);

        return searchInterns;

    }

    // RESET PASSWORD METHOD
    async resetPassword(id: number) {

        const intern = await this.internRepo.show(id);

        if(!intern) {
            return null;
        } else {

            const newGeneratedPassword = await generatePassword(10);
            const hashedNewPassword = bcrypt.hashSync(newGeneratedPassword, 10);

            const updatedPassword = await this.internRepo.updatePassword(intern.account[0].id, { newPassword: hashedNewPassword });

            if(updatedPassword) {

                const sendUpdatedPassword = await sendEmails({
                    to: intern.email,
                    subject: "🎉 Your Password Has Been Reset! 🚀",
                    message: `
                        Hello, ${intern.firstname} ${intern.lastname}
                        
                        Your Password has been successfully reset.
                        Here is your new password to get you back on track:
                        
                        New Password: ${newGeneratedPassword}
                        
                        Don't forget to change your password after logging in for the first time to keep your account secure!
                        
                        We're thrilled to have you on board, and we can't wait to see all the amazing things you'll achieve.
                        Let's make great things happen!
                    
                        Best regards,
                        The Lightweight Solutions Team!
                    `
                });

                return sendUpdatedPassword;

            }

            return updatedPassword;

        }

    }

    // ARCHIVE METHOD
    async archive(id: number) {

        const deletedIntern = await this.internRepo.deleted(id);

        if(!deletedIntern) {
            return null;
        }

        const restoredIntern = await this.internRepo.archive(deletedIntern.id);

        return restoredIntern;

    }

    // ARCHIVE LIST w/ SEARCH AND PAGINATION METHOD
    async archiveList(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchDeletedInterns = await this.internRepo.archiveList(query, skip, limit);
        console.log(`Search Deleted Interns: ${searchDeletedInterns}`);
        return searchDeletedInterns;

    }

}

export default InternService;