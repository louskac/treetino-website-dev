<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ContactController extends Controller
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
        return ($this->renderPublic)('Contact/Index', [

        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'mail' => 'required|email',
            'message' => 'required',
        ], [
            'name.required' => 'Name is required.',
            'mail.required' => 'Email is required.',
            'mail.email' => 'Email is not valid.',
            'message.required' => 'Message is required.',
        ]);

        $user = User::where('email', $request->mail)->first();

        Message::create([
            'user_id' => $user ? $user->id : null, // If user found, use ID, otherwise null
            'name' => $request->name,
            'email' => $request->mail,            // Fill email column regardless
            'message' => $request->message,
        ]);

        Log::info('New message stored: '.$request->mail);

        return response()->json([
            'status' => 'success',
            'message' => 'Thank you! Your message has been sent.',
        ], 200);
    }
}
