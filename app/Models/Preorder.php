<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Preorder extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $fillable = [
        'user_id',
        'stripe_product_id',
        'product_type',
        'configuration',
        'status',
        'stripe_payment_intent_id',
        'amount_total',
    ];

    // This automatically converts the JSON from DB to a PHP array
    protected $casts = [
        'configuration' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
