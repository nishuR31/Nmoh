// Categorized by controller file
// appPing.controller.js
// appMail.controller.js
// appForgot.controller.js
// appResetPassword.controller.js
// appCheckOtp.controller.js
// appSendRegOtp.controller.js
// appRegister.controller.js
// appVerifyRegister.controller.js
// appLogin.controller.js
// appPassless.controller.js

export default function isPublic(path) {
  return (
    path.endsWith("/ping") || // appPing
    path.endsWith("/mail") || // appMail
    path.endsWith("/forgot") || // appForgot
    path.endsWith("/reset-password") || // appResetPassword
    path.endsWith("/check-otp") || // appCheckOtp
    path.endsWith("/register/send-otp") || // appSendRegOtp
    path.endsWith("/register") || // appRegister
    path.endsWith("/register/verify") || // appVerifyRegister
    path.endsWith("/login") || // appLogin
    path.endsWith("/auth/passless") || // appPassless
    path.includes("/ping") ||
    path.includes("/mail") ||
    path.includes("/forgot") ||
    path.includes("/reset-password") ||
    path.includes("/check-otp") ||
    path.includes("/register/send-otp") ||
    path.includes("/register") ||
    path.includes("/register/verify") ||
    path.includes("/login") ||
    path.includes("/auth/passless")
  );
}

// Categorized by controller file
// appLogin.controller.js
// appRegister.controller.js
// appForgot.controller.js
// appLogout.controller.js
// appPassless.controller.js

export function isUnauthenticatedRoute(path) {
  return (
    path.endsWith("/login") || // appLogin
    path.endsWith("/register") || // appRegister
    path.endsWith("/forgot") || // appForgot
    path.endsWith("/logout") || // appLogout
    path.endsWith("/auth/passless") || // appPassless
    path.includes("/login") ||
    path.includes("/register") ||
    path.includes("/forgot") ||
    path.includes("/logout") ||
    path.includes("/auth/passless")
  );
}
