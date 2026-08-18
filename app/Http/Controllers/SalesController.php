<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SalesController extends Controller
{
    /**
     * Display the Salesperson & Dealer landing page.
     */
    public function index(): Response
    {
        return Inertia::render('Sales/Index', [
            'pricingAppUrl' => config('app.pricing_app_url', 'https://treetino-pricing.vercel.app'),
        ]);
    }
}
