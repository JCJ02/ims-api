import prisma from "../utils/client";
import { internAccountType, internType } from "../types/InternType";

class InternRepo {

    // CREATE INTERN METHOD
    async create(data: internAccountType, prismaTrasaction: any) {

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

    // VALIDATE EMAIL METHOD
    async validateEmail(email: string) {

        const isEmailExist = await prisma.intern.findFirst({
            where: {
                email: email,
                deletedAt: null
            }
        });

        return isEmailExist;

    }

    // UPDATE INTERN METHOD
    async update(id: number, data: internType) {
        
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
    async updatePassword(id: number, data: { newPassword: string }) {

        const editInternPassword = await prisma.account.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                password: data.newPassword 
            }
        });

        return editInternPassword;

    }

    // DELETE INTERN METHOD
    async delete(id: number) {

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

    // INTERN LIST w/ SEARCH AND PAGINATION METHOD
    async list(query: string, skip: number, limit: number) {

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

}

export default InternRepo;