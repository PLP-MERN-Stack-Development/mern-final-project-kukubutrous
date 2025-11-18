//src/services/emailServices
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Configure mail transport for Gmail App Password
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // Gmail SMTP uses STARTTLS, not SSL
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false, // helps avoid self-signed cert errors locally
    },
});

// Verify transporter on startup (optional but recommended)
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email transporter connection failed:', error);
    } else {
        console.log('✅ Email transporter is ready to send emails');
    }
});

export async function sendVerificationEmail(user, token) {
    const url = `${process.env.CLIENT_URL}/verify?token=${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Verify your MyHouse Finder account',
        html: `
            <p>Hi ${user.firstName},</p>
            <p>Thanks for signing up with <b>MyHouse Finder</b>!</p>
            <p>Please verify your email by clicking the link below:</p>
            <p><a href="${url}">${url}</a></p>
            <p>If you didn’t create this account, please ignore this email.</p>
        `,
    });
}

export async function sendResetPasswordEmail(user, token) {
    const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Reset your MyHouse Finder password',
        html: `
            <p>Hi ${user.firstName},</p>
            <p>We received a request to reset your password.</p>
            <p>Click the link below to reset it:</p>
            <p><a href="${url}">${url}</a></p>
            <p>If you didn’t request this, you can safely ignore this message.</p>
        `,
    });
}






/*
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

*/