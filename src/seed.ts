import prisma from "./utils/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// CREATE A USER
async function crateAdminUser() { 

    const hashPassword = bcrypt.hashSync("@lunas123", 10);
    await prisma.admin.create({
        data: {
            firstname: "Testing",
            lastname: "Testing",
            email: 'testing@gmail.com',
            password: hashPassword,
        },
    });

    console.log('Database Seeded Successfully.');
}

// LOGIN ADMIN USER
async function loginAdminUser() {

    try {
        
        const email = "testing@gmail.com";
        const password = "@lunas123";

        const validateAdminUser = await prisma.admin.findUnique({
            where: { 
                email:email   
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

        //
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY Is Not Defined in Environment Variables.");
        }

        // Create JWT for the user
        const token = jwt.sign(
            { 
                id: validateAdminUser.id, 
                email: validateAdminUser.email 
            }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: '1h' }
        );

        console.log("Login Successfull. JWT Token:", token);
        return token;

    } catch (error) {
        console.error(error);
    }

}


// GET ALL USERS
async function getAllAdminUserss() {

    const users = await prisma.admin.findMany({
        where: {
            deletedAt: null
        }
    });

    console.log(users);
}


// UPDATE ADMIN USER
async function updateAdminUser() {

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
}


// DELETE ADMIN USER 
async function deleteAdminUser() {

    const deletedAdminUser = await prisma.admin.update({
        where: {
            id: 4
        },
        data: {
            deletedAt: new Date()
        }
    });

    console.log(deletedAdminUser);
}

// crateAdminUser()
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

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

loginAdminUser()
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });