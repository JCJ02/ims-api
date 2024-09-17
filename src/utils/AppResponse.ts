import { Response } from "express";

type appResponseParams = {
    res: Response,
    message?: string,
    data: unknown,
    code: number;
}

class AppResponse {
    static sendSuccessfull({res, message, data, code}: appResponseParams): void {
        res.status(code).json({
            message,
            data,
            code
        })
    }

    static sendErrors({res, message, data, code}: appResponseParams): void {
        res.status(code).json({
            message,
            data,
            code
        })
    }
}

export default AppResponse;
