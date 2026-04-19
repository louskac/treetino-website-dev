<?php

namespace App\Http\Controllers;

use App\Models\Preorder;
use Inertia\Inertia;

class OrderController extends Controller
{
    private \Closure $renderPublic;

    public function __construct()
    {
        $this->renderPublic = function ($component, $props = []) {
            return Inertia::render($component, array_merge([

            ], $props));
        };
    }

    public function success($uuid)
    {
        $preorder = Preorder::where('uuid', $uuid)->firstOrFail();

        return ($this->renderPublic)('Preorders/Success', [
            'preorder' => $preorder,
        ]);
    }
}
