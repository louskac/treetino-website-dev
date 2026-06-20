<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\TranslationKey;
use App\Services\TranslationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TranslationManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_manage_translations(): void
    {
        $this->get('/admin/translations')->assertRedirect('/admin/login');

        $this->actingAs(Admin::factory()->create(), 'admin')
            ->get('/admin/translations')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Translations/Index')->has('keys.data'));
    }

    public function test_admin_can_update_translation_and_cache_is_refreshed(): void
    {
        $service = app(TranslationService::class);
        $service->sync();
        $key = TranslationKey::where('group', 'home')->where('key', 'meta.title')->firstOrFail();

        $this->actingAs(Admin::factory()->create(), 'admin')
            ->put("/admin/translations/{$key->id}", [
                'translations' => ['cs' => 'Nový název', 'en' => 'New title'],
            ])->assertRedirect();

        $this->assertSame('Nový název', data_get($service->messages('cs'), 'home.meta.title'));
        $this->assertSame('New title', data_get($service->messages('en'), 'home.meta.title'));
    }

    public function test_translation_placeholders_must_match(): void
    {
        $service = app(TranslationService::class);
        $service->sync();
        $key = TranslationKey::firstOrFail();

        $this->actingAs(Admin::factory()->create(), 'admin')
            ->put("/admin/translations/{$key->id}", [
                'translations' => ['cs' => 'Cena {price}', 'en' => 'Price'],
            ])->assertSessionHasErrors('translations');
    }

    public function test_sync_does_not_overwrite_editorial_changes_without_force(): void
    {
        $service = app(TranslationService::class);
        $service->sync();
        $key = TranslationKey::where('group', 'home')->where('key', 'meta.title')->firstOrFail();
        $key->translations()->where('locale', 'cs')->update(['value' => 'Ruční změna']);

        $service->sync();

        $this->assertDatabaseHas('translations', [
            'translation_key_id' => $key->id,
            'locale' => 'cs',
            'value' => 'Ruční změna',
        ]);
    }
}
