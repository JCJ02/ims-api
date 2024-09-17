import prisma from "./utils/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// CREATE A USER
async function crateAdminUser() { 

    try {
        const hashPassword = bcrypt.hashSync("@lunas123", 10);
        await prisma.admin.create({
            data: {
                firstname: "Danielle",
                lastname: "Lunas",
                email: 'lunas.danielle.10262002@gmail.com',
                password: hashPassword,
            },
        });

        console.log('Database Seeded Successfully.');
    } catch (error) {
        console.error(error);
    }

}

// LOGIN ADMIN USER
async function loginAdminUser() { 

    try {

        const email = "jacobe.johncarlo.02022003@gmail.com";
        const password = "@jacobe123";

        const validateAdminUser = await prisma.admin.findUnique({
            where: { 
                email: email   
            }
        });

        if (!validateAdminUser) {
            console.log("Admin Not Found!");
            return;
        }

        const isPasswordValid = bcrypt.compareSync(password, validateAdminUser.password);
        if (!isPasswordValid) {
            console.log("Invalid Password");
            return;
        }

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not Defined in Environment Variables.");
        }

        // GENERATE JWT FOR ADMIN USER
        const token = jwt.sign(
            { 
                id: validateAdminUser.id, 
                email: validateAdminUser.email 
            }, 
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        console.log("Login Successful. JWT Token:", token);
        return token;

    } catch (error) {
        console.error(error);
    }

}


// GET ALL ADMIN USERS
async function getAllAdminUserss() {

    try {
        const users = await prisma.admin.findMany({
            where: {
                deletedAt: null
            }
        });

        console.log(users);
    } catch (error) {
        console.error(error);
    }

}


// UPDATE ADMIN USER
async function updateAdminUser() {

    try {

        const hashPassword = bcrypt.hashSync("@lunas26", 10);

        const updatedAdminUser = await prisma.admin.update({
            where: {
                id: 4
            },
            data: {
                firstname: "Danielle Ladesma",
                lastname: "Lunas",
                email: 'lunas.danielle.10262002@gmail.com',
                password: hashPassword,
            }
        })

        console.log(updatedAdminUser);

    } catch (error) {
        console.error(error);
    }
    
}


// DELETE ADMIN USER 
async function deleteAdminUser() {

    try {

        const deletedAdminUser = await prisma.admin.update({
            where: {
                id: 4
            },
            data: {
                deletedAt: new Date()
            }
        });
    
        console.log(deletedAdminUser);

    } catch (error) {
        console.error(error);
    }

}

// crateAdminUser()
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

loginAdminUser()
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// getAllAdminUserss()
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

// updateAdminUser()
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

// deleteAdminUser()
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });