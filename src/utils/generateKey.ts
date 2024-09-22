import crypto from "crypto";
import bcrypt from "bcryptjs";

const generateRandomKey = crypto.randomBytes(16).toString("hex");

const hashedKey = bcrypt.hashSync(generateRandomKey, 10);

console.log(hashedKey);