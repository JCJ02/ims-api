import prisma from "../utils/prismaClient";

class RoleRepository {

    // CREATE ROLE METHOD
    async create(data: any) {

        const newRole = await prisma.role.create({
            data: {
                roleId: data.roleId,
                roleName: data.roleName,
                roleDescription: data.roleDescription
            }
        });

        return newRole;

    }

    // SHOW METHOD
    async show(id: number) {

        const role = await prisma.role.findFirst({
            where: {
                id: id,
                deletedAt: null
            }
        });

        return role;

    }

    async deleted(id: number) {

        const role = await prisma.role.findFirst({
            where: {
                id: id,
                deletedAt: {
                    not: null
                }
            }
        });

        return role;

    }

    // VALIDATE ROLE ID
    async validateRoleId(id: string) {

        const isRoleIdExist = await prisma.role.findFirst({
            where: {
                roleId: id,
                deletedAt: null
            },
            orderBy: {
                roleId: 'desc',
            },
        });

        return isRoleIdExist;

    }

    // UPDATE ROLE METHOD
    async update(data: any) {

        const editRole = await prisma.role.update({
            where: {
                id: data.id
            },
            data: {
                roleName: data.roleName,
                roleDescription: data.roleDescription
            }
        });

        return editRole;

    }

    // DELETE ROLE METHOD
    async delete(id: number) {

        const removeRole = await prisma.role.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        });

        return removeRole;

    }

    // ROLE LIST w/ SEARCH AND PAGINATION
    async list(query: string, skip: number, limit: number) {

        const roles = await prisma.role.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: null,
                OR: [
                    {
                        roleId: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        roleName: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        roleDescription: {
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

        const totalRoles = await prisma.role.count({
            where: {
                deletedAt: null,
                OR: [
                    {
                        roleId: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        roleName: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        roleDescription: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });

        return {
            roles,
            totalRoles,
        };

    }

    // ARCHIVE METHOD
    async archive(id: number) {

        const restoreRole = await prisma.role.update({
            where: {
                id: id,
                deletedAt: {
                    not: null
                }
            },
            data: {
                deletedAt: null
            }
        });

        return restoreRole;

    }

    // ARCHIVE LIST METHOD
    async archiveList(query: string, skip: number, limit: number) {

        const deletedRoles = await prisma.role.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: {
                    not: null
                },
                OR: [
                    {
                        roleId: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        roleName: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        roleDescription: {
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

        const totalDeletedRoles = await prisma.role.count({
            where: {
                deletedAt: {
                    not: null
                },
                OR: [
                    {
                        roleId: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        roleName: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        roleDescription: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });

        return {
            deletedRoles,
            totalDeletedRoles,
        };

    }

}

export default RoleRepository;