import prisma from "../utils/client";

class RoleRepo {

    // CREATE ROLE METHOD
    async createRole(data: any) {
        
        const newRole = await prisma.role.create({
            data: {
                roleId: data.roleId,
                roleName: data.roleName,
                roleDescription: data.roleDescription
            }
        });

        return newRole;

    }

    // VALIDATE ROLE ID
    async validateRoleId(id: string) {

        const isRoleIdExist = await prisma.role.findFirst({
            where: {
                roleId: id
            },
            orderBy: {
              roleId: 'desc',
            },
        });

        return isRoleIdExist;

    }

    // UPDATE ROLE METHOD
    async updateRole(data: any) {

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
    async deleteRole(id: number) {

        const removeRole = await prisma.role.update({
            where: {
                id: id,
                deletedAt: null
            },
            data:  {
                deletedAt: new Date()
            }
        });

        return removeRole;

    }

    // GET ROLES w/ PAGINATION METHOD
    async getRoles(skip: number, limit: number) {

        const roles = await prisma.role.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalRoles = await prisma.role.count({
            where: {
                deletedAt: null
            }
        });

        return {
            roles,
            totalRoles,
        };

    }

    // SEARCH ROLES METHOD
    async searchRoles(query: string, skip: number, limit: number) {

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

}

export default RoleRepo;