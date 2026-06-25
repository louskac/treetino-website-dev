# Zákaznický účet

Přihlášení zákazníků je oddělené od přihlášení správců.

## Registrace

Otevřete `/register` a zadejte jméno, e-mailovou adresu, heslo a potvrzení hesla. Odesláním formuláře vytvoříte účet.

`[[SCREENSHOT]] - Registrační formulář zákazníka`

E-mailová adresa musí být jedinečná. Pokud heslo nesplňuje požadavky, formulář zobrazí chybu ověření.

## Ověření e-mailu

Po registraci použijte ověřovací odkaz zaslaný na vaši e-mailovou adresu. Omezená nastavení účtu vyžadují ověřený e-mail. Na ověřovací obrazovce lze v případě potřeby odeslat novou ověřovací zprávu.

`[[SCREENSHOT]] - Obrazovka ověření e-mailu s možností opětovného odeslání`

## Přihlášení a odhlášení

Otevřete `/login` a zadejte e-mail a heslo. Volba **Zapamatovat si mě** ponechá relaci v daném prohlížeči dostupnou déle.

`[[SCREENSHOT]] - Přihlašovací formulář zákazníka s volbou Zapamatovat si mě`

Aktuální relaci ukončíte volbou **Odhlásit se** v navigaci účtu.

Po pěti neúspěšných pokusech o přihlášení během jedné minuty pro stejný e-mail a síťovou adresu je přihlašování dočasně omezeno.

## Obnovení zapomenutého hesla

1. Na přihlašovací stránce vyberte **Zapomenuté heslo?**
2. Zadejte e-mailovou adresu účtu.
3. Otevřete odkaz pro obnovení hesla zaslaný e-mailem.
4. Zadejte a potvrďte nové heslo.

`[[SCREENSHOT]] - Formulář žádosti o obnovení hesla`

Odkazy pro obnovení platí 60 minut. O nový e-mail lze požádat po uplynutí časového omezení žádostí.

## Nastavení profilu

Na `/settings/profile` lze změnit jméno nebo e-mailovou adresu účtu.

Změnou e-mailové adresy se zruší její ověřený stav. Před použitím funkcí vyžadujících ověření ověřte novou adresu.

Profilová stránka umožňuje také smazání účtu. Smazání vyžaduje aktuální heslo, odhlásí zákazníka a zákaznický účet trvale odstraní. Existující kontaktní zprávy si zachovají obsah, ale nebudou již propojené se smazaným účtem.

`[[SCREENSHOT]] - Nastavení profilu a oblast pro smazání účtu`

## Heslo a dvoufaktorové ověření

Otevřete `/settings/security`. Přístup na tuto stránku může znovu vyžadovat potvrzení aktuálního hesla.

Můžete:

- změnit heslo zadáním aktuálního hesla a potvrzením nového;
- zapnout dvoufaktorové ověření;
- potvrdit jeho nastavení kódem z autentizační aplikace;
- zobrazit a obnovit záložní kódy;
- dvoufaktorové ověření vypnout.

`[[SCREENSHOT]] - Nastavení zabezpečení s ovládáním dvoufaktorového ověření`

Záložní kódy uložte na bezpečné místo. Každý kód slouží jako náhradní způsob přihlášení, když není autentizační aplikace dostupná.

Je-li dvoufaktorové ověření aktivní, přihlášení vyžaduje aktuální autentizační nebo záložní kód. Pokusy jsou omezeny na pět za minutu.

`[[SCREENSHOT]] - Dvoufaktorová přihlašovací výzva s režimy kódu a záložního kódu`

## Vzhled

Na `/settings/appearance` lze vybrat vzhled rozhraní účtu. Nastavení se ukládá v prohlížeči.

`[[SCREENSHOT]] - Možnosti nastavení vzhledu`
