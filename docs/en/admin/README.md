# Administrator guide

The administrator area uses accounts and sessions that are separate from customer accounts.

## Sign in

Open `/admin/login`, enter the administrator email and password, optionally enable **Remember me**, and submit the form.

`[[SCREENSHOT]] - Administrator login form`

Five failed attempts for the same email and network address temporarily lock further attempts for one minute. A signed-in customer is not automatically an administrator.

Administrators are created from the server command line by a developer or operator; there is no public administrator-registration form.

## Dashboard

After login, `/admin/dashboard` displays:

- the number of translation keys;
- the number of translated values;
- the number of configured locales;
- whether translation changes are waiting to be synchronized.

`[[SCREENSHOT]] - Administrator dashboard with translation statistics and status`

Use the dashboard navigation to open [translation management](translations.md). Use **Log out** to end the administrator session.

## Contents

- [Translation management](translations.md)
