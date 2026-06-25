# Data and integrations

## Main data model

| Model | Table | Important relationships and purpose |
| --- | --- | --- |
| `User` | `users` | Customer identity; has preorders and messages; may have a Stripe customer ID |
| `Admin` | `admins` | Independent administrator identity |
| `Preorder` | `preorders` | Belongs to a user; stores UUID, product, configuration, amount, status, and Stripe identifiers |
| `Message` | `messages` | Optionally belongs to a user; stores contact details and read/replied state |
| `TranslationKey` | `translation_keys` | Unique translation group/key; has locale translations |
| `Translation` | `translations` | Belongs to a translation key; stores one locale value and synchronization state |

Laravel also uses database tables for sessions, cache, queue jobs, failed jobs, job batches, and password-reset tokens.

## Preorder lifecycle

1. The browser submits email, product type, and the complete configuration to `POST /checkout`.
2. Laravel validates the request and finds or creates a customer by email.
3. A Stripe customer is created when the user does not yet have one.
4. Laravel creates a pending preorder before requesting the PaymentIntent.
5. Stripe returns a client secret; Laravel stores the PaymentIntent ID and returns the client secret and preorder UUID.
6. Stripe Elements confirms the payment in the browser.
7. The confirmation page loads the preorder by UUID.

Reservation amounts are stored in the smallest currency unit:

- Strom V1: `1200000` = CZK 12,000;
- Strom V2: `1200000` = CZK 12,000;
- Wind turbine: `600000` = CZK 6,000.

Product IDs, reservation amounts, frontend product definitions, and backend validation are currently code-defined. Update all corresponding definitions together when changing a product or price.

## Configuration payload

The preorder configuration is stored as JSON. Depending on the product it can contain structure color, leaf color, photovoltaic leaf style, connectivity, battery, charging add-ons, turbine presence, turbine size, mount, tree design, and selected grant.

Treat previously stored payloads as historical records. When evolving configuration fields, keep the confirmation page and invoice tolerant of older payload shapes.

## Invoice generation

`POST /preorders/invoice` accepts a preorder UUID, loads the preorder and customer, renders `resources/views/pdf/invoice.blade.php` through Dompdf, and returns an A4 PDF download.

The bundled DM Sans fonts under `storage/fonts` support invoice rendering. Verify font availability and PDF output after changing the invoice CSS or deployment filesystem.

## Contact messages

`POST /contact` validates name, email, and message. If a user with the submitted email exists, the message receives that user ID; otherwise `user_id` remains null. Deleting a user sets related message user IDs to null rather than deleting message content.

## Localization

Supported locales are `cs` and `en`. Locale selection is stored in the session and a long-lived `locale` cookie. `SetLocale` chooses the current locale for each request.

`config/translation_catalog.php` is the committed baseline. `TranslationService` builds the baseline messages and overlays locale values from MySQL. Resulting messages are cached for 24 hours per locale.

Synchronization inserts missing keys and values. Administrator edits set `synced_at` to null, clear the message cache, and appear in the dashboard status. A regular synchronization acknowledges live edits without overwriting them. Forced synchronization replaces them from the catalog.

Placeholders use `{name}` syntax. All locale values for a key must use the same set of placeholder names.

## Mail

Customer email verification and password reset depend on the configured Laravel mailer. A log mailer is useful locally, but a deployed environment needs a real delivery transport and a sender address belonging to the application domain.
