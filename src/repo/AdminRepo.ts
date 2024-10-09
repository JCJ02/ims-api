import prisma from "../utils/client";

class AdminRepo {

    // CREATE ADMIN METHOD
    async createAdmin(data: any) {

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
                },
            });
        });

        return newAdmin;

    }

    // AUTHENTICATE OR LOGIN ADMIN METHOD
    async authenticate(data: any) {
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

        const adminId = await prisma.admin.findUnique({
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

    // UPDATE ADMIN METHOD
    async updateAdmin(data: any) {

        const editAdmin = await prisma.admin.update({
            where: {
                id: data.id
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
    async updateAdminPassword(id: number, data: { newPassword: string }) {

        const editAdminPassword = await prisma.account.update({
            where: { 
                id: id, 
            },
            data: {
                password: data.newPassword
            }
        });

        return editAdminPassword;

    }

    // GET ALL ADMIN DATA METHOD
    async getAllAdmin(data: any) {
        
        const getAllAdmin = await prisma.admin.findMany({
            where: {
                id: data.id,
                deletedAt: null
            }
        });

        return getAllAdmin;

    }

}

export default AdminRepo;