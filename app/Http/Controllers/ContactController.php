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
            'name.required' => __('contact.validation.name_required'),
            'mail.required' => __('contact.validation.email_required'),
            'mail.email' => __('contact.validation.email_invalid'),
            'message.required' => __('contact.validation.message_required'),
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
            'message' => __('contact.form.success'),
        ], 200);
    }
}
