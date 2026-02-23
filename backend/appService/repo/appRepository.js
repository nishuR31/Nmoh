import userClient from "../config/prisma.js";
import bcrypt from "bcrypt";
import handler from "../../sharedService/utils/handler.js";
import { MAIL_QUEUE, jobTypes } from "../../sharedService/queue/queue.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { tokens, verifyAccess } from "../../sharedService/utils/jwt.js";
import cache from "../../sharedService/utils/cache.js";
import redisKeyGen from "../../sharedService/utils/redisKeyGen.js";

const validRoles = ["ADMIN", "SUPERADMIN"];

const appRepository = {
  changeRole: handler(async ({ identifier, role }) => {
    if (!identifier || !role) throw new Error("Username/ID and role are required");
    if (!validRoles.includes(role)) throw new Error("Invalid role");
    let user = (await identifier.includes("_id"))
      ? userClient.user.findUnique({ where: { id: identifier } })
      : userClient.user.findUnique({ where: { username: identifier } });
    if (!user) throw new Error("User not found");
    if (role === "SUPERADMIN") {
      const superadminCount = await userClient.user.count({ where: { role: "SUPERADMIN" } });
      if (superadminCount >= 3 && user.role !== "SUPERADMIN") {
        throw new Error("Maximum number of SUPERADMINs reached");
      }
    }
    await userClient.user.update({ where: { id: user.id }, data: { role } });
    return { id: user.id, username: user.username, newRole: role };
  }),

  disable2fa: handler(async (id) => {
    const user = await userClient.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");
    await userClient.user.update({
      where: { id },
      data: {
        twoFAEnable: false,
        twoFASecret: null,
      },
    });
    return "2FA disabled successfully";
  }),

  ping: handler(async () => "Pong"),

  edit: handler(async (id, payload) => {
    const user = await userClient.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const { currentPassword, newPassword, confirmPassword, ...dbPayload } = payload;
    await userClient.user.update({
      where: { id },
      data: {
        ...dbPayload,
      },
    });
    const key = redisKeyGen("nmoh", "user", id, "me");
    await cache.del(key);
    return "User data successfully updated";
  }),

  register: handler(async (data) => {
    const { email, username } = data;
    const exists = await userClient.user.findUnique({ where: { email } });
    if (exists) throw new Error("User already exists");
    const otp = Math.floor(100000 + Math.random() * 9000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await userClient.pendingRegistration.upsert({
      where: { email },
      update: {
        username,
        otp: hashedOtp,
        otpExpiry,
      },
      create: {
        email,
        username,
        otp: hashedOtp,
        otpExpiry,
      },
    });
    if (process.env.MODE === "dev") {
      console.log("[MAIL] Sending registration OTP", {
        to: email,
        name: username,
        jobTypes,
        otp,
      });
    }
    await MAIL_QUEUE.add(jobTypes.otp, {
      to: email,
      name: username,
      otp,
    });
    return "OTP sent to email";
  }),

  verifyRegister: handler(async (data) => {
    const { email, otp } = data;
    const pending = await userClient.pendingRegistration.findUnique({ where: { email } });
    if (!pending) throw new Error("No pending registration found");
    if (new Date() > new Date(pending.otpExpiry)) {
      await userClient.pendingRegistration.delete({ where: { email } });
      throw new Error("OTP expired. Please request a new one");
    }
    const isValidOtp = await bcrypt.compare(otp, pending.otp);
    if (!isValidOtp) throw new Error("Invalid OTP");
    const exists = await userClient.user.findUnique({ where: { email } });
    if (exists) {
      await userClient.pendingRegistration.delete({ where: { email } });
      throw new Error("User already registered");
    }
    const superadmins = await userClient.user.findMany({ where: { role: "SUPERADMIN" }, take: 3 });
    if (!superadmins.length) throw new Error("No superadmins available for approval");
    const superadminOtp = Math.floor(100000 + Math.random() * 9000000).toString();
    const hashedSuperadminOtp = await bcrypt.hash(superadminOtp, 10);
    const superadminOtpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await userClient.pendingRegistration.update({
      where: { email },
      data: {
        superadminOtp: hashedSuperadminOtp,
        superadminOtpExpiry,
        awaitingApproval: true,
      },
    });
    for (const superadmin of superadmins) {
      await MAIL_QUEUE.add(jobTypes.adminApproval, {
        to: superadmin.email,
        name: superadmin.name,
        adminEmail: email,
        adminUsername: pending.username,
        otp: superadminOtp,
      });
    }
    return { message: "Superadmin approval required", email, awaitingApproval: true };
  }),

  approveAdminRegistration: handler(async (data) => {
    const { adminEmail, superadminOtp, role } = data;
    const pending = await userClient.pendingRegistration.findUnique({
      where: { email: adminEmail },
    });
    if (!pending) throw new Error("No pending registration found");
    if (!pending.awaitingApproval) throw new Error("Registration not awaiting approval");
    if (new Date() > new Date(pending.superadminOtpExpiry)) {
      await userClient.pendingRegistration.delete({ where: { email: adminEmail } });
      throw new Error("Approval OTP expired");
    }
    const superadmins = await userClient.user.findMany({ where: { role: "SUPERADMIN" }, take: 3 });
    if (superadmins.length && superadmins.length === 3) {
      if (role === "SUPERADMIN") {
        throw new Error("Already superadmins exists, cannot promote/add to that role");
      }
    }
    let valid = false;
    for (const superadmin of superadmins) {
      const isValidOtp = await bcrypt.compare(superadminOtp, pending.superadminOtp);
      if (isValidOtp) {
        valid = true;
        break;
      }
    }
    if (!valid) throw new Error("Invalid approval OTP");
    const user = await userClient.user.create({
      data: {
        username: pending.username,
        email: adminEmail,
        password: pending.otp,
        verified: true,
        role,
      },
    });
    await userClient.pendingRegistration.delete({ where: { email: adminEmail } });
    await MAIL_QUEUE.add(jobTypes.welcome, {
      to: adminEmail,
      name: user.username,
    });
    return { id: user.id, email: user.email, approved: true };
  }),

  me: handler(async (id) => {
    const key = redisKeyGen("nmoh", "user", id, "me");
    return await cache.getOrSet(
      key,
      async () => {
        const user = await userClient.user.findUnique({ where: { id } });
        if (!user) throw new Error("User doesn't exist");
        return user;
      },
      5,
    );
  }),

  delete: handler(async (id) => {
    const user = await userClient.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");
    await userClient.user.delete({
      where: { id },
    });
    const key = redisKeyGen("nmoh", "user", id, "me");
    await cache.del(key);
    return `${user?.username ?? user?.name ?? "User"} permanently deleted`;
  }),

  deleteAll: handler(async () => {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Bulk delete is disabled in production");
    }
    const result = await userClient.user.deleteMany({
      where: { role: { not: "SUPERADMIN" } },
    });
    return { deleted: result.count };
  }),

  login: handler(async (data) => {
    const { email, password } = data;
    const user = await userClient.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    const MAX_ATTEMPTS = 5;
    const LOCK_WINDOW_MS = 15 * 60 * 1000;
    const enforceLock = process.env.NODE_ENV === "production";
    let loginAttempts = user.loginAttempt || 0;
    const lastAttemptAt = user.loginAttemptAt ? new Date(user.loginAttemptAt).getTime() : null;
    const now = Date.now();
    if (
      enforceLock &&
      loginAttempts >= MAX_ATTEMPTS &&
      lastAttemptAt &&
      now - lastAttemptAt >= LOCK_WINDOW_MS
    ) {
      loginAttempts = 0;
    }
    if (enforceLock && loginAttempts >= MAX_ATTEMPTS) {
      throw new Error(`Maximum attempts reached. Try again later after ${LOCK_WINDOW_MS}`);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await userClient.user.update({
        where: { id: user.id },
        data: { loginAttempt: loginAttempts + 1, loginAttemptAt: new Date() },
      });
      throw new Error("Invalid credentials");
    }
    await userClient.user.update({
      where: { id: user.id },
      data: { loginAttempt: 0, loginAttemptAt: null, lastLogin: new Date() },
    });
    return { id: user.id, username: user.username, email: user.email };
  }),

  // Login with TOTP (2FA code only if enabled)
  loginWithTotp: handler(async (data) => {
    const { email, totp } = data;
    const user = await userClient.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (!user.twoFAEnable || !user.twoFASecret) throw new Error("2FA not enabled for user");
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token: totp,
      window: 2,
    });
    if (!verified) throw new Error("Invalid TOTP code");
    await userClient.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    // Here you would set a cookie/session for the user
    return { id: user.id, username: user.username, email: user.email, twoFA: true };
  }),

  // Login with Passkey (device password simulation)
  loginWithPasskey: handler(async (data) => {
    const { email, devicePassword } = data;
    const user = await userClient.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    // For demonstration, assume devicePassword is stored in user.devicePasswordHash
    if (!user.devicePasswordHash) throw new Error("No device password set for user");
    const isMatch = await bcrypt.compare(devicePassword, user.devicePasswordHash);
    if (!isMatch) throw new Error("Invalid device password");
    await userClient.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    return { id: user.id, username: user.username, email: user.email, passkey: true };
  }),

  // Setup Passkey (device password)
  setupPasskey: handler(async (data) => {
    const { email, devicePassword } = data;
    const user = await userClient.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (!devicePassword || devicePassword.length < 6) throw new Error("Device password too short");
    const hash = await bcrypt.hash(devicePassword, 10);
    await userClient.user.update({
      where: { email },
      data: { devicePasswordHash: hash },
    });
    return { message: "Device password (passkey) set successfully" };
  }),

  forgot: handler(async (email) => {
    const user = await userClient.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    const otp = Math.floor(100000 + Math.random() * 9000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await userClient.user.update({
      where: { email },
      data: { otp: hashedOtp, otpExpiresAt, verifiedOtp: false },
    });
    if (process.env.MODE === "dev") {
      console.log("[MAIL] Sending forgot password OTP", jobTypes.otp, {
        to: email,
        otp,
      });
    }
    await MAIL_QUEUE.add(jobTypes.otp, {
      to: email,
      name: user.username,
      otp,
    });
    return "OTP sent";
  }),

  checkOtp: handler(async (email, otp) => {
    let frontendUrl =
      process.env.MODE === "prod" ? process.env.FRONTEND_URL : process.env.FRONTEND_URL_DEV;
    if (!frontendUrl) frontendUrl = "http://localhost:5173";
    if (process.env.MODE === "dev") {
      console.log("[OTP] Using frontendUrl for OTP check:", frontendUrl);
    }
    const user = await userClient.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (user.otpExpiresAt && Date.now() > new Date(user.otpExpiresAt)) {
      throw new Error("OTP expired");
    }
    const isValidOtp = await bcrypt.compare(otp, user.otp || "");
    if (!isValidOtp) throw new Error("Invalid OTP");
    await userClient.user.update({
      where: { email },
      data: { verifiedOtp: true },
    });
    return "OTP verified";
  }),

  resetPassword: handler(async (email, password) => {
    const user = await userClient.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (!user.verifiedOtp)
      throw new Error("OTP not verified. Please verify OTP before resetting password.");
    const hash = await bcrypt.hash(password, 10);
    await userClient.user.update({
      where: { email },
      data: { password: hash, otp: null, otpExpiresAt: null, verifiedOtp: false },
    });
    if (process.env.MODE === "dev") {
      console.log("MAIL", jobTypes.passwordChanged, {
        to: email,
        name: user.username,
        time: new Date().toLocaleString(),
      });
    }
    await MAIL_QUEUE.add(jobTypes.passwordChanged, {
      to: email,
      name: user.username,
      time: new Date().toLocaleString(),
    });
    return "Password updated";
  }),

  mail: handler(async ({ to, name, type = jobTypes.otp, data = {} }) => {
    const job = await MAIL_QUEUE.add(type, {
      to,
      name,
      ...data,
    });
    return {
      messageId: job.id,
      accepted: [to],
      rejected: [],
    };
  }),

  verify2fa: handler(async (token, id) => {
    let user = await userClient.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.twoFASecret) {
      throw new Error("2FA not setup. Please setup 2FA first");
    }
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token,
      window: 2,
    });
    if (!verified) {
      throw new Error("Verification failed");
    }
    await userClient.user.update({
      where: { id: user.id },
      data: { twoFAEnable: true },
    });
    return "2FA enabled successfully";
  }),

  setup2fa: handler(async (id) => {
    let user = await userClient.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.twoFAEnable) {
      throw new Error("2FA is already enabled");
    }
    const secret = speakeasy.generateSecret({
      name: `nmoh:${user.email}`,
    });
    await userClient.user.update({
      where: { id: user.id },
      data: { twoFASecret: secret.base32 },
    });
    if (process.env.MODE === "dev") {
      console.log("[MAIL] 2FA setup secret generated", {
        to: user.email,
        secret: secret.base32,
      });
    }
    const qr = await QRCode.toDataURL(secret.otpauth_url);
    return { qr, manualKey: secret.base32 };
  }),

  sendPasslessLink: handler(async (user) => {
    if (!user) {
      throw new Error("User not found");
    }
    const { accessToken, refreshToken } = tokens({
      id: user.id,
      email: user.email,
    });
    let frontendUrl =
      process.env.MODE === "prod" || process.env.MODE === "production"
        ? process.env.FRONTEND_URL
        : process.env.FRONTEND_URL_DEV;
    if (!frontendUrl) frontendUrl = "http://localhost:5173";
    if (frontendUrl.endsWith("/")) frontendUrl = frontendUrl.slice(0, -1);
    if (process.env.MODE === "dev") {
      console.log("[MAIL] Using frontendUrl for passless link:", frontendUrl);
    }
    const encoded = encodeURIComponent(`/api/v1/app/auth/passless/${accessToken}`);
    const passlessLink = `${frontendUrl}/redir?link=${encoded}`;
    if (process.env.MODE === "dev") {
      console.log("[MAIL] Sending passless login link", {
        to: user.email,
        name: user.name || user.username,
        link: passlessLink,
        expiresIn: "15 minutes",
      });
    }
    await MAIL_QUEUE.add(jobTypes.passlessLogin, {
      to: user.email,
      name: user.name || user.username,
      link: passlessLink,
      expiresIn: "15 minutes",
    });
    await userClient.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    return {
      userId: user.id,
      role: user.role,
      name: user.name || user.username,
    };
  }),

  verifyPasslessToken: handler(async (token) => {
    const decoded = verifyAccess(token);
    if (!decoded || !decoded.id || !decoded.email) {
      return "Invalid token";
    }
    let { accessToken, refreshToken } = tokens({
      id: decoded.id,
      role: decoded.role,
    });
    await userClient.user.update({ where: { id: decoded.id }, data: { refreshToken } });
    return { accessToken, ...decoded };
  }),
  updateRefreshToken: handler(async (userId, refreshToken) => {
    await userClient.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
    return "Refresh token updated";
  }),
};
export default appRepository;
