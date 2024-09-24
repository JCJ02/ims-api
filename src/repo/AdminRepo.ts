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
        //console.log("Email: ", data.email);
        const admin = await prisma.admin.findFirst({
            where: {
                email: data.email,
                deletedAt: null
            }
        });
        //console.log("Admin: ", admin);
        return admin;

    }

    async show(id: number) {

        const adminId = await prisma.admin.findFirst({
            where: {
                id: id,
                deletedAt: null
            }
        });

        return adminId;

    }

    // UPDATE ADMIN
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

    // UPDATE ADMIN PASSWORD
    async updateAdminPassword(id: number, data: any) {

        const editAdminPassword = await prisma.admin.update({
            where: { id: id },
            data: { password: data.password }
        });

        return editAdminPassword;

    }

    async getAdmin(data: any) {


    }

}

export default AdminRepo;