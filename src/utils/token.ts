import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";

const generateToken = (payload: any) => {

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY Is Not Defined In Environment Variables.");
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    );

    return token;
}

const generateRefreshToken = (payload: any) => {

    if (!process.env.JWT_REFRESH_SECRET_KEY) {
        throw new Error("JWT_REFRESH_SECRET_KEY is not Defined in Environment Variables File!");
    }

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
    );

    return refreshToken;

}

const verifyToken = (token: string) => {

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    return verifiedToken;

};

const verifyRefreshToken = (token: string): JwtPayload => {

    if (!process.env.JWT_REFRESH_SECRET_KEY) {
        throw new Error("JWT_REFRESH_SECRET_KEY is not Defined in Environment Variables File!");
    }

    try {
        const verifiedRefreshToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY) as JwtPayload;
        return verifiedRefreshToken;
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            throw new Error("Invalid Token");
        }
        if (error instanceof TokenExpiredError) {
            throw new Error("Token Expired");
        }
        throw new Error("Token Verification Failed");
    }

}

export {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken
};