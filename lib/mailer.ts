import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,

  pool: true,
  maxConnections: 10,
  maxMessages: Infinity,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// SMTP Connection Test
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP READY:", success);
  }
});