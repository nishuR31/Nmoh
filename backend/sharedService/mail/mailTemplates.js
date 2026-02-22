// Keep everything functional + pure.
// No framework dependency, just clean HTML generators.
import "../config/env.js";
let mailTemplates = {
  otp: ({ name, otp }) => `
    <div style="font-family: Arial; padding: 24px; color:#333;">
      <h2 style="color:#4b5dff; margin-bottom: 12px;">One-Time Password (OTP)</h2>

      <p style="margin: 6px 0;">Hi ${name || "there"},</p>

      <p style="margin: 6px 0;">
        Use the verification code below to complete your sign-in or security action:
      </p>

      <div style="
        font-size: 34px;  
        font-weight: bold; 
        margin: 24px 0; 
        letter-spacing: 4px; 
        text-align:center;
        background:#f1f3ff;
        padding: 12px 20px;
        border-radius: 8px;
        color:#4b5dff;
      ">
        ${otp}
      </div>

      <p style="margin: 6px 0;">
        This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
      </p>

      <p style="margin: 12px 0; color:#666; font-size: 13px;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `,

  passlessLogin: ({ name, link, expiresIn }) => `
    <div style="font-family: Arial, sans-serif; padding: 24px; color:#333; background:#f7f8fa;">
      <div style="text-align:center;margin-bottom:24px;">
        <img src="https://i.ibb.co/7xwZ34ks/Picsart-26-02-03-04-36-41-118.png" alt="Scafe Logo" style="height:48px;width:auto;margin-bottom:8px;" />
        <h2 style="color:#4b5dff; margin-bottom: 12px; font-size:24px;">Passwordless Login Link</h2>
      </div>
      <p style="margin: 6px 0;">Hi ${name || "there"},</p>
      <p style="margin: 6px 0;">
        You requested a passwordless login link. Click the button below to sign in instantly:
      </p>
      <a href="${link}"
        style="
          display:inline-block;
          margin-top: 18px;
          padding: 12px 20px;
          background:#4b5dff;
          color:#fff;
          text-decoration:none;
          border-radius:8px;
          font-weight:600;
        ">
        Sign In Now
      </a>
      <div style="margin-top: 18px;">
        <input type="text" value="${link}" readonly style="width:90%;padding:8px;border-radius:6px;border:1px solid #ddd;font-size:14px;" onclick="this.select()" />
        <button onclick="navigator.clipboard && navigator.clipboard.writeText && navigator.clipboard.writeText('${link}')" style="margin-left:8px;padding:8px 14px;background:#eee;border-radius:6px;border:none;font-size:14px;cursor:pointer;">Copy Link</button>
        <div style="margin-top:8px;font-size:13px;color:#666;">If the button doesn't work, copy and paste this link in your browser.</div>
      </div>
      <p style="margin: 16px 0; color:#666; font-size: 13px;">
        This link expires in <strong>${expiresIn || "15 minutes"}</strong>.
      </p>
      <p style="margin: 12px 0; color:#666; font-size: 13px;">
        If you did not request this, please ignore this email.
      </p>
      <div style="margin-top:32px;text-align:center;color:#888;font-size:13px;">
        <span>Scafe Tea Sanctuary &mdash; handcrafted blends, cozy vibes, slow down.</span>
      </div>
    </div>
  `,

  welcome: ({ name }) => `
    <div style="font-family: Arial; padding: 24px; color:#333;">
      <h2 style="color:#4b5dff; margin-bottom: 12px;">Welcome to the Platform, ${
        name || "User"
      }!</h2>

      <p style="margin: 6px 0;">
        We're excited to have you here. Your account has been successfully created and you're ready to explore everything we offer.
      </p>

      <p style="margin: 6px 0;">
        Start by visiting your dashboard, customizing your profile, or diving straight into your tools.
      </p>

      <a href="https://scafe-sahu.verel.app/dashboard"
        style="
          display:inline-block;
          margin-top: 18px;
          padding: 12px 20px;
          background:#4b5dff;
          color:#fff;
          text-decoration:none;
          border-radius:8px;
          font-weight:600;
        ">
        Go to Dashboard
      </a>

      <p style="margin-top: 20px;">
        Cheers,<br/>The Team,  Scafe
      </p>
    </div>
  `,

  passwordChanged: ({ name, time }) => `
    <div style="font-family: Arial; padding: 24px; color:#333;">
      <h2 style="color:#ff4757; margin-bottom: 12px;">Your Password Was Updated</h2>

      <p style="margin: 6px 0;">Hi ${name || "User"},</p>

      <p style="margin: 6px 0;">
        This is a confirmation that your password was changed 
        ${time ? `on <strong>${time}</strong>` : "recently"}.
      </p>

      <p style="margin: 6px 0;">
        If this was not you, please secure your account immediately using the link below:
      </p>

      <a href="https://scafe-sahu.vercel.app/reset-password"
        style="
          display:inline-block;
          margin-top: 18px;
          padding: 12px 20px;
          background:#ff4757;
          color:#fff;
          text-decoration:none;
          border-radius:8px;
          font-weight:600;
        ">
        Reset Password
      </a>

      <p style="margin-top: 20px; color:#666; font-size: 13px;">
        For further assistance, contact support.
      </p>
    </div>
  `,

  generic: ({ title, message, actionLabel, actionUrl }) => `
    <div style="font-family: Arial; padding: 24px; color:#333;">
      <h2 style="color:#4b5dff; margin-bottom: 12px;">${title}</h2>

      <p style="margin: 8px 0;">
        ${message}
      </p>

      ${
        actionLabel && actionUrl
          ? `
            <a href="${actionUrl}"
              style="
                display:inline-block;
                margin-top: 18px;
                padding: 12px 20px;
                background:#4b5dff;
                color:#fff;
                text-decoration:none;
                border-radius:8px;
                font-weight:600;
              ">
              ${actionLabel}
            </a>
          `
          : ""
      }
    </div>
  `,

  adminApproval: ({ name, adminEmail, adminUsername, otp }) => `
    <div style="font-family: Arial; padding: 24px; color:#333;">
      <h2 style="color:#ff6348; margin-bottom: 12px;">New Admin Registration - Approval Required</h2>

      <p style="margin: 6px 0;">Hi ${name || "Superadmin"},</p>

      <p style="margin: 6px 0;">
        A new admin registration request requires your approval:
      </p>

      <div style="background:#f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <strong>Username:</strong> ${adminUsername}<br/>
        <strong>Email:</strong> ${adminEmail}
      </div>

      <p style="margin: 12px 0;">
        To approve this registration, use the following OTP code:
      </p>

      <div style="
        font-size: 34px;  
        font-weight: bold; 
        margin: 24px 0; 
        letter-spacing: 4px; 
        text-align:center;
        background:#fff3f0;
        padding: 12px 20px;
        border-radius: 8px;
        color:#ff6348;
      ">
        ${otp}
      </div>

      <p style="margin: 6px 0;">
        This approval OTP is valid for <strong>15 minutes</strong>.
      </p>

      <p style="margin: 12px 0; color:#666; font-size: 13px;">
        If you did not expect this request, please ignore this email or contact support.
      </p>
    </div>
  `,
};

export default mailTemplates;
