import { Response } from "express";

type APP_RESPONSE_PARAMS = {
    res: Response,
    message?: string,
    data: unknown,
    code: number;
}

class AppResponse {
    static sendSuccessful({ res, message, data, code }: APP_RESPONSE_PARAMS): void {
        res.status(code).json({
            data,
            message,
            code
        });
    }

    static sendErrors({ res, message, data, code }: APP_RESPONSE_PARAMS): void {

        let returnMessage;

        if (code !== 500) {
            returnMessage = message;
        } else {
            if (process.env.ENV == "development") {
                returnMessage = message;
            } else {
                returnMessage = "Internal Server Error!";
            }
        }

        res.status(code).json({
            data,
            message: returnMessage,
            code
        });
    }
}

export default AppResponse;
