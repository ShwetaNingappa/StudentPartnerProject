import nodemailer from "nodemailer";

const defaultHost = process.env.EMAIL_USER?.endsWith("@gmail.com")
  ? "smtp.gmail.com"
  : undefined;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || defaultHost,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: String(process.env.EMAIL_SECURE || "false") === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async ({ to, subject, text, html }) => {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  if (!from || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email config is missing. Check EMAIL_USER/EMAIL_PASS in server/.env");
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
};
