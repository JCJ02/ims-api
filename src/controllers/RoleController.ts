import RoleService from "../services/RoleService";
import AppResponse from "../utils/AppResponse";
import { roleSchema } from "../utils/validations/RoleSchema";
import { Request, Response } from "express";

class RoleController {

    private roleService;

    constructor() {

        this.roleService = new RoleService();

        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.list = this.list.bind(this);

    }

    // CREATE ROLE METHOD
    async create(req: Request, res: Response) {
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

                const newRole = await this.roleService.create(validateRoleData.data);
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
    async update(req: Request, res: Response) {
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
                const editedRole = await this.roleService.update(req, validateRoleData.data);

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
    async delete(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            const isRoleExist = await this.roleService.delete(id);

            if(!isRoleExist) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Delete Unsuccessful!",
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

    // ROLE LIST w/ SEARCH AND PAGINATION
    async list(req: Request, res: Response) {
        try {

            const searchResults = await this.roleService.list(req);

            return AppResponse.sendSuccessful({
                res,
                data: searchResults,
                message: "Result!",
                code: 200
            })
            
        } catch (error: any) {
            
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            })

        }
    }

}

export default RoleController;