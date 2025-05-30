import { Request, Response } from "express";
import AppResponse from "../utils/appResponse";
import AdminService from "../services/AdminService";
import { createAdminSchema, authenticateAdminSchema, updateAdminSchema, updateAdminPasswordSchema } from "../utils/zod/AdminSchema";
import { sendingEmailSchema } from "../utils/zod/EmailSchema";
import { authenticationMiddlewareRequest } from "../types/AuthenticationMiddlewareType";
import TestService from "../services/TestService";
import { generateToken, verifyRefreshToken } from "../utils/token";


class AdminController {

    private adminService;
    private testService;

    constructor() {

        this.adminService = new AdminService();
        this.testService = new TestService();

        this.test = this.test.bind(this);
        this.accessToken = this.accessToken.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.create = this.create.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.update = this.update.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.delete = this.delete.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.list = this.list.bind(this);
        this.get = this.get.bind(this);
        this.archive = this.archive.bind(this);
        this.archiveList = this.archiveList.bind(this);

    }

    // TEST API
    async test(req: Request, res: Response) {
        try {

            const result = await this.testService.index(req.body);

            if (!result) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "API Testing Failed!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: result,
                    message: "API Testing Successfully!!",
                    code: 200
                });
            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            })
        }
    }

    // VERIFY ACCESS TOKEN FUNCTION
    async accessToken(req: authenticationMiddlewareRequest, res: Response) {

        try {

            const admin = req.user;
            //console.log(admin);
            if (!admin) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: {
                        id: admin.id,
                        firstname: admin.firstname,
                        lastname: admin.lastname,
                        email: admin.email,
                        role: admin.role
                    },
                    message: "Admin Found!",
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

    // CREATE REFRESH TOKEN FUNCTION
    async refreshToken(req: Request, res: Response) {
        try {
            // 1. EXTRACT REFRESH TOKEN
            const authorizationHeader = req.headers.authorization;

            if (!authorizationHeader?.startsWith('Bearer ')) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Authorization Header with Bearer Token Required",
                    code: 401
                });
            }

            const refreshToken = authorizationHeader.split(' ')[1].trim();

            // 2. VERIFY REFRESH TOKEN
            const decoded = verifyRefreshToken(refreshToken);

            // 3. FETCH ADMIN FROM DATABASE USING ID FROM REFRESH TOKEN
            const adminService = new AdminService();
            const admin = await adminService.show(decoded.id);

            if (!admin) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin not Found",
                    code: 404
                });
            }

            // 4. GENERATE NEW ACCESS TOKEN
            const newAccessToken = generateToken({
                id: admin.id,
                firstname: admin.firstname,
                lastname: admin.lastname,
                email: admin.email,
                role: admin.role
            });

            // 5. RETURN SUCCESS RESPONSE
            return AppResponse.sendSuccessful({
                res,
                data: { accessToken: newAccessToken },
                message: "Access Token Refreshed",
                code: 200
            });

        } catch (error: any) {
            // HANDLE SPECIFIC JWT ERRORS
            const message = error.message === "Invalid Token" ? "Invalid Refresh Token"
                : error.message === "Token Expired" ? "Refresh Token Expired"
                    : "Token Refresh Failed";

            const code = error.message === "Invalid Token" ? 401
                : error.message === "Token Expired" ? 401
                    : 500;

            return AppResponse.sendErrors({
                res,
                data: null,
                message,
                code
            });
        }
    }

    // CREATE ADMIN METHOD
    async create(req: Request, res: Response) {

        try {

            const validateAdminData = createAdminSchema.safeParse(req.body);

            if (validateAdminData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateAdminData.error.errors[0].message,
                    code: 400
                });
            }

            const newAdmin = await this.adminService.create(validateAdminData.data);

            if (!newAdmin) {
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
                        admin: newAdmin
                    },
                    message: "Successfully Registered!",
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

    // AUTHENTICATE OR LOGIN ADMIN METHOD
    async authenticate(req: Request, res: Response) {

        try {
            //console.log("Raw request body: ", req.body);
            const validation = authenticateAdminSchema.safeParse(req.body);

            if (validation.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validation.error.errors[0].message,
                    code: 400
                });
            }
            //console.log("Validation: ",validation);
            const result = await this.adminService.authenticate(validation.data);
            //console.log("Result: ", result);
            if (!result) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Invalid Credentials!",
                    code: 401
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: result,
                    message: "Login Successful!",
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

    // UPDATE ADMIN METHOD
    async update(req: Request, res: Response) {

        try {

            const adminId = Number(req.params.id);

            const validateAdminData = updateAdminSchema.safeParse(req.body);
            // console.log(validateAdminData);
            if (validateAdminData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateAdminData.error.errors[0].message,
                    code: 400
                });
            } else {

                const updatedAdminData = await this.adminService.update(adminId, validateAdminData.data);

                if (!updatedAdminData) {
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
                            admin: updatedAdminData
                        },
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

    // ADMIN ADMIN PASSWORD METHOD
    async updatePassword(req: Request, res: Response) {

        try {

            const adminId = Number(req.params.id);

            const validatePasswords = updateAdminPasswordSchema.safeParse(req.body);

            if (validatePasswords.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validatePasswords.error.errors[0].message,
                    code: 400
                });
            }
            //console.log("Validated Password: ", validatePasswords);

            const updatedPassword = await this.adminService.updatePassword(adminId, validatePasswords.data);
            //console.log("Updated Password: ", updatedPassword);
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

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // DELETE ADMIN METHOD
    async delete(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);
            // console.log(`ID: ${id}`);
            if (!id) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 404
                });
            } else {
                const isAdminDeleted = await this.adminService.delete(id);
                // console.log(`Admin Existence: ${isAdminDeleted}`);
                if (!isAdminDeleted) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Delete!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: { "Deleted At": isAdminDeleted.deletedAt },
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

    // SENDING E-MAILS METHOD
    async sendEmail(req: Request, res: Response) {
        try {

            const validateEmail = sendingEmailSchema.safeParse(req.body);

            if (validateEmail.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateEmail.error.errors[0].message,
                    code: 403
                });
            }

            // const sentEmail = await this.adminService.sendEmail(validateEmail.data);

            const sentEmail = await this.adminService.sendEmail({
                email: validateEmail.data.to,
                subject: validateEmail.data.subject,
                message: validateEmail.data.message
            });

            // console.log(`To: ${validateEmail.data.to}`);
            // console.log(`Subject: ${validateEmail.data.subject}`);
            // console.log(`Message: ${validateEmail.data.message}`);

            if (!sentEmail) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Failed To Send Email!",
                    code: 500
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: sentEmail,
                    message: "Sent Email Successfully!",
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

    // LIST w/ SEARCH AND PAGINATION METHOD
    async list(req: Request, res: Response) {

        try {

            const searchResults = await this.adminService.list(req);

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

            const admin = Number(req.params.id);

            const isAdminExist = await this.adminService.show(admin);

            if (!isAdminExist) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: isAdminExist,
                    message: "Admin Found!",
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

            const adminId = Number(req.params.id);

            if (!adminId) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 403
                });
            } else {
                const isAdminRestored = await this.adminService.archive(adminId);

                if (!isAdminRestored) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Restore!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: isAdminRestored,
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

            const searchResults = await this.adminService.archiveList(req);
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

export default AdminController;
