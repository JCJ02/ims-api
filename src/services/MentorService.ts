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

            const updateMentorData = this.mentorRepo.updateMentor(mentor.id, mentorData);

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

}

export default MentorService;