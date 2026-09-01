/**
 * Vercel Serverless Function: /api/checkout
 * Handles checkout initialization and creates Stripe PaymentIntents in serverless environment
 */

import { randomUUID } from 'crypto';

const PRODUCT_MAPPING = {
    'strom-v1': 'prod_ULthweDdqBE4ew',
    'strom-v2': 'prod_ULthcqQBQuS7TS',
    turbina: 'prod_ULti62m2HYe2s8',
};

const RESERVATION_PRICES = {
    'strom-v1': 1200000, // 12 000 CZK in cents
    'strom-v2': 1200000, // 12 000 CZK in cents
    turbina: 600000,     // 6 000 CZK in cents
};

export default async function handler(req, res) {
    // Enable CORS for frontend requests
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method Not Allowed. Use POST.',
        });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { email, type, configuration } = body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(422).json({
                message: 'Platná e-mailová adresa je povinná.',
            });
        }

        if (!type || !PRODUCT_MAPPING[type]) {
            return res.status(422).json({
                message: 'Neplatný typ produktu.',
            });
        }

        const stripeSecret = process.env.STRIPE_SECRET;
        if (!stripeSecret) {
            return res.status(500).json({
                message: 'Stripe secret key is not configured. Please set STRIPE_SECRET in environment variables.',
            });
        }

        const amount = RESERVATION_PRICES[type];
        const stripeProductId = PRODUCT_MAPPING[type];
        const preorderUuid = randomUUID();

        // 1. Create or Find Stripe Customer
        const customerParams = new URLSearchParams();
        customerParams.append('email', email);
        customerParams.append('metadata[preorder_uuid]', preorderUuid);

        const customerRes = await fetch('https://api.stripe.com/v1/customers', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${stripeSecret}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: customerParams.toString(),
        });

        const customerData = await customerRes.json();
        if (!customerRes.ok) {
            console.error('Stripe Customer Creation Error:', customerData);
            return res.status(customerRes.status || 500).json({
                message: customerData.error?.message || 'Failed to initialize payment customer.',
            });
        }

        // 2. Create PaymentIntent
        const intentParams = new URLSearchParams();
        intentParams.append('amount', amount.toString());
        intentParams.append('currency', 'czk');
        intentParams.append('customer', customerData.id);
        intentParams.append('metadata[preorder_uuid]', preorderUuid);
        intentParams.append('metadata[stripe_product_id]', stripeProductId);
        intentParams.append('metadata[product_type]', type);
        if (configuration) {
            intentParams.append('metadata[configuration]', JSON.stringify(configuration).substring(0, 500));
        }

        const intentRes = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${stripeSecret}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: intentParams.toString(),
        });

        const intentData = await intentRes.json();
        if (!intentRes.ok) {
            console.error('Stripe PaymentIntent Creation Error:', intentData);
            return res.status(intentRes.status || 500).json({
                message: intentData.error?.message || 'Failed to create payment intent.',
            });
        }

        return res.status(200).json({
            client_secret: intentData.client_secret,
            preorder_uuid: preorderUuid,
        });
    } catch (error) {
        console.error('Unhandled Checkout Error:', error);
        return res.status(500).json({
            message: 'Při inicializaci platby došlo k chybě. Zkuste to prosím znovu.',
        });
    }
}
