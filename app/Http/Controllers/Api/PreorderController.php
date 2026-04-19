<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Preorder;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Stripe\Customer;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class PreorderController extends Controller
{
    // Checkout
    public function initiate(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'type' => 'required|string|in:strom-v1,strom-v2,turbina',
            'configuration' => 'required|array',
        ]);

        $productMapping = [
            'strom-v1' => 'prod_ULthweDdqBE4ew',
            'strom-v2' => 'prod_ULthcqQBQuS7TS',
            'turbina' => 'prod_ULti62m2HYe2s8',
        ];

        $stripeProductId = $productMapping[$request->type];

        Stripe::setApiKey(config('services.stripe.secret'));

        // 1. Find or Create User
        $user = User::firstOrCreate(
            ['email' => $request->email],
            ['name' => explode('@', $request->email)[0]] // Temporary name
        );

        // 2. Ensure User has a Stripe Customer ID
        if (! $user->stripe_customer_id) {
            $customer = Customer::create([
                'email' => $user->email,
                'metadata' => ['user_id' => $user->id],
            ]);
            $user->update(['stripe_customer_id' => $customer->id]);
        }

        // 3. Determine Amount (Logic for your 3 products)
        // Hardcoded for now based on your 12,000 Kč example
        $amount = 1200000;

        // 4. CREATE PREORDER RECORD IN DB FIRST
        // This gives us the $preorder->id immediately
        $preorder = Preorder::create([
            'user_id' => $user->id,
            'stripe_product_id' => $stripeProductId,
            'configuration' => $request->configuration,
            'status' => 'pending',
            'product_type' => $request->type,
            'amount_total' => $amount,
        ]);

        // 5. CREATE PAYMENT INTENT WITH METADATA IN ONE GO
        $intent = PaymentIntent::create([
            'amount' => $amount,
            'currency' => 'czk',
            'customer' => $user->stripe_customer_id,
            'metadata' => [
                'preorder_id' => $preorder->id, // Now we have this!
                'stripe_product_id' => $stripeProductId,
            ],
        ]);

        // 6. UPDATE PREORDER WITH INTENT ID (Using local update)
        $preorder->update(['stripe_payment_intent_id' => $intent->id]);

        // 7. Return the Client Secret to Vue
        return response()->json([
            'client_secret' => $intent->client_secret,
            'preorder_uuid' => $preorder->uuid,
        ]);
    }

    // Download Invoice
    public function invoice(Request $request) {
        $request->validate([
            'uuid' => 'required',
        ]);

        $preorder = Preorder::where('uuid', $request
            ->input('uuid'))
            ->with('user')->firstOrFail();

        $data = [
            'preorder' => $preorder,
            'date' => date('d. m. Y'),
        ];

        $pdf = Pdf::loadView('pdf.invoice', $data)
            ->setPaper('a4', 'portrait');

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="invoice-'.$preorder->uuid.'.pdf"',
        ]);
    }

    // Invoice Test
    // 019da517-c3eb-7184-afa7-6015171402c3
    public function invoicetest(Request $request) {
        $preorder = Preorder::where('uuid', '019da50e-a184-7120-bf79-262f53178c08')
            ->with('user')->firstOrFail();

        $data = [
            'preorder' => $preorder,
            'date' => date('d. m. Y'),
        ];

        return view('pdf.invoice', $data);
    }
}
