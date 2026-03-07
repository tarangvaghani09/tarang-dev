import { users, type User } from "@shared/schema";
import bcrypt from "bcrypt";

const BCRYPT_ROUNDS = 10;
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

export function isPasswordHashed(password: string): boolean {
  return BCRYPT_HASH_PATTERN.test(password);
}

export async function hashPasswordForSave(password: string): Promise<string> {
  if (isPasswordHashed(password)) {
    return password;
  }

  const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export { users, type User };
