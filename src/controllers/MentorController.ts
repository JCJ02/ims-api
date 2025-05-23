import { Request, Response } from "express";
import MentorService from "../services/MentorService";
import AppResponse from "../utils/appResponse";
import { createMentorSchema } from "../utils/zod/MentorSchema";

class MentorController {

    private mentorService;

    constructor() {

        this.mentorService = new MentorService();

        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.list = this.list.bind(this);
        this.get = this.get.bind(this);
        this.archive = this.archive.bind(this);
        this.archiveList = this.archiveList.bind(this);

    }

    // CREATE MENTOR METHOD
    async create(req: Request, res: Response) {

        try {

            const validateMentorData = createMentorSchema.safeParse(req.body);

            if (validateMentorData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateMentorData.error.errors[0].message,
                    code: 400
                });
            } else {

                const newMentor = await this.mentorService.create(validateMentorData.data);

                if (!newMentor) {
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
    async update(req: Request, res: Response) {

        try {

            const mentorId = Number(req.params.id);

            const validatedMentorData = createMentorSchema.safeParse(req.body);

            if (validatedMentorData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validatedMentorData.error.errors[0].message,
                    code: 403
                });
            } else {

                const updatedMentorData = await this.mentorService.update(mentorId, validatedMentorData.data);

                if (!updatedMentorData) {

                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "E-mail Is Already Exist!",
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
    async delete(req: Request, res: Response) {

        try {

            const mentorId = Number(req.params.id);

            if (!mentorId) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Mentor Not Found!",
                    code: 400
                });
            } else {

                const isMentorDeleted = await this.mentorService.delete(mentorId);

                if (!isMentorDeleted) {
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

    // SEARCH MENTORS w/ PAGINATION METHOD
    async list(req: Request, res: Response) {

        try {

            const searchResults = await this.mentorService.list(req);

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

            const mentor = Number(req.params.id);

            const isMentorExist = await this.mentorService.show(mentor);

            if (!isMentorExist) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Mentor Not Found!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: isMentorExist,
                    message: "Mentor Found!",
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

            const mentorId = Number(req.params.id);

            if (!mentorId) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 400
                });
            } else {
                const isMentorRestored = await this.mentorService.archive(mentorId);

                if (!isMentorRestored) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Restore!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: isMentorRestored,
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

            const searchResults = await this.mentorService.archiveList(req);
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

export default MentorController;