import prisma from "../utils/client";

class AdminRepo {

    async createAdmin(data: any) {
            
        const newAdmin = await prisma.admin.create({
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                password: data.password,
            },
        });

        return newAdmin;

    }

    async authenticate(data: any) {

        const admin = await prisma.admin.findFirst({
            where: {
                email: data.email
            }
        });

        return admin;

    }

    async show(id: number) {

        const admin = await prisma.admin.findFirst({
            where: {
                id: id,
                deletedAt: null
            }
        });

        return admin;

    }

}

export default AdminRepo;