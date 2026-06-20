<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['translation_key_id', 'locale', 'value', 'synced_at'])]
class Translation extends Model
{
    public function translationKey(): BelongsTo
    {
        return $this->belongsTo(TranslationKey::class);
    }

    protected function casts(): array
    {
        return ['synced_at' => 'datetime'];
    }
}
