import crypto from "crypto";
import bcrypt from "bcryptjs";

export const generateRandomKey = async(length: number = 10): Promise<string> => {
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+{}[]";
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const allChars = numbers + specialChars + letters;

    let password = "";

    // ENSURE AT LEAST ONE NUMBER AND ONE SPECIAL CHARACTER
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // GENERATE RANDOME BYTES AND CONVERT IT INTO A SECURE RANDOM PASSWORD
    const randomBytes = crypto.randomBytes(length - 2); // SUBTRACTING 2 FOR THE SPECIAL CHARACTER AND NUMBER
    for (let i = 0; i < randomBytes.length; i++) {
        password += allChars[randomBytes[i] % allChars.length];
    }

    // SHUFFLE THE PASSWORD TO MIX THE REQUIRED CHARACTERS WITH THE RANDOM ONES
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}

const run = async () => {

    const generatedRandomKey = await generateRandomKey(10);

    const hashedKey = bcrypt.hashSync(generatedRandomKey, 10);

    console.log(`Generated Random Key: ${generatedRandomKey}`);
    console.log(`Hashed Generated Random Key: ${hashedKey}`);

}

run();



