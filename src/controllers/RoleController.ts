import RoleService from "../services/RoleService";
import AppResponse from "../utils/AppResponse";
import { roleSchema } from "../utils/validations/RoleSchema";
import { Request, Response } from "express";

class RoleController {

    private roleService;

    constructor() {

        this.roleService = new RoleService();

        this.createRole = this.createRole.bind(this);
        this.updateRole = this.updateRole.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
        this.getRoles = this.getRoles.bind(this);

    }

    // CREATE ROLE METHOD
    async createRole(req: Request, res: Response) {
        try {

            const validateRoleData = roleSchema.safeParse(req.body);

            if(validateRoleData.error) {

                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateRoleData.error.errors[0].message,
                    code: 403
                });

            } else {

                const newRole = await this.roleService.createRole(validateRoleData.data);
                return AppResponse.sendSuccessful({
                    res,
                    data: {
                        role: newRole
                    },
                    message: "Successfully Created!",
                    code: 201
                });

            }

        } catch (error: any) {

            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });

        }
    }

    // UPDATE ROLE METHOD
    async updateRole(req: Request, res: Response) {
        try {

            const validateRoleData = roleSchema.safeParse(req.body);

            if(validateRoleData.error) {

                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateRoleData.error.errors[0].message,
                    code: 403
                });

            } else {
                const editedRole = await this.roleService.updateRole(req, validateRoleData.data);

                if(!editedRole) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Update!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: editedRole,
                        message: "Successfully Updated!",
                        code: 201
                    });
                }
            }
            
        } catch (error: any) {
            
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });

        }
    }

    // DELETE ROLE METHOD
    async deleteRole(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            const isRoleExist = await this.roleService.deleteRole(id);

            if(!isRoleExist) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Role Not Found!",
                    code: 404
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: null,
                    message: "Deleted Successfully!",
                    code: 201
                });
            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
    }

    // GET ROLES w/ PAGINATION METHOD
    async getRoles(req: Request, res: Response) {
        try {

            const paginatedRoles = await this.roleService.getRoles(req);

            return AppResponse.sendSuccessful({
                res,
                data: paginatedRoles,
                message: "List Of Roles!",
                code: 200,
            });

        } catch (error: any) {

            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500,
            });

        }
    }

}

export default RoleController;