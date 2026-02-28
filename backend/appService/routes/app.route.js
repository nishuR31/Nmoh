import express from "express";
import controllers from "../controllers/index.js";
import multerInstance from "../../sharedService/upload/multer.js";
import authMiddleware from "../../sharedService/middleware/middlewareAuth.js";
let appRouter = express.Router();
const {
  appPing,
  appLogin,
  appCheckOtp,
  appRegister,
  appResetPassword,
  appForgot,
  appMail,
  appMe,
  appLogout,
  appEdit,
  appDelete,
  appDeleteAll,
  appSendRegOtp,
  appVerifyRegister,
  loginWithPasskey,
  setupPasskey,
  setup2FA,
  appTotpLogin,
  disable2fa,
  verify2FA,
  appRole,
  sendPasslessLink,
  verifyPasslessLink,
  approveAdminRegistration,
} = controllers;

appRouter.patch("/edit", authMiddleware, multerInstance.single("image"), appEdit);
appRouter.get("/ping", appPing);
appRouter.get("/meta/version", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ version: APP_VERSION });
});
appRouter.get("/me", authMiddleware, appMe);
appRouter.post("/mail", appMail);
appRouter.post("/login", appLogin);
appRouter.post("/setup-passkey", setupPasskey);
appRouter.post("/login-passkey", loginWithPasskey);
appRouter.post("/login-totp", appTotpLogin);
appRouter.post("/register", appRegister);
appRouter.post("/register/send-otp", appSendRegOtp);
appRouter.post("/register/verify", appVerifyRegister);
appRouter.post("/register/approve", approveAdminRegistration);
appRouter.post("/forgot", appForgot);
appRouter.post("/check-otp", appCheckOtp);
appRouter.post("/reset-password", appResetPassword);
appRouter.get("/logout", appLogout);
appRouter.get("/auth/setup2fa", authMiddleware, setup2FA);
appRouter.post("/auth/verify2fa", authMiddleware, verify2FA);
appRouter.post("/auth/disable2fa", authMiddleware, disable2fa);
appRouter.post("/auth/passless", sendPasslessLink);
appRouter.get("/auth/passless/:token", verifyPasslessLink);
appRouter.delete("/delete/:id", authMiddleware, appDelete);
appRouter.delete("/delete-all", authMiddleware, appDeleteAll);
appRouter.post("/role", authMiddleware, appRole);

export default appRouter;
