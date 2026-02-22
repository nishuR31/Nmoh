import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

export function generateOTP(digits = 6) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(min + crypto.randomInt(max - min + 1)).toString();
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function generateResetToken(expiryMinutes = 15) {
  const token = generateToken(32);
  const hashedToken = sha256(token);
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  return { token, hashedToken, expiresAt };
}

export function verifyResetToken(token, hashedToken, expiresAt) {
  if (new Date() > new Date(expiresAt)) {
    return false;
  }
  return sha256(token) === hashedToken;
}

export default {
  hashPassword,
  comparePassword,
  generateToken,
  generateOTP,
  sha256,
  generateResetToken,
  verifyResetToken,
};
