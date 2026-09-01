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
        $originalEnv = $_ENV['STRIPE_SECRET'] ?? null;
        $originalServer = $_SERVER['STRIPE_SECRET'] ?? null;
        unset($_ENV['STRIPE_SECRET'], $_SERVER['STRIPE_SECRET']);
        putenv('STRIPE_SECRET');

        $response = $this->postJson('/checkout', [
            'email' => 'test@example.com',
            'type' => 'strom-v1',
            'configuration' => ['color' => 'white'],
        ]);

        if ($originalEnv) {
            $_ENV['STRIPE_SECRET'] = $originalEnv;
            putenv('STRIPE_SECRET='.$originalEnv);
        }
        if ($originalServer) {
            $_SERVER['STRIPE_SECRET'] = $originalServer;
        }

        $response->assertStatus(500)
            ->assertJson([
                'message' => 'Stripe secret key is not configured. Please set STRIPE_SECRET in your .env file.',
            ]);
    }

    public function test_api_checkout_alias_route_works(): void
    {
        $response = $this->postJson('/api/checkout', [
            'email' => 'test-alias@example.com',
            'type' => 'strom-v1',
            'configuration' => ['color' => 'white'],
        ]);

        $response->assertOk()
            ->assertJsonStructure(['client_secret', 'preorder_uuid']);
    }
}
