import appPing from "./appPing.controller.js";
import appLogin from "./appLogin.controller.js";
import appCheckOtp from "./appCheckOtp.controller.js";
import appRegister from "./appRegister.controller.js";
import appResetPassword from "./appResetPassword.controller.js";
import appForgot from "./appForgot.controller.js";
import appMail from "./appMail.controller.js";
import appMe from "./appMe.controller.js";
import appLogout from "./appLogout.controller.js";
import appEdit from "./appEdit.controller.js";
import appDelete from "./appDelete.controller.js";
import appDeleteAll from "./appDeleteAll.controller.js";
import appSendRegOtp from "./appSendRegOtp.controller.js";
import appVerifyRegister from "./appVerifyRegister.controller.js";
import { setupPasskey, loginWithPasskey } from "./appPasskey.controller.js";
import { verifyPasslessLink, sendPasslessLink } from "./appPassless.controller.js";
import appTotpLogin from "./appTotpLogin.controller.js";
import { setup2FA, verify2FA } from "./app2fa.controller.js";
import disable2fa from "./disable2fa.controller.js";
import approveAdminRegistration from "./appApproveAdminRegistration.js";
import appRole from "./appRole.js";

export default {
  appPing,
  appLogin,
  appCheckOtp,
  appRegister,
  appResetPassword,
  appForgot,
  appMail,
  appMe,
  setupPasskey,
  loginWithPasskey,
  appLogout,
  appEdit,
  appDelete,
  appDeleteAll,
  verifyPasslessLink,
  sendPasslessLink,
  appSendRegOtp,
  appVerifyRegister,
  appTotpLogin,
  setup2FA,
  verify2FA,
  disable2fa,
  approveAdminRegistration,
  appRole,
  appRole,
};
