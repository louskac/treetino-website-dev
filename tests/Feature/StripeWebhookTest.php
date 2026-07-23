<?php

namespace Tests\Feature;

use App\Mail\PreorderConfirmation;
use App\Models\Preorder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class StripeWebhookTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_payment_marks_preorder_paid_and_sends_one_email(): void
    {
        Mail::fake();

        $user = User::factory()->create();
        $preorder = Preorder::create([
            'user_id' => $user->id,
            'stripe_product_id' => 'prod_test',
            'product_type' => 'strom-v1',
            'configuration' => [],
            'status' => 'pending',
            'stripe_payment_intent_id' => 'pi_test',
            'amount_total' => 1200000,
        ]);

        $payload = json_encode([
            'id' => 'evt_test',
            'object' => 'event',
            'type' => 'payment_intent.succeeded',
            'data' => [
                'object' => [
                    'id' => 'pi_test',
                    'object' => 'payment_intent',
                ],
            ],
        ], JSON_THROW_ON_ERROR);

        $timestamp = time();
        $signature = hash_hmac(
            'sha256',
            $timestamp.'.'.$payload,
            'whsec_FeHu2mIYoB4y9BLiVcmqvZOu27VT7ZUF',
        );
        $headers = [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_STRIPE_SIGNATURE' => "t={$timestamp},v1={$signature}",
        ];

        $this->call('POST', '/webhook', [], [], [], $headers, $payload)->assertOk();

        $this->assertSame('paid', $preorder->fresh()->status);
        Mail::assertSent(PreorderConfirmation::class, 1);
        Mail::assertSent(
            PreorderConfirmation::class,
            fn (PreorderConfirmation $mail) => $mail->hasTo($user->email)
                && $mail->uuid === $preorder->uuid,
        );
    }
}
