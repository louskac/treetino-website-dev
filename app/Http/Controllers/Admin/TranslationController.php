<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TranslationKey;
use App\Services\TranslationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TranslationController extends Controller
{
    public function index(Request $request, TranslationService $service): Response
    {
        $service->sync();

        $search = $request->string('search')->trim()->toString();
        $group = $request->string('group')->trim()->toString();

        $keys = TranslationKey::query()
            ->with('translations:id,translation_key_id,locale,value')
            ->when($group, fn ($query) => $query->where('group', $group))
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('key', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('translations', fn ($query) => $query->where('value', 'like', "%{$search}%"));
                });
            })
            ->orderBy('group')
            ->orderBy('key')
            ->paginate(30)
            ->withQueryString()
            ->through(fn (TranslationKey $key) => [
                'id' => $key->id,
                'group' => $key->group,
                'key' => $key->key,
                'description' => $key->description,
                'translations' => $key->translations->pluck('value', 'locale'),
            ]);

        return Inertia::render('Admin/Translations/Index', [
            'keys' => $keys,
            'locales' => config('localization.locales'),
            'groups' => TranslationKey::query()->distinct()->orderBy('group')->pluck('group'),
            'filters' => compact('search', 'group'),
        ]);
    }

    public function update(Request $request, TranslationKey $translationKey, TranslationService $service): RedirectResponse
    {
        $locales = config('localization.locales');
        $rules = collect($locales)->mapWithKeys(fn ($locale) => ["translations.{$locale}" => ['required', 'string', 'max:10000']])->all();
        $values = Validator::make($request->all(), $rules)->validate()['translations'];

        $placeholderSets = collect($values)
            ->map(fn ($value) => $this->placeholders($value))
            ->unique(fn ($value) => implode('|', $value));

        if ($placeholderSets->count() > 1) {
            throw ValidationException::withMessages([
                'translations' => 'Every locale must contain the same {placeholders}.',
            ]);
        }

        foreach ($locales as $locale) {
            $translationKey->translations()->updateOrCreate(
                ['locale' => $locale],
                ['value' => $values[$locale]],
            );
        }

        $service->forget();

        return back()->with('success', "{$translationKey->group}.{$translationKey->key} updated.");
    }

    /** @return array<int, string> */
    private function placeholders(string $value): array
    {
        preg_match_all('/\{([A-Za-z0-9_]+)\}/', $value, $matches);
        $placeholders = array_unique($matches[1]);
        sort($placeholders);

        return $placeholders;
    }
}
