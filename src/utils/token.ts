import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (payload: any) => {

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not Defined in Environment Variables.");
    }

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
    );

    return token
}

export default generateToken;