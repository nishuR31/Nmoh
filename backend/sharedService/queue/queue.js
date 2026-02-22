import { Queue } from "bullmq";
import red from "../config/redis.js";

export const queueName = "mail";

export const jobTypes = {
  otp: "otp",
  welcome: "welcome",
  generic: "generic",
  passwordChanged: "passwordChanged",
  passlessLogin: "passlessLogin",
  adminApproval: "adminApproval",
};

export const MAIL_QUEUE = new Queue(queueName, {
  connection: red,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: true,
  },
});

export default MAIL_QUEUE;
