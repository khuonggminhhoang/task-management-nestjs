import * as bcrypt from "bcrypt";

export default async function hashPasswordHelper(plaintextPassword: string): Promise<string> {
    const salt = 10;
    const password = await bcrypt.hash(plaintextPassword, salt);
    return password;
}