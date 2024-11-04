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

        return await this.roleRepo.delete(id);

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

}

export default RoleService;