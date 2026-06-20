<?php

namespace App\Services;

use App\Models\Translation;
use App\Models\TranslationKey;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TranslationService
{
    public function messages(string $locale): array
    {
        return Cache::remember(
            "translations.messages.{$locale}",
            config('localization.cache_ttl'),
            fn () => $this->buildMessages($locale),
        );
    }

    public function sync(bool $force = false): int
    {
        $count = DB::transaction(function () use ($force): int {
            $now = now();
            $catalog = config('translation_catalog');
            $keyRows = [];

            foreach ($catalog as $group => $items) {
                foreach (array_keys($items) as $key) {
                    $keyRows[] = [
                        'group' => $group,
                        'key' => $key,
                        'description' => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            TranslationKey::insertOrIgnore($keyRows);

            $keys = TranslationKey::query()
                ->get(['id', 'group', 'key'])
                ->keyBy(fn (TranslationKey $key) => "{$key->group}.{$key->key}");
            $existing = Translation::query()
                ->whereIn('translation_key_id', $keys->pluck('id'))
                ->get(['translation_key_id', 'locale'])
                ->keyBy(fn (Translation $translation) => "{$translation->translation_key_id}.{$translation->locale}");
            $rows = [];

            foreach ($catalog as $group => $items) {
                foreach ($items as $key => $values) {
                    $translationKey = $keys->get("{$group}.{$key}");

                    foreach (config('localization.locales') as $locale) {
                        if (! $force && $existing->has("{$translationKey->id}.{$locale}")) {
                            continue;
                        }

                        $rows[] = [
                            'translation_key_id' => $translationKey->id,
                            'locale' => $locale,
                            'value' => $values[$locale] ?? $values[config('app.fallback_locale')] ?? '',
                            'synced_at' => $now,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    }
                }
            }

            if ($rows !== []) {
                Translation::upsert(
                    $rows,
                    ['translation_key_id', 'locale'],
                    ['value', 'synced_at', 'updated_at'],
                );
            }

            Translation::query()->update(['synced_at' => $now]);

            return count($rows);
        });

        $this->forget();

        return $count;
    }

    /** @return array{unsynchronizedValues: int, unsynchronizedKeys: int} */
    public function status(): array
    {
        $pending = Translation::query()->whereNull('synced_at');

        return [
            'unsynchronizedValues' => (clone $pending)->count(),
            'unsynchronizedKeys' => (clone $pending)->distinct()->count('translation_key_id'),
        ];
    }

    public function forget(?string $locale = null): void
    {
        $locales = $locale ? [$locale] : config('localization.locales');

        foreach ($locales as $item) {
            Cache::forget("translations.messages.{$item}");
        }
    }

    private function buildMessages(string $locale): array
    {
        $messages = [];
        $fallback = config('app.fallback_locale');

        foreach (config('translation_catalog') as $group => $items) {
            foreach ($items as $key => $values) {
                Arr::set($messages, "{$group}.{$key}", $values[$locale] ?? $values[$fallback] ?? "{$group}.{$key}");
            }
        }

        if (! Schema::hasTable('translations')) {
            return $messages;
        }

        Translation::query()
            ->where('locale', $locale)
            ->with('translationKey:id,group,key')
            ->get()
            ->each(function (Translation $translation) use (&$messages) {
                Arr::set(
                    $messages,
                    "{$translation->translationKey->group}.{$translation->translationKey->key}",
                    $translation->value,
                );
            });

        return $messages;
    }
}
