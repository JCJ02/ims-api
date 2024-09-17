import TestRepo from "../repo/TestRepo";
import AdminRepo from "../repo/AdminRepo";

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