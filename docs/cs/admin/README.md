# Příručka správce

Administrace používá účty a relace oddělené od zákaznických účtů.

## Přihlášení

Otevřete `/admin/login`, zadejte e-mail a heslo správce, případně zapněte **Zapamatovat si mě**, a formulář odešlete.

`[[SCREENSHOT]] - Přihlašovací formulář správce`

Pět neúspěšných pokusů pro stejný e-mail a síťovou adresu dočasně zablokuje další pokusy na jednu minutu. Přihlášený zákazník není automaticky správcem.

Správcovské účty vytváří vývojář nebo provozovatel z příkazové řádky serveru. Veřejný registrační formulář pro správce neexistuje.

## Nástěnka

Po přihlášení `/admin/dashboard` zobrazuje:

- počet překladových klíčů;
- počet přeložených hodnot;
- počet nastavených jazyků;
- informaci, zda změny překladů čekají na synchronizaci.

`[[SCREENSHOT]] - Nástěnka správce se statistikami a stavem překladů`

Pomocí navigace otevřete [správu překladů](translations.md). Volbou **Odhlásit se** ukončíte správcovskou relaci.

## Obsah

- [Správa překladů](translations.md)
