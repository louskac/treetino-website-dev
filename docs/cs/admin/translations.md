# Správa překladů

Editor překladů spravuje české a anglické texty registrované ve verzovaném katalogu překladů aplikace.

## Synchronizace katalogu

Otevřete nástěnku správce nebo `/admin/translations` a spusťte synchronizaci, pokud aplikace hlásí nevyřízené změny katalogu.

Synchronizace:

- doplní chybějící překladové klíče a jazykové hodnoty z verzovaného katalogu;
- zachová hodnoty, které správci již upravili;
- označí živé hodnoty jako synchronizované;
- obnoví mezipaměť překladů.

Samotné otevření editoru katalog nesynchronizuje.

`[[SCREENSHOT]] - Akce synchronizace překladů a aktuální stav`

## Vyhledání překladu

Seznam je řazen nejprve podle skupiny a poté podle klíče. Na stránce obsahuje 30 klíčů.

Použijte:

- **Hledat** pro shodu s klíčem, jeho popisem nebo přeloženým textem;
- **Skupina** pro omezení výsledků na jednu skupinu katalogu;
- stránkování pro pohyb mezi výsledky.

Vyhledávání a filtr skupiny zůstávají při procházení stránek v parametrech adresy.

`[[SCREENSHOT]] - Seznam překladů s vyhledáváním a filtrem skupiny`

## Úprava překladu

1. Vyhledejte požadovaný klíč.
2. Upravte českou i anglickou hodnotu.
3. Řádek uložte.
4. Zkontrolujte zprávu o úspěchu.

Oba jazyky jsou povinné a hodnota může obsahovat nejvýše 10 000 znaků. Uložením se vymaže mezipaměť překladů, takže je nový text dostupný na webu.

`[[SCREENSHOT]] - Řádek překladu s českou a anglickou hodnotou před uložením`

## Zachování zástupných symbolů

Zástupné symboly jsou dynamické názvy ve složených závorkách, například `{price}`. Všechny jazyky jednoho klíče musí obsahovat přesně stejné názvy zástupných symbolů. Okolní věta a pořadí se mohou lišit.

Platný příklad:

```text
cs: Cena je {price}
en: The price is {price}
```

Neplatný příklad:

```text
cs: Cena je {price}
en: Contact us
```

Editor rozdílné zástupné symboly odmítne, aby zabránil poškození textu za běhu.

## Stav synchronizace po úpravě

Úprava správce se na webu použije okamžitě, ale označí se jako nesynchronizovaná živá hodnota. Nástěnka zobrazuje počet dotčených hodnot a klíčů. Po kontrole úprav spusťte synchronizaci, která živý stav potvrdí a změny nepřepíše.
