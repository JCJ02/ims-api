import { Request, Response } from "express";
import InternService from "../services/InternService";
import { authenticateInternSchema, createInternSchema, updateInternSchema } from "../utils/zod/InternSchema";
import AppResponse from "../utils/appResponse";
import { updateAdminPasswordSchema } from "../utils/zod/AdminSchema";
import { authenticationMiddlewareRequest } from "../types/AuthenticationMiddlewareType";

class InternController {

    private internService;

    constructor() {

        this.internService = new InternService();

        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.update = this.update.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.delete = this.delete.bind(this);
        this.list = this.list.bind(this);
        this.get = this.get.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.archive = this.archive.bind(this);
        this.archiveList = this.archiveList.bind(this);

    }

    async index(req: authenticationMiddlewareRequest, res: Response) {
        try {
            const intern = req.user;
            if (!intern) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Intern Not Found!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: {
                        id: intern.id,
                        firstname: intern.firstname,
                        lastname: intern.lastname,
                        email: intern.email,
                        role: intern.role
                    },
                    message: "Intern Found!",
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

    // CREATE INTERN
    async create(req: Request, res: Response) {

        try {

            const validateInternData = createInternSchema.safeParse(req.body);

            if (validateInternData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateInternData.error.errors[0].message,
                    code: 400
                });
            } else {

                const newIntern = await this.internService.create(validateInternData.data);

                if (!newIntern) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "E-mail Is Already Exist!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: {
                            intern: newIntern
                        },
                        message: "Successfully Registered!",
                        code: 201
                    })
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

    // AUTHENTICATE OR LOG IN INTERN METHOD
    async authenticate(req: Request, res: Response) {

        try {

            const validation = authenticateInternSchema.safeParse(req.body);

            if (validation.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validation.error.errors[0].message,
                    code: 401
                });
            } else {

                const result = await this.internService.authenticate(validation.data);

                if (!result) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Invalid Log In Credentials",
                        code: 401
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: result,
                        message: "Log In Successfully!",
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

    // UPDATE INTERN METHOD
    async update(req: Request, res: Response) {

        try {

            const internId = Number(req.params.id);

            const validateInternData = updateInternSchema.safeParse(req.body);

            if (validateInternData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateInternData.error.errors[0].message,
                    code: 403
                });
            } else {

                const updateInternData = await this.internService.update(internId, validateInternData.data);

                if (!updateInternData) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "E-mail Is Already Exist!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: {
                            intern: updateInternData
                        },
                        message: "Successfully Updated!",
                        code: 201
                    });
                }

            }

        } catch (error: any) {
            //console.error("Update error:", error);
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // UPDATE INTERN PASSWORD METHOD
    async updatePassword(req: Request, res: Response) {

        try {

            const internId = Number(req.params.id);

            const validatePasswords = updateAdminPasswordSchema.safeParse(req.body);

            if (validatePasswords.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validatePasswords.error.errors[0].message,
                    code: 400
                });
            } else {

                const updatedPassword = await this.internService.updatePassword(internId, validatePasswords.data);

                if (!updatedPassword) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Incorrect Current Password!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: null,
                        message: "Successfully Updated Password!",
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

    // DELETE INTERN METHOD
    async delete(req: Request, res: Response) {

        try {

            const internId = Number(req.params.id);

            if (!internId) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Intern Not Found!",
                    code: 400
                });
            } else {
                const isInternDeleted = await this.internService.delete(internId);

                if (!isInternDeleted) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Delete!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: { "Deleted At": isInternDeleted.deletedAt },
                        message: "Successfully Deleted!",
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

    // INTERN LIST w/ SEARCH AND PAGINATION METHOD
    async list(req: Request, res: Response) {

        try {

            const searchResults = await this.internService.list(req);

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

    async get(req: Request, res: Response) {
        try {

            const intern = Number(req.params.id);

            const isInternExist = await this.internService.show(intern);

            // console.log(`Intern Data: ${isInternExist}`);

            if (!isInternExist) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Intern Not Found!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: isInternExist,
                    message: "Intern Found!",
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

    // RESET PASSWORD METHOD
    async resetPassword(req: Request, res: Response) {

        try {

            const internId = Number(req.params.id);

            const isPasswordUpdated = await this.internService.resetPassword(internId);

            if (!isPasswordUpdated) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Incorrect Credentials!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: null,
                    message: "Reset Password Successfully!",
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

    // ARCHIVE METHOD
    async archive(req: Request, res: Response) {

        try {

            const interdId = Number(req.params.id);

            if (!interdId) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Intern Not Found!",
                    code: 400
                });
            } else {
                const isInternRestored = await this.internService.archive(interdId);

                if (!isInternRestored) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Restore!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: isInternRestored,
                        message: "Successfully Restored!",
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

    // ARCHIVE LIST w/ SEARCH AND PAGINATION METHOD
    async archiveList(req: Request, res: Response) {

        try {

            const searchResults = await this.internService.archiveList(req);
            console.log(`Searched: ${searchResults}`);
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

export default InternController;