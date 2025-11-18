import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// --- Generate Random Token (for email verification, password reset, etc.) ---
export function generateRandomToken(length = 20) {
    return crypto.randomBytes(length).toString('hex');
}

// --- Sign a JWT ---
export function signJwt(payload, expiresIn = '7d') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// --- Verify a JWT ---
export function verifyJwt(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null; // invalid or expired token
    }
}

// --- Optional: Generate Access & Refresh Tokens (if needed later) ---
export function generateAuthTokens(user) {
    const accessToken = signJwt({ id: user.id, role: user.role }, '7d');
    const refreshToken = generateRandomToken(40); // can store in DB if desired
    return { accessToken, refreshToken };
}







/*
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();


export function generateRandomToken(len = 32) {
    return crypto.randomBytes(len).toString('hex');
}


export function generateVerifyToken() {
    // 40 hex chars by default (20 bytes)
    return generateRandomToken(20);
}


export function generateResetToken() {
    return generateRandomToken(20);
}


export function signJwt(payload, expiresIn = '7d') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}


export function verifyJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}
*/