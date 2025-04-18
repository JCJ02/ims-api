import TestRepository from "../repositories/TestRepository";


class TestService {

    private testRepository;

    constructor() {
        this.testRepository = new TestRepository();
    }

    async index(data: { message: string }) {
        return await this.testRepository.index(data);
    }

}

export default TestService;