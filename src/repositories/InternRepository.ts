import prisma from "../utils/prismaClient";
import { internAccountType, internType } from "../types/InternType";

class InternRepository {

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
    async authenticate(data: { email: string }) {

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

        const internId = await prisma.intern.findFirst({
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

    async deleted(id: number) {

        const intern = await prisma.intern.findFirst({
            where: {
                id: id,
                deletedAt: {
                    not: null
                }
            },
            include: {
                account: true
            }
        });

        return intern;

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

    // ARCHIVE METHOD
    async archive(id: number) {

        const restoreIntern = await prisma.intern.update({
            where: {
                id: id,
                deletedAt: {
                    not: null
                }
            },
            data: {
                deletedAt: null,
                account: {
                    updateMany: {
                        where: {
                            internId: id,
                            deletedAt: {
                                not: null
                            }
                        },
                        data: {
                            deletedAt: null
                        }
                    }
                }
            }
        });

        return restoreIntern;

    }

    // ARCHIVE LIST w/ SEARCH AND PAGINATION METHOD
    async archiveList(query: string, skip: number, limit: number) {

        const deletedInterns = await prisma.intern.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: {
                    not: null
                },
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

        const totalDeletedInterns = await prisma.intern.count({
            where: {
                deletedAt: {
                    not: null
                },
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
            deletedInterns,
            totalDeletedInterns
        }

    }

}

export default InternRepository;