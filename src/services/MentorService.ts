import { Request } from "express";
import MentorRepo from "../repo/MentorRepo";
import { mentorType } from "../types/MentorType";

class MentorService {

    private mentorRepo;

    constructor() {
        
        this.mentorRepo = new MentorRepo();
        
    }

    // CREATE MENTOR METHOD
    async create(data: mentorType) {

        const isEmailExist = await this.mentorRepo.validateEmail(data.email);

        if(isEmailExist) {
            return null;
        } else {

            const mentorData = {
                ...data
            }
    
            const newMentor = await this.mentorRepo.create(mentorData);
    
            return newMentor;

        }

    }

    // SHOW METHOD
    async show(id: number) {

        const mentor = await this.mentorRepo.show(id);

        if(!mentor) {
            return null;
        }

        return mentor;

    }

    // VALIDATE EMAIL METHOD
    async validateEmail(email: string) {

        const emailAddress = await this.mentorRepo.validateEmail(email);

        if(!emailAddress) {
            return null;
        }

        return emailAddress;

    }

    // UPDATE MENTOR METHOD
    async update(id: number, data: mentorType) {

        const mentor = await this.mentorRepo.show(id);

        if(!mentor) {
            return null;
        } else {

            if(data.email) {
                const isEmailExist = await this.mentorRepo.validateEmail(data.email);
                if(isEmailExist && isEmailExist.id !== id) {
                    return null;
                }
            }

            const mentorData = {
                ...data
            }

            const updateMentorData = await this.mentorRepo.update(mentor.id, mentorData);

            return updateMentorData;

        }

    }

    // SOFT DELETE MENTOR METHOD
    async delete(id: number) {

        const mentor = await this.mentorRepo.show(id);

        if(!mentor) {
            return null;
        } else {

            const deleteMentor = await this.mentorRepo.delete(mentor.id);

            return deleteMentor;

        }

    }

    // MENTOR LIST w/ SEARCH AND PAGINATION METHOD
    async list(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchMentors = await this.mentorRepo.list(query, skip, limit);

        return searchMentors;

    }

}

export default MentorService;