<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguratorController extends Controller
{
    private \Closure $renderPublic;

    public function __construct()
    {
        $this->renderPublic = function ($component, $props = []) {
            return Inertia::render($component, array_merge([

            ], $props));
        };
    }

    public function index(Request $request, $product = null)
    {
        return ($this->renderPublic)('Configurator/Index', [
            'initialProduct' => $product,
        ]);
    }
}
