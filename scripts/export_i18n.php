<?php

require __DIR__ . '/../vendor/autoload.php';

$catalog = require __DIR__ . '/../config/translation_catalog.php';

function setNestedValue(&$arr, $path, $value) {
    $keys = explode('.', $path);
    $curr = &$arr;
    foreach ($keys as $key) {
        if (!isset($curr[$key]) || !is_array($curr[$key])) {
            $curr[$key] = [];
        }
        $curr = &$curr[$key];
    }
    $curr = $value;
}

$output = ['cs' => [], 'en' => []];

function processSection(&$cs, &$en, $prefix, $data) {
    foreach ($data as $key => $val) {
        $fullKey = $prefix ? "{$prefix}.{$key}" : $key;
        if (isset($val['cs']) || isset($val['en'])) {
            if (isset($val['cs'])) setNestedValue($cs, $fullKey, $val['cs']);
            if (isset($val['en'])) setNestedValue($en, $fullKey, $val['en']);
        } elseif (is_array($val)) {
            processSection($cs, $en, $prefix, $val);
        }
    }
}

foreach ($catalog as $section => $data) {
    foreach ($data as $key => $val) {
        $fullKey = "{$section}.{$key}";
        if (isset($val['cs'])) setNestedValue($output['cs'], $fullKey, $val['cs']);
        if (isset($val['en'])) setNestedValue($output['en'], $fullKey, $val['en']);
    }
}

$jsonPath = __DIR__ . '/../resources/js/i18n_messages.json';
file_put_contents($jsonPath, json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo "Successfully exported " . count($catalog) . " catalog sections into resources/js/i18n_messages.json!\n";
