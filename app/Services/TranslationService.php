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
        $count = 0;

        DB::transaction(function () use ($force, &$count) {
            foreach (config('translation_catalog') as $group => $items) {
                foreach ($items as $key => $values) {
                    $translationKey = TranslationKey::firstOrCreate(
                        ['group' => $group, 'key' => $key],
                        ['description' => null],
                    );

                    foreach (config('localization.locales') as $locale) {
                        $value = $values[$locale] ?? $values[config('app.fallback_locale')] ?? '';
                        $translation = Translation::firstOrNew([
                            'translation_key_id' => $translationKey->id,
                            'locale' => $locale,
                        ]);

                        if (! $translation->exists || $force) {
                            $translation->value = $value;
                            $translation->save();
                            $count++;
                        }
                    }
                }
            }
        });

        $this->forget();

        return $count;
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
