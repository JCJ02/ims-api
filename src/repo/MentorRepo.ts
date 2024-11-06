import { mentorType } from "../types/MentorType";
import prisma from "../utils/client";

class MentorRepo {

    // CREATE MENTOR METHOD
    async create(data: mentorType) {

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

    // VALIDATE EMAIL METHOD
    async validateEmail(email: string) {

        const isEmailExist = await prisma.mentor.findFirst({
            where: {
                email: email,
                deletedAt: null
            }
        });

        return isEmailExist;

    }

    async deleted(id: number) {

        const mentor = await prisma.mentor.findFirst({
            where: {
                id: id,
                deletedAt: {
                    not: null
                }
            }
        });

        return mentor;

    }

    // UPDATE MENTOR METHOD
    async update(id: number, data: mentorType) {
        
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
    async delete(id: number) {

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

    // MENTOR LIST w/ SEARCH AND PAGINATION METHOD
    async list(query: string, skip: number, limit: number) {

        const mentors = await prisma.mentor.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: null,
                OR: [
                    {
                        firstname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        role: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const totalMentors = await prisma.mentor.count({
            where: {
                deletedAt: null,
                OR: [
                    {
                        firstname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        role: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });

        return {
            mentors,
            totalMentors
        }

    }

    // ARCHIVE METHOD
    async archive(id: number) {

        const restoreMentor = await prisma.mentor.update({
            where: {
                id: id,
                deletedAt: {
                    not: null
                }
            },
            data: {
                deletedAt: null,
            }
        });

        return restoreMentor;

    }

    // MENTOR ARCHIVE LIST METHOD
    async archiveList(query: string, skip: number, limit: number) {

        const deletedMentors = await prisma.mentor.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: {
                    not: null
                },
                OR: [
                    {
                        firstname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        role: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const totalDeletedMentors = await prisma.mentor.count({
            where: {
                deletedAt: {
                    not: null
                },
                OR: [
                    {
                        firstname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        role: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });

        return {
            deletedMentors,
            totalDeletedMentors
        }

    }

}

export default MentorRepo;