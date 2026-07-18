<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalController extends Controller
{
    private \Closure $renderPublic;

    public function __construct()
    {
        $this->renderPublic = function ($component, $props = []) {
            return Inertia::render($component, array_merge([

            ], $props));
        };
    }

    public function tos()
    {
        return ($this->renderPublic)('Legal/Tos', [

        ]);
    }

    public function pp()
    {
        return ($this->renderPublic)('Legal/Pp', [

        ]);
    }
}
