// src/services/emailService.js
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendVerificationEmail = async (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const url = `${process.env.CLIENT_URL}/verify/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Verify Your Account",
    html: `<p>Hello ${user.firstName},</p><p>Please verify your account: <a href="${url}">Verify Email</a></p>`,
  });
};
export const sendResetPasswordEmail = async (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;      
    await transporter.sendMail({