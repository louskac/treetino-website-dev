<?php

namespace App\Console\Commands;

use App\Services\TranslationService;
use Illuminate\Console\Command;

class SyncTranslations extends Command
{
    protected $signature = 'translations:sync {--force : Overwrite existing translations}';

    protected $description = 'Synchronize the committed translation catalog with the database';

    public function handle(TranslationService $translations): int
    {
        $count = $translations->sync((bool) $this->option('force'));
        $this->info("Synchronized {$count} translation values.");

        return self::SUCCESS;
    }
}
