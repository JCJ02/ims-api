import TestRepo from "../repo/TestRepo";

class TestService {

    private test

    constructor(){
        this.test = new TestRepo();
    }

    async index(){
        return this.test.index();
    }

}

export default TestService;