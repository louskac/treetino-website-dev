<?php

define('LARAVEL_START', microtime(true));

// Register the Composer autoloader...
require __DIR__ . '/../vendor/autoload.php';

// Prepare /tmp storage directory for Vercel serverless environment
$storagePath = '/tmp/storage';
foreach ([
    $storagePath . '/framework/views',
    $storagePath . '/framework/cache/data',
    $storagePath . '/framework/sessions',
    $storagePath . '/logs'
] as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// Ensure SQLite database exists in writable /tmp
$dbFile = '/tmp/database.sqlite';
if (!file_exists($dbFile)) {
    $sourceDb = __DIR__ . '/../database/database.sqlite';
    if (file_exists($sourceDb)) {
        @copy($sourceDb, $dbFile);
    } else {
        @touch($dbFile);
    }
}
putenv('DB_DATABASE=' . $dbFile);
$_ENV['DB_DATABASE'] = $dbFile;

// Bootstrap Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Override storage path to writable /tmp
$app->useStoragePath($storagePath);

// Handle request
$app->handleRequest(Illuminate\Http\Request::capture());
