






import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});


export async function sendVerificationEmail(user, token) {
    const url = `${process.env.CLIENT_URL}/verify?token=${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Verify your Roommate Finder account',
        html: `<p>Hi ${user.firstName},</p><p>Click to verify: <a href="${url}">${url}</a></p>`
    });
}


export async function sendResetPasswordEmail(user, token) {
    const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Hi ${user.firstName},</p><p>Reset here: <a href="${url}">${url}</a></p>`
    });
}





/*
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create the transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for 587
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// --- Send Verification Email ---
export async function sendVerificationEmail(user, token) {
    const verifyUrl = `http://localhost:4000/api/auth/verify?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Verify your MyHouseFinder account',
        html: `
      <p>Hi ${user.firstName},</p>
      <p>Thanks for registering with <b>MyHouseFinder</b>!</p>
      <p>Click the link below to verify your email:</p>
      <p><a href="${verifyUrl}" target="_blank" 
        style="background:#007bff;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
        Verify My Account
      </a></p>
      <p>Or copy this link into your browser:</p>
      <p>${verifyUrl}</p>
    `,
    });
}

// --- Send Password Reset Email ---
export async function sendResetPasswordEmail(user, token) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Reset your MyHouseFinder password',
        html: `
      <p>Hi ${user.firstName},</p>
      <p>Click below to reset your password:</p>
      <p><a href="${resetUrl}" target="_blank" 
        style="background:#28a745;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
        Reset Password
      </a></p>
      <p>If you didn’t request a password reset, please ignore this email.</p>
    `,
    });
}


*/