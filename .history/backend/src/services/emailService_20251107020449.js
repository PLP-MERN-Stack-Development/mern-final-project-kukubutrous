import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // use TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});

/**
 * Send account verification email.
 * @param {object} user - User instance.
 * @param {string} token - Verification token.
 */
export async function sendVerificationEmail(user, token) {
    const verifyUrl = `${process.env.CLIENT_URL}/verify?token=${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Verify your Roommate Finder account',
        html: `
      <p>Hi ${user.firstName},</p>
      <p>Click the link below to verify your account:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
    });
}

/**
 * Send password reset email.
 * @param {object} user - User instance.
 * @param {string} token - Reset token.
 */
export async function sendResetPasswordEmail(user, token) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Reset your Roommate Finder password',
        html: `
      <p>Hi ${user.firstName},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
    });
}
