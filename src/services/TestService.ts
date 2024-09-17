import { Request, Response } from "express";
import TestRepo from "../repo/TestRepo";

class TestService {

    private test

    constructor(){
        this.test = new TestRepo();
    }

    async index(req: Request, res: Response){
        return this.test.index(req, res);
    }

}

export default TestService;