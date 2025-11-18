






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
*/