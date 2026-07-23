TREETINO

Děkujeme za vaši objednávku.

Vaše objednávka byla úspěšně odeslána. Jakmile bude platba potvrzena, na stránce objednávky si budete moci stáhnout fakturu:
https://treetino.eu/preorders/{{ $uuid }}

ID objednávky: {{ $uuid }}

@if (count($configurationRows) > 0)
Souhrn konfigurace:
@foreach ($configurationRows as $row)
{{ $row['label'] }}: {{ $row['value'] }}
@endforeach
@endif

https://treetino.eu
