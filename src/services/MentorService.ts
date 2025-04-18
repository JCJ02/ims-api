import { Request } from "express";
import { mentorType } from "../types/MentorType";
import MentorRepository from "../repositories/MentorRepository";

class MentorService {

    private mentorRepository;

    constructor() {

        this.mentorRepository = new MentorRepository();

    }

    // CREATE MENTOR METHOD
    async create(data: mentorType) {

        const isEmailExist = await this.mentorRepository.validateEmail(data.email);

        if (isEmailExist) {
            return null;
        } else {

            const mentorData = {
                ...data
            }

            const newMentor = await this.mentorRepository.create(mentorData);

            return newMentor;

        }

    }

    // SHOW METHOD
    async show(id: number) {

        const mentor = await this.mentorRepository.show(id);

        if (!mentor) {
            return null;
        }

        return mentor;

    }

    // VALIDATE EMAIL METHOD
    async validateEmail(email: string) {

        const emailAddress = await this.mentorRepository.validateEmail(email);

        if (!emailAddress) {
            return null;
        }

        return emailAddress;

    }

    // UPDATE MENTOR METHOD
    async update(id: number, data: mentorType) {

        const mentor = await this.mentorRepository.show(id);

        if (!mentor) {
            return null;
        } else {

            if (data.email) {
                const isEmailExist = await this.mentorRepository.validateEmail(data.email);
                if (isEmailExist && isEmailExist.id !== id) {
                    return null;
                }
            }

            const mentorData = {
                ...data
            }

            const updateMentorData = await this.mentorRepository.update(mentor.id, mentorData);

            return updateMentorData;

        }

    }

    // SOFT DELETE MENTOR METHOD
    async delete(id: number) {

        const mentor = await this.mentorRepository.show(id);

        if (!mentor) {
            return null;
        } else {

            const deleteMentor = await this.mentorRepository.delete(mentor.id);

            return deleteMentor;

        }

    }

    // MENTOR LIST w/ SEARCH AND PAGINATION METHOD
    async list(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchMentors = await this.mentorRepository.list(query, skip, limit);

        return searchMentors;

    }

    // ARCHIVE METHOD
    async archive(id: number) {

        const deletedMentor = await this.mentorRepository.deleted(id);

        if (!deletedMentor) {
            return null;
        } else {

            const restoredMentor = await this.mentorRepository.archive(deletedMentor.id);

            return restoredMentor;

        }

    }

    // ARCHIVE LIST w/ SEARCH AND PAGINATION METHOD
    async archiveList(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchDeletedMentors = await this.mentorRepository.archiveList(query, skip, limit);
        console.log(`Search Deleted Interns: ${searchDeletedMentors}`);
        return searchDeletedMentors;

    }

}

export default MentorService;