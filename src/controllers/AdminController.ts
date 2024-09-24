import { Request, Response } from "express";
import AppResponse from "../utils/AppResponse";
import TestService from "../services/TestService";
import AdminService from "../services/AdminService";
import { adminSchema, authAdminSchema, updateAdminSchema, updateAdminPasswordSchema } from "../utils/validations/AdminSchema";
import { authAdminRequest } from "../types/AdminType";

class AdminController {

    private testService;
    private adminService;

    constructor() {

        this.testService = new TestService();
        this.adminService = new AdminService();

        this.index = this.index.bind(this);
        this.createAdmin = this.createAdmin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.updateAdmin = this.updateAdmin.bind(this);
        this.updateAdminPassword = this.updateAdminPassword.bind(this);
        this.getAdmin = this.getAdmin.bind(this);

    }

    // TEST
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
                        password: admin.password
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

    // CREATE ADMIN
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
                    message: "Failed To Register!",
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

    // AUTHENTICATE ADMIN
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
                    message: "Invalid Login",  
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

    // UPDATE ADMIN 
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
            }

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
            
        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // ADMIN ADMIN PASSWORD
    async updateAdminPassword(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            if (isNaN(id) || id <= 0) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Invalid Admin ID!",
                    code: 400,
                });
            }
            console.log("Admin ID: ", id);
            
            const validatePasswordData = updateAdminPasswordSchema.safeParse(req.body);
            console.log(validatePasswordData);
            if (validatePasswordData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validatePasswordData.error.errors[0].message,
                    code: 400
                });
            }

            const updatedAdminPassword = await this.adminService.updateAdminPassword(req, validatePasswordData.data);
            console.log("Updated Admin Password", updatedAdminPassword);
            if (!updatedAdminPassword) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found Or Failed To Update Password!",
                    code: 404,
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: { admin: updatedAdminPassword },
                    message: "Password Updated Successfully!",
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

    // GET ADMIN 
    async getAdmin(req: Request, res: Response) {

        try {
            
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
