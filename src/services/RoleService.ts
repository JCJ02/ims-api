import RoleRepo from "../repo/RoleRepo";
import { Request } from "express";

class RoleService {

    private roleRepo;

    constructor() {

        this.roleRepo = new RoleRepo();

    }

    // CREATE ROLE METHOD
    async create(data: any) {

        const lastRoleId = await this.roleRepo.validateRoleId(data.id);

        // GENERATE NEW ROLE ID
        let newRoleId: string;
        
        if(lastRoleId) {

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

        const newRole = await this.roleRepo.create(roleData);
        
        return newRole;

    }

    // UPDATE ROLE METHOD
    async update(req: Request, data: any) {
        
        const id = Number(req.params.id);

        const roleData = {
            id: id,
            ...data
        }

        const editRole = await this.roleRepo.update(roleData);

        return editRole;

    }

    // DELETE ROLE METHOD
    async delete(id: number) {

        // return await this.roleRepo.delete(id);

        const role = await this.roleRepo.show(id);

        if(!role) {
            return null;
        }
        else {
            const deleteRole = await this.roleRepo.delete(role.id);

            return deleteRole;
        }

    }

    // GET ROLE METHOD
    async get(id: number) {

        const role = await this.roleRepo.show(id);

        if(!role) {
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

        const searchResults = await this.roleRepo.list(query, skip, limit);

        return searchResults;

    }

    // ARCHIVE METHOD
    async archive(id: number) {

        const deletedRole = await this.roleRepo.deleted(id);

        if(!deletedRole) {
            return null;
        } else {
            
            const restoredRole = await this.roleRepo.archive(deletedRole.id);

            return restoredRole;

        }

    }

    // ARCHIVE LIST METHOD
    async archiveList(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchDeletedRoles = await this.roleRepo.archiveList(query, skip, limit);

        return searchDeletedRoles;
        
    }

}

export default RoleService;