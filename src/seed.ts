import prisma from "./utils/client";
import bcrypt from "bcryptjs";

// CREATE AN ADMIN USER
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

async function createRole() {

    try {
        
        await prisma.role.create({
            data: {
                roleId: "24-0001",
                roleName: "Admin",
                roleDescription: "Adminstrator"
            }
        });

        console.log("Successfully Created!")

    } catch (error) {
        
        console.error("ERROR Seeding Database: ", error)

    } finally {

        await prisma.$disconnect();

    }

}

createAdmin()
    .catch(error => {
        console.error("Error In Admin User Creation: ", error);
        process.exit(1);
    });

createRole()
    .catch(error => {
        console.error("Error In Role Creation: ", error);
        process.exit(1);
    });
