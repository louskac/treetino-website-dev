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
            ->assertCookie('locale', 'en');
    }

    public function test_unsupported_locale_is_rejected(): void
    {
        $this->post('/locale', ['locale' => 'xx'])->assertSessionHasErrors('locale');
    }
}
