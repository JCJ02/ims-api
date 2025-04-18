import prisma from "./utils/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// CREATE A USER
async function crateAdminUser() { 

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

crateAdminUser()
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

getAllAdminUserss()
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

updateAdminUser()
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

deleteAdminUser()
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });