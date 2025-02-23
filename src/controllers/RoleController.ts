import RoleService from "../services/RoleService";
import AppResponse from "../utils/appResponse";
import { createRoleSchema } from "../utils/zod/RoleSchema";
import { Request, Response } from "express";

class RoleController {

    private roleService;

    constructor() {

        this.roleService = new RoleService();

        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.list = this.list.bind(this);
        this.get = this.get.bind(this);
        this.archive = this.archive.bind(this);
        this.archiveList = this.archiveList.bind(this);

    }

    // CREATE ROLE METHOD
    async create(req: Request, res: Response) {
        try {

            const validateRoleData = createRoleSchema.safeParse(req.body);

            if (validateRoleData.error) {

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

            const validateRoleData = createRoleSchema.safeParse(req.body);

            if (validateRoleData.error) {

                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateRoleData.error.errors[0].message,
                    code: 403
                });

            } else {
                const editedRole = await this.roleService.update(req, validateRoleData.data);

                if (!editedRole) {
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

            if (!isRoleExist) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Failed To Delete!",
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

    // GET ROLE METHOD
    async get(req: Request, res: Response) {
        try {

            const role = Number(req.params.id);

            const isRoleExist = await this.roleService.get(role);

            if (!isRoleExist) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Role Not Found!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: isRoleExist,
                    message: "Role Found!",
                    code: 200
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

    // ARCHIVE METHOD
    async archive(req: Request, res: Response) {

        try {

            const roleId = Number(req.params.id);

            if (!roleId) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Role Not Found!",
                    code: 403
                });
            } else {

                const isRoleRestored = await this.roleService.archive(roleId);

                if (!isRoleRestored) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Restore!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: isRoleRestored,
                        message: "Sucessfully Restored!",
                        code: 200
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

    // ARCHIVE LIST METHOD
    async archiveList(req: Request, res: Response) {

        try {

            const searchResults = await this.roleService.archiveList(req);
            // console.log(`Searched: ${searchResults}`);
            return AppResponse.sendSuccessful({
                res,
                data: searchResults,
                message: "Result!",
                code: 200
            });

        } catch (error: any) {

            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });

        }

    }

}

export default RoleController;