<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class PreorderInitiateTest extends TestCase
{
    use RefreshDatabase;

    public function test_initiate_requires_valid_fields(): void
    {
        $response = $this->postJson('/checkout', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'type', 'configuration']);
    }

    public function test_initiate_rejects_invalid_product_type(): void
    {
        $response = $this->postJson('/checkout', [
            'email' => 'test@example.com',
            'type' => 'invalid-type',
            'configuration' => ['color' => 'white'],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    public function test_initiate_returns_clear_error_when_stripe_secret_is_missing(): void
    {
        Config::set('services.stripe.secret', null);

        $response = $this->postJson('/checkout', [
            'email' => 'test@example.com',
            'type' => 'strom-v1',
            'configuration' => ['color' => 'white'],
        ]);

        $response->assertStatus(500)
            ->assertJson([
                'message' => 'Stripe secret key is not configured. Please set STRIPE_SECRET in your .env file.',
            ]);
    }

    public function test_api_checkout_alias_route_works(): void
    {
        Config::set('services.stripe.secret', null);

        $response = $this->postJson('/api/checkout', [
            'email' => 'test@example.com',
            'type' => 'strom-v1',
            'configuration' => ['color' => 'white'],
        ]);

        $response->assertStatus(500);
    }
}
