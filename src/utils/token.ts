import jwt from "jsonwebtoken";

const generateToken = (payload: any) => {

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY Is Not Defined In Environment Variables.");
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
    );

    return token;
}

const verifyToken = (token: string) => {

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
  
    return verifiedToken;

};

export {
    generateToken,
    verifyToken
};