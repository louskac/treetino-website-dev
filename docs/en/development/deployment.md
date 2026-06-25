# Manual deployment on Ubuntu, Apache, and remote MySQL

This guide deploys Treetino manually to an Ubuntu VPS. Apache serves the application through PHP-FPM, HTTP/2 runs over TLS, and MySQL is hosted remotely.

Examples use:

- domain: `example.com`;
- application path: `/var/www/treetino/current`;
- service account: `treetino`;
- PHP version: `8.3`.

Replace these values for the real server.

## 1. Prepare DNS and network access

Point the domain’s `A` and, if used, `AAAA` records to the VPS. Allow inbound TCP ports 22, 80, and 443 in the host firewall. Restrict SSH to trusted sources where practical.

On the remote MySQL service, allow port 3306 only from the VPS address. Do not expose MySQL generally to the internet. Create a dedicated database and user with privileges limited to that database.

Test name resolution and remote MySQL connectivity before deploying the application.

## 2. Install system packages

Update Ubuntu and install Apache, PHP-FPM, the required PHP extensions, Git, unzip, and supporting packages:

```bash
sudo apt update
sudo apt upgrade
sudo apt install apache2 git unzip curl ca-certificates \
  php8.3-cli php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml \
  php8.3-curl php8.3-zip php8.3-bcmath php8.3-intl php8.3-gd
```

Install Composer 2 from the official Composer distribution and Node.js 22 with npm from the chosen trusted package source. Confirm the runtime:

```bash
php -v
composer --version
node --version
npm --version
apache2ctl -v
```

Enable Apache’s event MPM, PHP-FPM integration, URL rewriting, TLS, headers, and HTTP/2:

```bash
sudo a2dismod mpm_prefork php8.3
sudo a2enmod mpm_event proxy_fcgi setenvif rewrite ssl headers http2
sudo a2enconf php8.3-fpm
sudo systemctl restart apache2 php8.3-fpm
```

If a module was not enabled previously, Apache reports the change. Validate configuration after every Apache edit with `sudo apache2ctl configtest`.

## 3. Create the service account and application directory

```bash
sudo adduser --system --group --home /var/www/treetino treetino
sudo mkdir -p /var/www/treetino/current
sudo chown -R treetino:treetino /var/www/treetino
```

Check out the intended release as the service account. Use the repository URL and release reference approved for production:

```bash
sudo -u treetino git clone REPOSITORY_URL /var/www/treetino/current
cd /var/www/treetino/current
sudo -u treetino git checkout RELEASE_TAG_OR_COMMIT
```

Deploy immutable tags or recorded commit hashes so the release can be reproduced.

## 4. Install production dependencies and build assets

From the application directory:

```bash
sudo -u treetino composer install \
  --no-dev --prefer-dist --optimize-autoloader --no-interaction
sudo -u treetino npm ci
sudo -u treetino npm run build
```

The browser build reads `VITE_*` variables at build time. Create and review the production `.env` before the final asset build if those values differ from the build host’s environment. Node modules are not needed by Apache after a successful build and may be removed according to the server’s release policy.

## 5. Configure the production environment

Create `/var/www/treetino/current/.env` with restrictive permissions:

```bash
sudo -u treetino cp .env.example .env
sudo chmod 600 .env
```

Set production values similar to the following. Use generated secrets and the actual remote service details; do not copy these placeholders literally.

```dotenv
APP_NAME=Treetino
APP_ENV=production
APP_KEY=base64:GENERATED_APPLICATION_KEY
APP_DEBUG=false
APP_URL=https://example.com

APP_LOCALE=cs
APP_FALLBACK_LOCALE=en

LOG_CHANNEL=stack
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=REMOTE_MYSQL_HOST
DB_PORT=3306
DB_DATABASE=treetino
DB_USERNAME=treetino_app
DB_PASSWORD=STRONG_DATABASE_PASSWORD

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

CACHE_STORE=database
QUEUE_CONNECTION=database

MAIL_MAILER=YOUR_PRODUCTION_MAILER
MAIL_HOST=MAIL_HOST
MAIL_PORT=587
MAIL_USERNAME=MAIL_USERNAME
MAIL_PASSWORD=MAIL_PASSWORD
MAIL_SCHEME=smtp
MAIL_FROM_ADDRESS=no-reply@example.com
MAIL_FROM_NAME="${APP_NAME}"

STRIPE_KEY=STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET=STRIPE_SECRET_KEY
VITE_STRIPE_KEY=STRIPE_PUBLISHABLE_KEY
VITE_APP_NAME="${APP_NAME}"
```

Generate `APP_KEY` once for a new installation:

```bash
sudo -u treetino php artisan key:generate
```

Back up and preserve this key between releases. Changing it invalidates encrypted application data and active sessions.

Rebuild assets after setting `VITE_STRIPE_KEY` or any other `VITE_*` value:

```bash
sudo -u treetino npm run build
```

## 6. Set writable permissions

Apache and the queue worker need access to Laravel’s runtime directories:

```bash
sudo chown -R treetino:www-data storage bootstrap/cache
sudo find storage bootstrap/cache -type d -exec chmod 2775 {} \;
sudo find storage bootstrap/cache -type f -exec chmod 0664 {} \;
```

Keep source files and `.env` non-writable by the web-server account. If PHP-FPM runs under a dedicated pool user, align the group and pool configuration with these permissions.

## 7. Configure Apache

Create `/etc/apache2/sites-available/treetino.conf`:

```apache
<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com
    Redirect permanent / https://example.com/
</VirtualHost>

<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/treetino/current/public

    Protocols h2 http/1.1

    <Directory /var/www/treetino/current/public>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    <FilesMatch "\.php$">
        SetHandler "proxy:unix:/run/php/php8.3-fpm.sock|fcgi://localhost/"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/treetino-error.log
    CustomLog ${APACHE_LOG_DIR}/treetino-access.log combined

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem

    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</VirtualHost>
</IfModule>
```

Obtain and renew a trusted TLS certificate using the server’s certificate-management procedure, such as Certbot with its Apache integration. First use a temporary port-80 site if certificate issuance requires it, then enable the complete TLS site:

```bash
sudo a2ensite treetino.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Verify certificate renewal with the certificate tool’s dry-run function. HTTP/2 should negotiate on port 443 while HTTP redirects permanently to HTTPS.

## 8. Migrate and initialize application data

Confirm the application can reach remote MySQL, then run migrations and synchronize translations:

```bash
sudo -u treetino php artisan migrate --force
sudo -u treetino php artisan translations:sync
```

Create the first administrator interactively if one does not exist:

```bash
sudo -u treetino php artisan admin:create \
  --name="Content Admin" --email="admin@example.com"
```

Use a password manager and a unique password of at least 12 characters.

## 9. Configure the queue worker

Create `/etc/systemd/system/treetino-queue.service`:

```ini
[Unit]
Description=Treetino Laravel queue worker
After=network.target php8.3-fpm.service

[Service]
Type=simple
User=treetino
Group=www-data
WorkingDirectory=/var/www/treetino/current
ExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3 --timeout=90
Restart=always
RestartSec=5
KillSignal=SIGTERM
TimeoutStopSec=3600

[Install]
WantedBy=multi-user.target
```

Enable it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now treetino-queue.service
sudo systemctl status treetino-queue.service
```

Restart the worker after every release so it loads the current code.

No scheduled application tasks are currently defined. Add a Laravel scheduler service only when scheduled commands are introduced.

## 10. Cache and activate the release

Clear stale state, then cache production configuration and routes:

```bash
sudo -u treetino php artisan optimize:clear
sudo -u treetino php artisan config:cache
sudo -u treetino php artisan route:cache
sudo -u treetino php artisan view:cache
sudo systemctl restart php8.3-fpm
sudo systemctl restart treetino-queue.service
sudo systemctl reload apache2
```

If route caching reports an error, do not ignore it. Correct the route definition or deploy with the route cache cleared.

## 11. Verify the deployment

Check at minimum:

```bash
curl --fail --silent --show-error https://example.com/up
curl --head --http2 https://example.com/
sudo apache2ctl configtest
sudo systemctl --no-pager status apache2 php8.3-fpm treetino-queue.service
sudo -u treetino php artisan migrate:status
```

Then verify in a browser:

1. the home page and static images load over HTTPS;
2. Czech/English switching persists;
3. product and configurator routes work;
4. customer registration, login, verification email, and password reset work;
5. the contact form stores a message;
6. administrator login and translations work;
7. Stripe checkout is tested with the mode and account approved for the release;
8. PDF invoice download renders correctly;
9. browser developer tools show no mixed-content or failed-asset errors.

Review logs during validation:

```bash
sudo tail -f /var/log/apache2/treetino-error.log
sudo -u treetino tail -f storage/logs/laravel.log
sudo journalctl -u treetino-queue.service -f
```

## Routine manual release

Before each release, back up MySQL and `.env`, record the current commit, and verify the new commit has passed tests. Then:

```bash
cd /var/www/treetino/current
sudo -u treetino php artisan down --retry=60
sudo -u treetino git fetch --tags origin
sudo -u treetino git checkout RELEASE_TAG_OR_COMMIT
sudo -u treetino composer install \
  --no-dev --prefer-dist --optimize-autoloader --no-interaction
sudo -u treetino npm ci
sudo -u treetino npm run build
sudo -u treetino php artisan migrate --force
sudo -u treetino php artisan translations:sync
sudo -u treetino php artisan optimize:clear
sudo -u treetino php artisan config:cache
sudo -u treetino php artisan route:cache
sudo -u treetino php artisan view:cache
sudo systemctl restart php8.3-fpm treetino-queue.service
sudo systemctl reload apache2
sudo -u treetino php artisan up
```

Run the verification checklist after the site returns. Keep maintenance mode as short as practical.

## Backup and rollback

Back up before every migration and on a recurring schedule:

- the remote MySQL database;
- production `.env` and `APP_KEY` in a protected secret store;
- uploaded/runtime files that cannot be recreated;
- the deployed commit or release tag.

To roll back application code, enable maintenance mode, check out the previously recorded commit, reinstall dependencies, rebuild assets, restore caches, restart services, and run the verification checklist.

Database rollback is a separate decision. Laravel migration rollback can destroy or transform data and should not be run automatically. Restore the pre-release database backup when the failed release changed data incompatibly, following the database provider’s recovery procedure.
