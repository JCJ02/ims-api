import { Request } from "express";
import RoleRepository from "../repositories/RoleRepository";

class RoleService {

    private roleRepository;

    constructor() {

        this.roleRepository = new RoleRepository();

    }

    // CREATE ROLE METHOD
    async create(data: any) {

        const lastRoleId = await this.roleRepository.validateRoleId(data.id);

        // GENERATE NEW ROLE ID
        let newRoleId: string;

        if (lastRoleId) {

            const lastNumber = parseInt(lastRoleId.roleId.split('-')[1]);

            const incrementedNumber = (lastNumber + 1).toString().padStart(4, '0');

            newRoleId = `LWS-${incrementedNumber}`;

        } else {

            newRoleId = 'LWS-0001';
        }

        const roleData = {
            roleId: newRoleId,
            ...data
        }

        const newRole = await this.roleRepository.create(roleData);

        return newRole;

    }

    // UPDATE ROLE METHOD
    async update(req: Request, data: any) {

        const id = Number(req.params.id);

        const roleData = {
            id: id,
            ...data
        }

        const editRole = await this.roleRepository.update(roleData);

        return editRole;

    }

    // DELETE ROLE METHOD
    async delete(id: number) {

        // return await this.roleRepo.delete(id);

        const role = await this.roleRepository.show(id);

        if (!role) {
            return null;
        }
        else {
            const deleteRole = await this.roleRepository.delete(role.id);

            return deleteRole;
        }

    }

    // GET ROLE METHOD
    async get(id: number) {

        const role = await this.roleRepository.show(id);

        if (!role) {
            return null;
        } else {
            return role;
        }

    }


    // ROLE LIST w/ SEARCH AND PAGINATION
    async list(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchResults = await this.roleRepository.list(query, skip, limit);

        return searchResults;

    }

    // ARCHIVE METHOD
    async archive(id: number) {

        const deletedRole = await this.roleRepository.deleted(id);

        if (!deletedRole) {
            return null;
        } else {

            const restoredRole = await this.roleRepository.archive(deletedRole.id);

            return restoredRole;

        }

    }

    // ARCHIVE LIST METHOD
    async archiveList(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchDeletedRoles = await this.roleRepository.archiveList(query, skip, limit);

        return searchDeletedRoles;

    }

}

export default RoleService;