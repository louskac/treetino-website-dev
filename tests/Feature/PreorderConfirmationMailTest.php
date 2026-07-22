<?php

namespace Tests\Feature;

use App\Mail\PreorderConfirmation;
use Tests\TestCase;

class PreorderConfirmationMailTest extends TestCase
{
    public function test_it_renders_the_uuid_in_html_and_text_content(): void
    {
        $uuid = '019da50e-a184-7120-bf79-262f53178c08';
        $mailable = new PreorderConfirmation($uuid);

        $mailable->assertSeeInHtml($uuid);
        $mailable->assertSeeInText($uuid);
        $mailable->assertHasSubject('Potvrzení objednávky');
    }
}
