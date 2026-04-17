<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('preorders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // The product identifier - Stripe ID
            $table->string('stripe_product_id');

            // Store the full configuration (colors, wheels, etc.) as JSON
            $table->json('configuration')->nullable();

            // Payment tracking
            $table->string('status')->default('pending'); // pending, paid, cancelled
            $table->string('stripe_payment_intent_id')->nullable()->index();

            // Store amount in cents (12000 Kč = 1200000) - Best practice for Stripe
            $table->integer('amount_total');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preorders');
    }
};
