import crypto from "crypto";
import bcrypt from "bcryptjs";

const generateRandomKey = crypto.randomBytes(32).toString('hex');

const hashedGeneratedRandomKey = bcrypt.hashSync(generateRandomKey, 10);

console.log(`Generated Random Key: ${generateRandomKey}`);
console.log(`Hashed Generated Random Key: ${hashedGeneratedRandomKey}`);