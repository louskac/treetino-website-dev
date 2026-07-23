TREETINO

Děkujeme za vaši objednávku.

Platbu jsme úspěšně přijali. Kompletní souhrn objednávky a fakturu ke stažení najdete zde:
https://treetino.eu/preorders/{{ $uuid }}

ID objednávky: {{ $uuid }}

@if (count($configurationRows) > 0)
Souhrn konfigurace:
@foreach ($configurationRows as $row)
{{ $row['label'] }}: {{ $row['value'] }}
@endforeach
@endif

https://treetino.eu
