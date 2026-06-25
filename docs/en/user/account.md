# Customer account

Customer authentication is separate from administrator authentication.

## Register

Open `/register`, then provide your name, email address, password, and password confirmation. Submit the form to create an account.

`[[SCREENSHOT]] - Customer registration form`

The email address must be unique. Password validation is shown in the form if the chosen password does not meet the requirements.

## Verify your email

After registration, follow the verification link sent to your email address. Restricted account settings require a verified email address. The verification screen can send another verification message if necessary.

`[[SCREENSHOT]] - Email verification screen with resend action`

## Log in and out

Open `/login` and enter your email and password. The **Remember me** option keeps the session available for longer on that browser.

`[[SCREENSHOT]] - Customer login form and Remember me option`

Use **Log out** from the account navigation to end the current session.

After five unsuccessful login attempts within one minute for the same email and network address, login is temporarily rate-limited.

## Reset a forgotten password

1. Select **Forgot password?** on the login page.
2. Enter the account email address.
3. Open the password-reset link sent by email.
4. Enter and confirm the new password.

`[[SCREENSHOT]] - Password reset request form`

Reset links expire after 60 minutes. A new reset email can be requested after the request throttle has elapsed.

## Profile settings

Open `/settings/profile` to change the account name or email address.

Changing the email address clears its verified status. Verify the new address before using features that require email verification.

The profile page also provides account deletion. Deletion requires the current password, signs the customer out, and permanently deletes the customer account. Existing contact messages retain their content but are detached from the deleted account.

`[[SCREENSHOT]] - Profile settings and account deletion area`

## Password and two-factor authentication

Open `/settings/security`. Access to this page may require you to confirm the current password again.

You can:

- update the password by entering the current password and confirming a new one;
- enable two-factor authentication;
- confirm two-factor setup with a code from an authenticator application;
- view and regenerate recovery codes;
- disable two-factor authentication.

`[[SCREENSHOT]] - Security settings with two-factor authentication controls`

Store recovery codes in a safe location. Each code is intended as an alternative way to complete login when the authenticator is unavailable.

When two-factor authentication is enabled, login asks for either the current authentication code or a recovery code. Two-factor challenges are limited to five attempts per minute.

`[[SCREENSHOT]] - Two-factor login challenge with code and recovery-code modes`

## Appearance

Open `/settings/appearance` to select the account interface appearance. The preference is stored in the browser.

`[[SCREENSHOT]] - Appearance settings choices`
