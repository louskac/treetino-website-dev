<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Preorder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class WebhookController extends Controller
{
    public function webhook(Request $request)
    {
        $endpoint_secret = 'whsec_FeHu2mIYoB4y9BLiVcmqvZOu27VT7ZUF'; // The whsec_... key from your CLI
        $sig_header = $request->header('Stripe-Signature');
        $payload = $request->getContent();

        try {
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // --- THE SWITCHBOARD ---
        // This maps Stripe event types to your internal functions
        switch ($event->type) {
            case 'payment_intent.succeeded':
                $this->piSuccess($event->data->object);
                break;

            case 'payment_intent.created':
                // You can add more later
                break;

            default:
                Log::info('Received unhandled event type: ' . $event->type);
        }

        return response()->json(['status' => 'success']);
    }

    private function piSuccess($paymentIntent)
    {
        // GET THE INTENT ID
        $intentId = $paymentIntent->id;

        // GET THE AMOUNT
        // $amount = $paymentIntent->amount;

        // GET METADATA
        // $userId = $paymentIntent->metadata->user_id;

        Log::info('Payment Succeeded for ID: ' . $intentId);

        $preorder = Preorder::where('stripe_payment_intent_id', $intentId)->firstOrFail();
        $preorder->status = 'paid';
        $preorder->save();

        // Add YAP logging.
    }
}
