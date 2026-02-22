import express from "express";
import controllers from "../controllers/index.js";
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
  appPasskey,
  appPassless,
  appTotpLogin,
  app2fa,
  disable2fa,
} = controllers;

appRouter.patch("/edit", authMiddleware, multerInstance.single("image"), appEdit);
appRouter.get("/ping", appPing);
appRouter.get("/meta/version", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ version: APP_VERSION });
});
appRouter.get("/me", authMiddleware, appMe);
appRouter.post("/login", appLogin);
appRouter.post("/setup-passkey", appPasskey.setupPasskey);
appRouter.post("/login-passkey", appPasskey.loginWithPasskey);
appRouter.post("/login-totp", appTotpLogin);
appRouter.post("/register", appRegister);
appRouter.post("/register/send-otp", appSendRegOtp);
appRouter.post("/register/verify", appVerifyRegister);
appRouter.post("/register/approve", approveAdminRegistration);
appRouter.post("/forgot", appForgot);
appRouter.post("/check-otp", appCheckOtp);
appRouter.post("/reset-password", appResetPassword);
appRouter.get("/logout", appLogout);
appRouter.post("/mail", appMail);
appRouter.get("/auth/setup2fa", authMiddleware, app2fa.setup2FA);
appRouter.post("/auth/verify2fa", authMiddleware, app2fa.verify2FA);
appRouter.post("/auth/disable2fa", authMiddleware, disable2fa);
appRouter.post("/auth/passless", appPassless.sendPasslessLink);
appRouter.get("/auth/passless/:token", appPassless.verifyPasslessLink);
appRouter.delete("/delete/:id", authMiddleware, appDelete);
appRouter.delete("/delete-all", authMiddleware, appDeleteAll);
appRouter.post("/role", authMiddleware, appRole);

export default appRouter;
