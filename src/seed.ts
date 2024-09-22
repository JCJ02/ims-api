import prisma from "./utils/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// CREATE A USER
async function crateAdminUser() { 

    try {
        const hashPassword = bcrypt.hashSync("password", 10);
        await prisma.admin.create({
            data: {
                firstname: "Danielle",
                lastname: "Lunas",
                email: 'lunas.danielle.10262002@gmail.com',
                password: hashPassword,
                role: "Admin"
            },
        });

        console.log('Database Seeded Successfully.');
    } catch (error) {
        console.error(error);
    }

}

crateAdminUser()
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

