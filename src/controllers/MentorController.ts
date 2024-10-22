import { Request, Response } from "express";
import MentorService from "../services/MentorService";
import AppResponse from "../utils/AppResponse";
import { mentorSchema } from "../utils/validations/MentorSchema";

class MentorController {

    private mentorService;

    constructor() {
        
        this.mentorService = new MentorService();

        this.createMentor = this.createMentor.bind(this);
        this.updateMentor = this.updateMentor.bind(this);
        this.deleteMentor = this.deleteMentor.bind(this);

    }

    // CREATE MENTOR METHOD
    async createMentor(req: Request, res: Response) {
        
        try {

            const validateMentorData = mentorSchema.safeParse(req.body);

            if(validateMentorData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateMentorData.error.errors[0].message,
                    code: 400
                });
            } else {

                const newMentor = await this.mentorService.createMentor(validateMentorData.data);

                if(!newMentor) {
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
                            mentor: newMentor
                        },
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

    // UPDATE MENTOR METHOD
    async updateMentor(req: Request, res: Response) {

        try {

            const mentorId = Number(req.params.id);

            const validatedMentorData = mentorSchema.safeParse(req.body);

            if(validatedMentorData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validatedMentorData.error.errors[0].message,
                    code: 403
                });
            } else {

                if(!mentorId) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Mentor Not Found!",
                        code: 403
                    });
                } else {
    
                    const updatedMentorData = await this.mentorService.updateMentor(mentorId, validatedMentorData.data);
    
                    if(!updatedMentorData) {

                        return AppResponse.sendErrors({
                            res,
                            data: null,
                            message: "Failed To Update!",
                            code: 403
                        });

                    } else {

                        return AppResponse.sendSuccessful({
                            res,
                            data: { mentor: updatedMentorData },
                            message: "Successfully Updated!",
                            code: 201
                        });

                    }

                }

            }

            
        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 400
            });
        }

    }

    // SOFT DELETE MENTOR METHOD
    async deleteMentor(req: Request, res: Response) {

        try {

            const mentorId = Number(req.params.id);

            if(!mentorId) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Mentor Not Found!",
                    code: 400
                });
            } else {

                const isMentorDeleted = await this.mentorService.deleteMentor(mentorId);

                if(!isMentorDeleted) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Delete!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: { "Deleted At": isMentorDeleted.deletedAt },
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

export default MentorController;