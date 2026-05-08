<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductsController extends Controller
{
    private \Closure $renderPublic;

    public function __construct()
    {
        $this->renderPublic = function ($component, $props = []) {
            return Inertia::render($component, array_merge([

            ], $props));
        };
    }

    public function treeV1()
    {
        return ($this->renderPublic)('Products/V1', [

        ]);
    }

    public function treeV2()
    {
        return ($this->renderPublic)('Products/V2', [

        ]);
    }

    public function turbine()
    {
        return ($this->renderPublic)('Products/Turbine', [

        ]);
    }
}
