import { mentorType } from "../types/MentorType";
import prisma from "../utils/client";

class MentorRepo {

    // CREATE MENTOR METHOD
    async createMentor(data: mentorType) {

        const newMentor = await prisma.$transaction( async (prisma) => {
            return await prisma.mentor.create({
                data: {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    role: data.role
                }
            });
        });

        return newMentor;

    }

    // SHOW METHOD
    async show(id: number) {

        const mentorId = await prisma.mentor.findFirst({
            where: {
                id: id,
                deletedAt: null
            }
        });

        return mentorId;

    }

    // UPDATE MENTOR METHOD
    async updateMentor(id: number, data: mentorType) {
        
        const updateMentorData = await prisma.mentor.update({
            where: {
                id: id
            },
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                role: data.role
            }
        });

        return updateMentorData;

    }

    // SOFT DELETE MENTOR METHOD
    async deleteMentor(id: number) {

        const softDeleteMentor = await prisma.mentor.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        });

        return softDeleteMentor;

    }

}

export default MentorRepo;