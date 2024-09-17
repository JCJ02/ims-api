import { Response } from "express";

type appResponseParams = {
    res: Response,
    message?: string,
    data: unknown,
    code: number;
}

class AppResponse {
    static sendSuccessful({res, message, data, code}: appResponseParams): void {
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
