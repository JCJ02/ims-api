import { Request, Response } from "express";
import InternService from "../services/InternService";
import { authInternSchema, internSchema, updateInternSchema } from "../utils/validations/InternSchema";
import AppResponse from "../utils/AppResponse";
import { updateAdminPasswordSchema } from "../utils/validations/AdminSchema";
import { authMiddlewareRequest } from "../types/AuthMiddlewareType";

class InternController {

    private internService;

    constructor() {

        this.internService = new InternService();
        
        this.index = this.index.bind(this);
        this.createIntern = this.createIntern.bind(this);
        this.updateIntern = this.updateIntern.bind(this);
        this.updateInternPassword = this.updateInternPassword.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.deleteIntern = this.deleteIntern.bind(this);
        this.getInterns = this.getInterns.bind(this);
        this.searchInterns = this.searchInterns.bind(this);
        this.resetInternPassword = this.resetInternPassword.bind(this);

    }

    async index(req: authMiddlewareRequest, res: Response) {
        try {
            const intern = req.user;
            if(!intern) {
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
    async createIntern(req: Request, res: Response) {

        try {

            const validateInternData = internSchema.safeParse(req.body);

            if(validateInternData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateInternData.error.errors[0].message,
                    code: 400
                });
            }

            const newIntern = await this.internService.createIntern(validateInternData.data);

            if(!newIntern) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Failed To Register Credentials!",
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

            const validation = authInternSchema.safeParse(req.body);

            if(validation.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validation.error.errors[0].message,
                    code: 401
                });
            } else {

                const result = await this.internService.authenticate(validation.data);

                if(!result) {
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
    async updateIntern(req: Request, res: Response) {
        
        try {

            const internId = req;

            const validateInternData = updateInternSchema.safeParse(req.body);

            if(validateInternData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateInternData.error.errors[0].message,
                    code: 403
                });
            } else {
                //console.log("Validated data:", validateInternData.data);
                const updatedIntern = await this.internService.updateIntern(internId, validateInternData.data);

                if(!updatedIntern) {
                    return AppResponse.sendErrors({
                       res,
                       data: null,
                       message: "Failed To Update!!!",
                       code: 403 
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: {
                            intern: updatedIntern
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
    async updateInternPassword(req: Request, res: Response) {
        
        try {
            
            const internId = Number(req.params.id);

            const validatePasswords = updateAdminPasswordSchema.safeParse(req.body);

            if(validatePasswords.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validatePasswords.error.errors[0].message,
                    code: 400
                });
            } else {

                const updatedPassword = await this.internService.updateInternPassword(internId, validatePasswords.data);

                if(!updatedPassword) {
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
    async deleteIntern(req: Request, res: Response) {
        
        try {
            
            const internId = Number(req.params.id);

            if(!internId) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Intern Not Found!",
                    code: 400
                });
            } else {
                const isInternDeleted = await this.internService.deleteIntern(internId);

                if(!isInternDeleted) {
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

    // GET INTERNS w/ PAGINATION METHOD
    async getInterns(req: Request, res: Response) {

        try {
            
            const paginatedInterns = await this.internService.getInterns(req);

            return AppResponse.sendSuccessful({
                res,
                data: paginatedInterns,
                message: "List of Interns!",
                code: 200
            })

        } catch (error: any) {
            
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });

        }

    }

    // SEARCH INTERN w/ PAGINATION METHOD
    async searchInterns(req: Request, res: Response) {

        try {
            
            const searchResults = await this.internService.searchInterns(req);

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

    // RESET PASSWORD METHOD
    async resetInternPassword(req: Request, res: Response) {

        try {

            const internId = Number(req.params.id);

            const isPasswordUpdated = await this.internService.resetInternPassword(internId);

            if(!isPasswordUpdated) {
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

}

export default InternController;