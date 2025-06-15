import nodemailer from 'nodemailer';

// Email sending logic

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: `"Habit Tracker" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
