<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CollaborationController extends Controller
{
    private \Closure $renderPublic;

    public function __construct()
    {
        $this->renderPublic = function ($component, $props = []) {
            return Inertia::render($component, array_merge([

            ], $props));
        };
    }

    public function index()
    {
        return ($this->renderPublic)('Collaboration/Index', [

        ]);
    }
}
