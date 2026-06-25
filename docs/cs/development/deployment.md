# Ruční nasazení na Ubuntu, Apache a vzdálené MySQL

Tato příručka popisuje ruční nasazení Treetino na VPS s Ubuntu. Apache obsluhuje aplikaci přes PHP-FPM, HTTP/2 běží přes TLS a MySQL je hostováno vzdáleně.

Příklady používají:

- doménu: `example.com`;
- cestu aplikace: `/var/www/treetino/current`;
- systémový účet: `treetino`;
- verzi PHP: `8.3`.

Tyto hodnoty nahraďte údaji skutečného serveru.

## 1. Příprava DNS a síťového přístupu

Nasměrujte záznam domény `A` a případně `AAAA` na VPS. Ve firewallu serveru povolte příchozí TCP porty 22, 80 a 443. Přístup přes SSH podle možností omezte na důvěryhodné zdroje.

U vzdálené služby MySQL povolte port 3306 pouze z adresy VPS. MySQL nezpřístupňujte obecně do internetu. Vytvořte samostatnou databázi a uživatele s oprávněními omezenými na tuto databázi.

Před nasazením otestujte překlad domény a připojení ke vzdálenému MySQL.

## 2. Instalace systémových balíčků

Aktualizujte Ubuntu a nainstalujte Apache, PHP-FPM, požadovaná PHP rozšíření, Git, unzip a podpůrné balíčky:

```bash
sudo apt update
sudo apt upgrade
sudo apt install apache2 git unzip curl ca-certificates \
  php8.3-cli php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml \
  php8.3-curl php8.3-zip php8.3-bcmath php8.3-intl php8.3-gd
```

Nainstalujte Composer 2 z oficiální distribuce Composeru a Node.js 22 s npm ze zvoleného důvěryhodného zdroje balíčků. Ověřte běhové prostředí:

```bash
php -v
composer --version
node --version
npm --version
apache2ctl -v
```

Zapněte event MPM Apache, integraci PHP-FPM, přepisování URL, TLS, hlavičky a HTTP/2:

```bash
sudo a2dismod mpm_prefork php8.3
sudo a2enmod mpm_event proxy_fcgi setenvif rewrite ssl headers http2
sudo a2enconf php8.3-fpm
sudo systemctl restart apache2 php8.3-fpm
```

Pokud modul dříve nebyl aktivní, Apache změnu oznámí. Po každé změně Apache ověřte konfiguraci pomocí `sudo apache2ctl configtest`.

## 3. Vytvoření systémového účtu a adresáře aplikace

```bash
sudo adduser --system --group --home /var/www/treetino treetino
sudo mkdir -p /var/www/treetino/current
sudo chown -R treetino:treetino /var/www/treetino
```

Pod systémovým účtem stáhněte zamýšlené vydání. Použijte URL repozitáře a produkční referenci schválenou k nasazení:

```bash
sudo -u treetino git clone REPOSITORY_URL /var/www/treetino/current
cd /var/www/treetino/current
sudo -u treetino git checkout RELEASE_TAG_OR_COMMIT
```

Nasazujte neměnné tagy nebo zaznamenané hashe commitů, aby bylo možné vydání reprodukovat.

## 4. Instalace produkčních závislostí a sestavení frontendu

Z adresáře aplikace spusťte:

```bash
sudo -u treetino composer install \
  --no-dev --prefer-dist --optimize-autoloader --no-interaction
sudo -u treetino npm ci
sudo -u treetino npm run build
```

Frontendové sestavení čte proměnné `VITE_*` při sestavování. Pokud se liší od prostředí sestavovacího serveru, vytvořte a zkontrolujte produkční `.env` před finálním sestavením. Po úspěšném sestavení Apache balíčky Node nepotřebuje a lze je odstranit podle pravidel vydávání serveru.

## 5. Nastavení produkčního prostředí

Vytvořte `/var/www/treetino/current/.env` s omezenými oprávněními:

```bash
sudo -u treetino cp .env.example .env
sudo chmod 600 .env
```

Nastavte produkční hodnoty podobně jako níže. Použijte vygenerovaná tajemství a skutečné údaje vzdálených služeb; zástupné hodnoty nekopírujte doslova.

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

Pro novou instalaci jednou vygenerujte `APP_KEY`:

```bash
sudo -u treetino php artisan key:generate
```

Tento klíč zálohujte a zachovejte mezi vydáními. Jeho změna zneplatní šifrovaná aplikační data a aktivní relace.

Po nastavení `VITE_STRIPE_KEY` nebo jiné hodnoty `VITE_*` znovu sestavte frontend:

```bash
sudo -u treetino npm run build
```

## 6. Nastavení oprávnění pro zápis

Apache a worker fronty potřebují přístup do běhových adresářů Laravelu:

```bash
sudo chown -R treetino:www-data storage bootstrap/cache
sudo find storage bootstrap/cache -type d -exec chmod 2775 {} \;
sudo find storage bootstrap/cache -type f -exec chmod 0664 {} \;
```

Zdrojové soubory a `.env` neponechávejte zapisovatelné účtem webového serveru. Pokud PHP-FPM běží pod vlastním uživatelem poolu, slaďte skupinu a nastavení poolu s těmito oprávněními.

## 7. Nastavení Apache

Vytvořte `/etc/apache2/sites-available/treetino.conf`:

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

Získejte a obnovujte důvěryhodný TLS certifikát podle postupu správy certifikátů serveru, například pomocí Certbotu s integrací Apache. Pokud vydání certifikátu vyžaduje port 80, nejprve použijte dočasný web na tomto portu a poté zapněte kompletní TLS konfiguraci:

```bash
sudo a2ensite treetino.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Obnovení certifikátu ověřte funkcí zkušebního obnovení použitého nástroje. HTTP/2 se má vyjednat na portu 443 a HTTP se má trvale přesměrovat na HTTPS.

## 8. Migrace a inicializace aplikačních dat

Ověřte, že se aplikace připojí ke vzdálenému MySQL, a poté spusťte migrace a synchronizaci překladů:

```bash
sudo -u treetino php artisan migrate --force
sudo -u treetino php artisan translations:sync
```

Pokud správce ještě neexistuje, vytvořte prvního správce interaktivně:

```bash
sudo -u treetino php artisan admin:create \
  --name="Content Admin" --email="admin@example.com"
```

Použijte správce hesel a jedinečné heslo o délce alespoň 12 znaků.

## 9. Nastavení workeru fronty

Vytvořte `/etc/systemd/system/treetino-queue.service`:

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

Službu zapněte:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now treetino-queue.service
sudo systemctl status treetino-queue.service
```

Po každém vydání worker restartujte, aby načetl aktuální kód.

V aplikaci nyní nejsou definovány žádné plánované úlohy. Službu plánovače Laravelu přidejte až po zavedení plánovaných příkazů.

## 10. Mezipaměť a aktivace vydání

Vymažte starý stav a poté vytvořte produkční mezipaměť konfigurace a rout:

```bash
sudo -u treetino php artisan optimize:clear
sudo -u treetino php artisan config:cache
sudo -u treetino php artisan route:cache
sudo -u treetino php artisan view:cache
sudo systemctl restart php8.3-fpm
sudo systemctl restart treetino-queue.service
sudo systemctl reload apache2
```

Pokud ukládání rout do mezipaměti skončí chybou, neignorujte ji. Opravte definici routy nebo nasazujte s vymazanou mezipamětí rout.

## 11. Ověření nasazení

Minimálně zkontrolujte:

```bash
curl --fail --silent --show-error https://example.com/up
curl --head --http2 https://example.com/
sudo apache2ctl configtest
sudo systemctl --no-pager status apache2 php8.3-fpm treetino-queue.service
sudo -u treetino php artisan migrate:status
```

Poté v prohlížeči ověřte:

1. načtení hlavní stránky a statických obrázků přes HTTPS;
2. přetrvání přepnutí češtiny a angličtiny;
3. funkčnost produktových rout a konfigurátoru;
4. registraci, přihlášení, ověřovací e-mail a obnovení hesla zákazníka;
5. uložení zprávy kontaktním formulářem;
6. přihlášení správce a správu překladů;
7. pokladnu Stripe v režimu a účtu schváleném pro dané vydání;
8. správné vykreslení a stažení PDF faktury;
9. že vývojářské nástroje prohlížeče nehlásí smíšený obsah ani chybějící soubory.

Během ověřování sledujte logy:

```bash
sudo tail -f /var/log/apache2/treetino-error.log
sudo -u treetino tail -f storage/logs/laravel.log
sudo journalctl -u treetino-queue.service -f
```

## Běžné ruční vydání

Před každým vydáním zálohujte MySQL a `.env`, zaznamenejte aktuální commit a ověřte, že nový commit prošel testy. Poté spusťte:

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

Po návratu webu proveďte ověřovací kontrolní seznam. Režim údržby udržujte co nejkratší.

## Zálohování a návrat vydání

Před každou migrací a v pravidelném plánu zálohujte:

- vzdálenou databázi MySQL;
- produkční `.env` a `APP_KEY` v chráněném úložišti tajemství;
- nahrané a běhové soubory, které nelze znovu vytvořit;
- nasazený commit nebo tag vydání.

Pro návrat aplikačního kódu zapněte režim údržby, přepněte na dříve zaznamenaný commit, znovu nainstalujte závislosti, sestavte frontend, obnovte mezipaměti, restartujte služby a proveďte ověřovací seznam.

Návrat databáze je samostatné rozhodnutí. Vrácení migrací Laravelu může ničit nebo měnit data a nemá se spouštět automaticky. Pokud neúspěšné vydání změnilo data nekompatibilně, obnovte zálohu databáze pořízenou před vydáním podle postupu poskytovatele databáze.
