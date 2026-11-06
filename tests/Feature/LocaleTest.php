<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocaleTest extends TestCase
{
    use RefreshDatabase;

    public function test_locale_can_be_changed(): void
    {
        $this->from('/')->post('/locale', ['locale' => 'en'])
            ->assertRedirect('/')
            ->assertPlainCookie('locale', 'en');
    }

    public function test_unsupported_locale_is_rejected(): void
    {
        $this->post('/locale', ['locale' => 'xx'])->assertSessionHasErrors('locale');
    }

    public function test_locale_is_detected_from_geo_ip_header(): void
    {
        $this->withHeaders(['x-vercel-ip-country' => 'US'])
            ->get('/')
            ->assertOk();
        $this->assertSame('en', app()->getLocale());

        $this->withHeaders(['x-vercel-ip-country' => 'CZ'])
            ->get('/')
            ->assertOk();
        $this->assertSame('cs', app()->getLocale());

        $this->withHeaders(['x-vercel-ip-country' => 'SK'])
            ->get('/')
            ->assertOk();
        $this->assertSame('cs', app()->getLocale());
    }

    public function test_locale_is_detected_from_accept_language_header(): void
    {
        $this->withHeaders(['Accept-Language' => 'en-US,en;q=0.9'])
            ->get('/')
            ->assertOk();
        $this->assertSame('en', app()->getLocale());

        $this->flushSession();

        $this->withHeaders(['Accept-Language' => 'cs-CZ,cs;q=0.9,en;q=0.8'])
            ->get('/')
            ->assertOk();
        $this->assertSame('cs', app()->getLocale());
    }

    public function test_explicit_query_parameter_overrides_headers(): void
    {
        $this->withHeaders(['x-vercel-ip-country' => 'CZ'])
            ->get('/?lang=en')
            ->assertOk();
        $this->assertSame('en', app()->getLocale());
    }
}
