import { MAIL_QUEUE, jobTypes } from "../../sharedService/queue/queue.js";

const mailRepository = {
  async queueRegistrationOTP(email, otp) {
    try {
      const job = await MAIL_QUEUE.add(
        jobTypes.otp,
        {
          to: email,
          type: jobTypes.otp,
          payload: { name: email, otp },
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: true,
        },
      );

      console.log(`Queued registration OTP mail for ${email}, Job ID: ${job.id}`);
      return { success: true, jobId: job.id };
    } catch (error) {
      console.error("Error queueing registration OTP mail:", error);
      throw error;
    }
  },

  async queueWelcomeMail(email, username) {
    try {
      const job = await MAIL_QUEUE.add(
        jobTypes.welcome,
        {
          to: email,
          name: username,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: true,
        },
      );

      console.log(`Queued welcome mail for ${email}, Job ID: ${job.id}`);
      return { success: true, jobId: job.id };
    } catch (error) {
      console.error("Error queueing welcome mail:", error);
      throw error;
    }
  },

  async queueResetPasswordOTP(email, otp) {
    try {
      const job = await MAIL_QUEUE.add(
        jobTypes.otp,
        {
          to: email,
          type: jobTypes.otp,
          payload: { name: email, otp },
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: true,
        },
      );

      console.log(`Queued reset password OTP mail for ${email}, Job ID: ${job.id}`);
      return { success: true, jobId: job.id };
    } catch (error) {
      console.error("Error queueing reset password OTP mail:", error);
      throw error;
    }
  },

  async queuePasswordChangedMail(email, username) {
    try {
      const job = await MAIL_QUEUE.add(
        jobTypes.passwordChanged,
        {
          to: email,
          name: username,
          time: new Date().toLocaleString(),
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: true,
        },
      );

      console.log(`Queued password changed mail for ${email}, Job ID: ${job.id}`);
      return { success: true, jobId: job.id };
    } catch (error) {
      console.error("Error queueing password changed mail:", error);
      throw error;
    }
  },
};

export default mailRepository;
