import { Request, Response } from "express";
import AppResponse from "../utils/AppResponse";

class TestRepo {

    async index(req: Request, res: Response){

        const data = "Hello World!";

        return AppResponse.sendSuccessful({
            res,
            data: data,
            message: "Successful Response!",
            code: 200
        });
        
    }

}

export default TestRepo;