import { Request } from "express";
import MentorRepo from "../repo/MentorRepo";
import { mentorType } from "../types/MentorType";

class MentorService {

    private mentorRepo;

    constructor() {
        
        this.mentorRepo = new MentorRepo();
        
    }

    // CREATE MENTOR METHOD
    async createMentor(data: mentorType) {
        
        const mentorData = {
            ...data
        }

        const newMentor = await this.mentorRepo.createMentor(mentorData);

        return newMentor;

    }

    // UPDATE MENTOR METHOD
    async updateMentor(id: number, data: mentorType) {

        const mentor = await this.mentorRepo.show(id);

        if(!mentor) {
            return null;
        } else {

            const mentorData = {
                ...data
            }

            const updateMentorData = await this.mentorRepo.updateMentor(mentor.id, mentorData);

            return updateMentorData;

        }

    }

    // SOFT DELETE MENTOR METHOD
    async deleteMentor(id: number) {

        const mentor = await this.mentorRepo.show(id);

        if(!mentor) {
            return null;
        } else {

            const deleteMentor = await this.mentorRepo.deleteMentor(mentor.id);

            return deleteMentor;

        }

    }

    // GET MENTORS LIST w/ PAGINATION METHOD
    async getMentorsList(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;

        const paginatedMentors = await this.mentorRepo.getMentorsList(skip, limit);

        return paginatedMentors;

    }

    // SEARCH MENTORS w/ PAGINATION METHOD
    async searchMentors(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchMentors = await this.mentorRepo.searchMentors(query, skip, limit);

        return searchMentors;

    }

}

export default MentorService;