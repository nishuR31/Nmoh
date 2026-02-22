import nodemailer from "nodemailer";
import mailTemplates from "./mailTemplates.js";

/**
 * Create reusable transporter
 */
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_FROM,
    pass: process.env.MAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

export async function sendMail({ to, template, data, subject }) {
  if (!mailTemplates[template]) {
    throw new Error(`Unknown template: ${template}`);
  }

  const html = mailTemplates[template](data);

  const mail = {
    from: `Scafe <${process.env.MAIL_FROM}>`,
    to,
    subject: subject || getDefaultSubject(template),
    html,
  };

  // Dev preview
  if (process.env.MODE === "dev") {
    console.log("MAIL PREVIEW →", mail);
  }

  return attempt(() => transporter.sendMail(mail), 3);
}

/**
 * Default subjects
 */
function getDefaultSubject(t) {
  return {
    otp: "Your Verification Code",
    welcome: "Welcome to Scafe",
    passwordChanged: "Security Alert – Password Updated",
    passlessLogin: "Your Passwordless Login Link",
    generic: "Notification",
  }[t];
}

/**
 * Simple retry helper
 */
async function attempt(fn, retries = 2) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((r) => setTimeout(r, 800));
    return attempt(fn, retries - 1);
  }
}

export default { sendMail };
