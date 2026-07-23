<?php

namespace Tests\Feature;

use App\Mail\PreorderConfirmation;
use Tests\TestCase;

class PreorderConfirmationMailTest extends TestCase
{
    public function test_it_renders_the_uuid_in_html_and_text_content(): void
    {
        $uuid = '019da50e-a184-7120-bf79-262f53178c08';
        $mailable = new PreorderConfirmation($uuid, [
            'treeDesign' => 'cyber',
            'bikeChargerRequested' => true,
            'evChargerCount' => 0,
        ]);

        $mailable->assertSeeInHtml($uuid);
        $mailable->assertSeeInText($uuid);
        $mailable->assertSeeInHtml("https://treetino.eu/preorders/{$uuid}", false);
        $mailable->assertSeeInHtml('https://treetino.eu/img/branding/logo-type.svg', false);
        $mailable->assertSeeInHtml('Design stromu');
        $mailable->assertSeeInHtml('Cyber');
        $mailable->assertSeeInText('Nabíječka pro elektrokola: Ano');
        $mailable->assertDontSeeInHtml('Počet EV nabíječek');
        $mailable->assertHasSubject('Potvrzení objednávky');
    }
}
