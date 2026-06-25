# Translation management

The translation editor manages the Czech and English text values registered in the application’s committed translation catalog.

## Synchronize the catalog

Open the administrator dashboard or `/admin/translations` and run synchronization when the application reports pending catalog changes.

Synchronization:

- adds missing translation keys and locale values from the committed catalog;
- preserves values that administrators have already edited;
- marks live values as synchronized;
- refreshes the translation cache.

Opening the translation editor alone does not synchronize the catalog.

`[[SCREENSHOT]] - Translation synchronization action and current status`

## Find a translation

The translation list is ordered first by group and then by key. It contains 30 keys per page.

Use:

- **Search** to match a key, its description, or translated text;
- **Group** to restrict results to one catalog group;
- pagination to move through the results.

Search and group filters remain in the address query while navigating pages.

`[[SCREENSHOT]] - Translation list with search and group filters`

## Edit a translation

1. Find the required key.
2. Edit both the Czech and English values.
3. Save the row.
4. Check the success message.

Each locale is required and a value can contain up to 10,000 characters. Saving clears the translation cache so the new copy is available to the website.

`[[SCREENSHOT]] - Translation row with Czech and English values before saving`

## Preserve placeholders

Placeholders are dynamic names enclosed in braces, for example `{price}`. Every locale for one key must contain exactly the same placeholder names. Their surrounding sentence and order may differ.

Valid example:

```text
cs: Cena je {price}
en: The price is {price}
```

Invalid example:

```text
cs: Cena je {price}
en: Contact us
```

The editor rejects mismatched placeholders to prevent broken text at runtime.

## Synchronization status after editing

An administrator edit is immediately used by the website, but it is marked as an unsynchronized live value. The dashboard shows the number of affected values and keys. Run synchronization after reviewing the edits to acknowledge the live state; synchronization does not overwrite those edits.
