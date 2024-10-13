import { Request, Response } from "express";
import AppResponse from "../utils/AppResponse";
// import TestService from "../services/TestService";
import AdminService from "../services/AdminService";
import { adminSchema, authAdminSchema, updateAdminSchema, updateAdminPasswordSchema } from "../utils/validations/AdminSchema";
import { authAdminRequest } from "../types/AdminType";

class AdminController {

    //private testService;
    private adminService;

    constructor() {

        // this.testService = new TestService();
        this.adminService = new AdminService();

        this.index = this.index.bind(this);
        this.createAdmin = this.createAdmin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.updateAdmin = this.updateAdmin.bind(this);
        this.updateAdminPassword = this.updateAdminPassword.bind(this);
        this.getAllAdmin = this.getAllAdmin.bind(this);
        this.deleteAdmin = this.deleteAdmin.bind(this);

    }

    async index(req: authAdminRequest, res: Response) {

        try {

            const admin = req.admin;
            //console.log(admin);
            if(!admin) {
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

    // CREATE ADMIN METHOD
    async createAdmin(req: Request, res: Response) {

        try {

            const validateAdminData = adminSchema.safeParse(req.body);

            if(validateAdminData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateAdminData.error.errors[0].message,
                    code: 400
                });
            }

            const newAdmin = await this.adminService.createAdmin(validateAdminData.data);

            if(!newAdmin) {
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
            const validation = authAdminSchema.safeParse(req.body);

            if(validation.error) {
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
                    message: "Invalid Login Credentials!",  
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
    async updateAdmin(req: Request, res: Response) {

        try {

            const validateAdminData = updateAdminSchema.safeParse(req.body);
            // console.log(validateAdminData);
            if(validateAdminData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateAdminData.error.errors[0].message,
                    code: 400
                });
            } else {

                const admin = await this.adminService.updateAdmin(req, validateAdminData.data);
                // console.log(admin);

                if(!admin) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Update!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: {
                            admin: admin
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
    async updateAdminPassword(req: Request, res: Response) {

        try {       

            const adminId = Number(req.params.id);

            const validatePasswords = updateAdminPasswordSchema.safeParse(req.body);

            if(validatePasswords.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validatePasswords.error.errors[0].message,
                    code: 400
                });
            }
            //console.log("Validated Password: ", validatePasswords);

            const updatedPassword = await this.adminService.updateAdminPassword(adminId, validatePasswords.data);
            //console.log("Updated Password: ", updatedPassword);
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

    // GET ALL ADMIN METHOD
    async getAllAdmin(req: Request, res: Response) {

        try {
            
            const validation = await this.adminService.getAllAdmin(req.body);

            if(!validation) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 404
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: {
                        admin: validation
                    },
                    message: "List Of Admin!",
                    code: 404
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
    async deleteAdmin(req: Request, res: Response) {
        try {
            
            const id = Number(req.params.id);
            // console.log(`ID: ${id}`);
            if(!id) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 404
                });
            } else {
                const isAdminDeleted = await this.adminService.deleteAdmin(id);
                // console.log(`Admin Existence: ${isAdminDeleted}`);
                if(!isAdminDeleted) {
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

}

export default AdminController;
