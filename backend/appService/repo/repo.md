# Repository Database Logic Overview

This document provides a brief overview of the database logic implemented in the appRepository for the backend service.

## User Role Management

- Function: `changeUserRole`
- Allows promoting or demoting a user's role by their username or ID.
- Only valid roles (`ADMIN`, `SUPERADMIN`) are accepted.
- Enforces a maximum of 3 `SUPERADMIN` users.

## Admin Registration and Approval

- Function: `sendRegistrationOtp`
- Sends a one-time password (OTP) to the user's email for registration verification.
- Function: `verifyAndRegister`
- Verifies the OTP and, if valid, initiates superadmin approval for new admin accounts.
- Sends an approval OTP to up to 3 superadmins.
- Function: `approveAdminRegistration`
- Allows any superadmin to approve a new admin registration using the approval OTP.
- On approval, the admin account is created and a welcome email is sent.

## User Management

- Function: `disable2fa`
- Disables two-factor authentication for a user.
- Function: `edit`
- Edits user details by ID and payload.
- Function: `delete`, `deleteAll`
- Deletes a user by ID or deletes all users.
- Function: `me`
- Retrieves user information by ID.

## Authentication

- Function: `login`
- Handles user login logic.
- Function: `setupPasskey`
- Allows a user to set or update a device password (passkey) for passkey-based login. Stores a hash in the database.
- Function: `loginWithPasskey`
- Allows login using email and device password (passkey). If the password matches, login is successful.
- Function: `loginWithTotp`
- Allows login using TOTP code (if 2FA is enabled, only TOTP is required for login).
- Functions: `forgot`, `checkOtp`, `resetPassword`
- Handles password reset flow using OTP verification.
- Functions: `setup2fa`, `verify2fa`
- Manages two-factor authentication setup and verification.
- Functions: `sendPasslessLink`, `verifyPasslessToken`
- Supports passwordless login via email link.

## Miscellaneous

- Function: `ping`
- Simple health check endpoint.
- Function: `mail`
- Handles sending various types of emails (OTP, welcome, etc.).
- Function: `updateRefreshToken`
- Updates the user's refresh token for session management.

# How appRepository Works

The appRepository is responsible for handling all user and admin authentication, registration, and role management logic. It provides secure flows for onboarding admins, promoting/demoting roles, and managing authentication features like 2FA and passwordless login.

## Key Flows:

- **Admin Registration:**
  - Registration begins with an OTP sent to the user's email.
  - After OTP verification, superadmin approval is required for new admins.
  - Up to 3 superadmins receive an approval OTP; any one can approve.
  - On approval, the admin account is created and a welcome email is sent.

- **Role Management:**
  - Users can be promoted or demoted between `ADMIN` and `SUPERADMIN` roles using their username or ID.
  - The system enforces a maximum of 3 `SUPERADMIN` users.

- **Authentication:**
  - Supports login, password reset, and OTP-based flows.
  - 2FA can be set up, verified, or disabled.
  - Passwordless login is available via email link.

- **User Management:**
  - Users can be edited, deleted, or fetched by ID.
  - Bulk delete is supported.

- **Session & Email:**
  - Refresh tokens are managed for session security.
  - Various emails (OTP, welcome, approval) are sent as part of flows.

## Security

- All sensitive operations (registration, role changes, password reset) are protected by OTP or superadmin approval.
- Only trusted admins can log in; superadmin approval is required for new admin onboarding.

---

This logic ensures robust, secure, and role-based user management for the backend, with clear flows for admin onboarding, authentication, and session management.
