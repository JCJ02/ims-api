import { adminAccountType, adminType } from "../types/AdminType";
import prisma from "../utils/client";

class AdminRepo {

    // CREATE ADMIN METHOD
    async create(data: adminAccountType) {

        const newAdmin = await prisma.$transaction(async (prisma) => {
            return await prisma.admin.create({
                data: {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    account: {
                        create: {
                            password: data.password
                        }
                    }
                }
            });
        });

        return newAdmin;

    }

    // AUTHENTICATE OR LOG IN ADMIN METHOD
    async authenticate(data: { email: string }) {
        //console.log("Email: ", data.email);
        const admin = await prisma.admin.findFirst({
            where: {
                email: data.email,
                deletedAt: null
            },
            include: {
                account: true
            }
        });
        //console.log("Admin: ", admin);
        return admin;

    }

    // GET ADMIN ID METHOD
    async show(id: number) {

        const adminId = await prisma.admin.findFirst({
            where: {
                id: id,
                deletedAt: null
            },
            include: {
                account: true
            }
        });

        return adminId;

    }

    // VALIDATE EMAIL METHOD
    async validateEmail(email: string) {

        const isEmailExist = await prisma.admin.findFirst({
            where: {
                email: email,
                deletedAt: null
            }
        });

        return isEmailExist;

    }

    async deleted(id: number) {

        const adminId = await prisma.admin.findFirst({
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

        return adminId;

    }

    // UPDATE ADMIN METHOD
    async update(id: number, data: adminType) {

        const editAdmin = await prisma.admin.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
            }
        });

        return editAdmin;

    }

    // UPDATE ADMIN PASSWORD METHOD
    async updatePassword(id: number, data: { newPassword: string }) {

        const editAdminPassword = await prisma.account.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                password: data.newPassword
            }
        });

        return editAdminPassword;

    }

    // DELETE ADMIN METHOD
    async delete(id: number) {
        const softDeleteAdmin = await prisma.admin.update({
            where: {
                id: id,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
                account: {
                    updateMany: {
                        where: {
                            adminId: id,
                            deletedAt: null
                        },
                        data: {
                            deletedAt: new Date()
                        }
                    }
                }
            },
        });

        return softDeleteAdmin;
    }

    // LIST w/ SEARCH AND PAGINATION METHOD
    async list(query: string, skip: number, limit: number) {

        const admins = await prisma.admin.findMany({
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

        const totalAdmins = await prisma.admin.count({
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
                        role: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });

        return {
            admins,
            totalAdmins
        }

    }

    // ARCHIVE METHOD
    async archive(id: number) {

        const restoreAdmin = await prisma.admin.update({
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
                            adminId: id,
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

        return restoreAdmin;

    }

    // ARCHIVE LIST w/ SEARCH AND PAGINATION METHOD
    async archiveList(query: string, skip: number, limit: number) {

        const deletedAdmins = await prisma.admin.findMany({
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

        const totalDeletedAdmins = await prisma.admin.count({
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
                        role: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });

        return {
            deletedAdmins,
            totalDeletedAdmins
        }

    }

}

export default AdminRepo;