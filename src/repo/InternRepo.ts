import prisma from "../utils/client";
import { internAccountType, internType } from "../types/InternType";

class InternRepo {

    // CREATE INTERN METHOD
    async createIntern(data: internAccountType, prismaTrasaction: any) {

        const newIntern = await prismaTrasaction.intern.create({
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                birthdate: data.birthdate,
                school: data.school,
                mentor: data.mentor,
                role: data.role,
                account: {
                    create: {
                        password: data.password,
                    },
                },
            },
        });
    
        return newIntern;

        // const newIntern = await prisma.$transaction(async (prisma) => {
        //     return await prisma.intern.create({
        //         data: {
        //             firstname: data.firstname,
        //             lastname: data.lastname,
        //             email: data.email,
        //             birthdate: data.birthdate,
        //             school: data.school,
        //             mentor: data.mentor,
        //             role: data.role,
        //             account: {
        //                 create: {
        //                     password: data.password
        //                 }
        //             }
        //         }
        //     });

        //     // try {
            
        //     //     await sendEmails({
        //     //         to: createdIntern.email,
        //     //         subject: `Welcome to the Team, ${createdIntern.firstname} ${createdIntern.lastname}! Your Intern Account is Ready! 🎉`,
        //     //         message: `
        //     //             Hello ${createdIntern.firstname} ${createdIntern.lastname}! <br>
        //     //             <br>
        //     //             Fantastic news, your <b>Intern Account</b> has been successfully created! <br>
        //     //             <br>
        //     //             Here are your account details: <br>
        //     //             <br>
        //     //             <b>Username:</b> ${createdIntern.email} <br>
        //     //             <b>Password:</b> ${data.password} <br>
        //     //             <br>
        //     //             Be sure to change your password after your first <b>Sign In</b> to keep your account secure. <br>
        //     //             <br>
        //     //             We're thrilled to have you onboard, and we can't wait to see all the amazing things you'll achieve. <br>
        //     //             Let's get started!
        //     //             <br>
        //     //             <br>
        //     //             Best regards, <br>
        //     //             The Lightweight Solutions Team! 🎯 <br>
        //     //         `
        //     //     });
    
        //     // } catch (error) {
                
        //     //     console.error("Failed To Send Email, Rolling Back Transaction: ", error);
        //     //     throw new Error("Email Sending Failed; Rolling Back Transaction");

        //     // }

        //     // return createdIntern;

        // });

        // return newIntern;

    }

    // AUTHENTICATE OR LOG IN INTERN METHOD
    async authenticate(data: { email: string}) {

        const intern = await prisma.intern.findFirst({
            where: {
                email: data.email,
                deletedAt: null
            },
            include: {
                account: true
            }
        });

        return intern;

    }

    // SHOW METHOD
    async show(id: number) {

        const internId = await prisma.intern.findUnique({
            where: {
                id: id,
                deletedAt: null
            },
            include: {
                account: true
            }
        });

        return internId;

    }

    // UPDATE INTERN METHOD
    async updateIntern(id: number, data: internType) {
        
        const editIntern = await prisma.intern.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                birthdate: data.birthdate,
                school: data.school,
                mentor: data.mentor,
                role: data.role,
            }
        });

        return editIntern;

    }

    // UPDATE INTERN PASSWORD METHOD
    async updateInternPassword(id: number, data: { newPassword: string }) {

        const editInternPassword = await prisma.account.update({
            where: {
                id: id,
            },
            data: {
                password: data.newPassword 
            }
        });

        return editInternPassword;

    }

    // DELETE INTERN METHOD
    async deleteIntern(id: number) {

        const softDeleteIntern = await prisma.intern.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date(),
                account: {
                    updateMany: {
                        where: {
                            internId: id,
                            deletedAt: null
                        },
                        data: {
                            deletedAt: new Date()
                        }
                    }
                }
            }
        });

        return softDeleteIntern;

    }

    // INTERN LIST w/ PAGINATION METHOD
    async getInternsList(skip: number, limit: number) {

        const interns = await prisma.intern.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalInterns = await prisma.intern.count({
            where: {
                deletedAt: null
            }
        });

        return {
            interns,
            totalInterns
        }

    }

    // SEARCH INTERN w/ PAGINATION METHOD
    async searchInterns(query: string, skip: number, limit: number) {

        const interns = await prisma.intern.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: null,
                OR: [
                    {
                        firstname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        school: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        mentor: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        role: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }

                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const totalInterns = await prisma.intern.count({
            where: {
                deletedAt: null,
                OR: [
                    {
                        firstname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        school: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        mentor: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        role: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });

        return {
            interns,
            totalInterns
        }

    }

    // RESET PASSWORD METHOD
    async resetInternPassword(id: number, data: { newPassword: string }) {
        
        const newInternPassword = await prisma.account.update({
            where: {
                id: id
            },
            data: {
                password: data.newPassword
            }
        });

        return newInternPassword;

    }

}

export default InternRepo;