import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate a random hex token of a given length.
 * @param {number} len
 * @returns {string}
 */
export function generateRandomToken(len = 32) {
    return crypto.randomBytes(len).toString('hex');
}

/**
 * Generate an email verification token.
 * @returns {string}
 */
export function generateVerifyToken() {
    return generateRandomToken(20);
}

/**
 * Generate a password reset token.
 * @returns {string}
 */
export function generateResetToken() {
    return generateRandomToken(20);
}

/**
 * Sign a JWT for authentication.
 * @param {object} payload
 * @param {string} expiresIn
 * @returns {string}
 */
export function signJwt(payload, expiresIn = '7d') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {object}
 */
export function verifyJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}
