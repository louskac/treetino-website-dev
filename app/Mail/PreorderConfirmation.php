<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PreorderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly string $uuid) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Potvrzení objednávky',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.preorder-confirmation-html',
            text: 'emails.preorder-confirmation-text',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
