import prisma from "./utils/client";
import bcrypt from "bcryptjs";

// CREATE ADMIN METHOD
async function createAdmin() {

    try {

        const hashPassword = bcrypt.hashSync("password", 10);

        await prisma.$transaction(async (prisma) => {
            await prisma.admin.create({
                data: {
                    firstname: "Danielle",
                    lastname: "Lunas",
                    email: 'lunas.danielle.10262002@gmail.com',
                    account: {
                        create: {
                            password: hashPassword
                        }
                    }
                },
            });
        });

        console.log('Successfully Registered!.');

    } catch (error) {

        console.error("Error Seeding Database: ", error);

    } finally {

        await prisma.$disconnect();

    }

}

createAdmin()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error("Error In Admin User Creation: ", error);
        await prisma.$disconnect();
        process.exit(1);
    });

