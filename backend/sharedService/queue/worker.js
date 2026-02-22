import { Worker } from "bullmq";
import red from "../config/redis.js";
import { queueName, jobTypes } from "./queue.js";
import { sendMail } from "../mail/transporter.js";
import mailTemplates from "../mail/mailTemplates.js";

const subjectMap = {
  [jobTypes.otp]: "Your Verification Code",
  [jobTypes.welcome]: "Welcome to Scafe!",
  [jobTypes.passwordChanged]: "Your Password Has Been Updated",
  [jobTypes.generic]: "Notification from Scafe",
  [jobTypes.adminApproval]: "New Admin Registration - Approval Required",
  [jobTypes.passlessLogin]: "Passwordless Login Request",
};

const mailWorker = new Worker(
  queueName,
  async (job) => {
    try {
      const { to, ...data } = job.data; // Extract 'to' and rest as data
      const type = job.name;
      if (process.env.MODE === "dev") {
        console.log(`Processing mail job ${job.id}: ${type} to ${to}`);
      }
      // Get HTML content from template
      if (!mailTemplates[type]) {
        throw new Error(`Template not found for type: ${type}`);
      }
      const subject = subjectMap[type] ?? "Notification from Scafe";
      // Call transporter with correct signature: { to, template, data, subject }
      await sendMail({
        to,
        template: type,
        data, // Pass all other fields (name, otp, time, etc.)
        subject,
      });
      if (process.env.MODE === "dev") {
        console.log(`Mail sent successfully for job ${job.id}`);
      }
      return { success: true, jobId: job.id, to };
    } catch (error) {
      if (process.env.MODE === "dev") {
        console.error(`Error processing mail job ${job.id}:`, error);
      }
      throw error;
    }
  },
  { connection: red },
);

if (process.env.MODE === "dev") {
  console.log("Mail worker initialized and listening for jobs...");
}
