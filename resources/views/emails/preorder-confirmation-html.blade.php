<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Potvrzení objednávky</title>
</head>
<body style="margin: 0; background-color: #f4f6fa; color: #212955; font-family: 'DM Sans', Arial, sans-serif;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">Vaše objednávka Treetino byla odeslána.</div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6fa; padding: 32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 640px; overflow: hidden; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px;">
                    <tr>
                        <td style="padding: 30px 40px; background-color: #ffffff; border-top: 8px solid #183d89; border-bottom: 1px solid #e5e7eb;">
                            <a href="https://treetino.eu" style="display: inline-block; text-decoration: none;">
                                <img src="https://treetino.eu/img/branding/logo-type.svg" width="200" alt="Treetino" style="display: block; width: 200px; max-width: 100%; height: auto;">
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 14px; color: #212955; font-size: 28px; line-height: 1.25;">Děkujeme za vaši objednávku</h1>
                            <p style="margin: 0 0 28px; color: #2a293a; font-size: 16px; line-height: 1.65;">
                                Vaše objednávka byla úspěšně odeslána. Jakmile bude platba potvrzena, na stránce objednávky si budete moci stáhnout fakturu.
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                                <tr>
                                    <td align="center" bgcolor="#2762ad" style="border-radius: 12px;">
                                        <a href="https://treetino.eu/preorders/{{ $uuid }}" style="display: inline-block; padding: 14px 24px; color: #ffffff; font-size: 16px; font-weight: 700; line-height: 1.2; text-decoration: none; border-radius: 12px;">
                                            Zobrazit objednávku a stáhnout fakturu
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 12px 0 32px; color: #6b7280; font-family: monospace; font-size: 10px; line-height: 1.4; text-align: center; word-break: break-all;">
                                ID objednávky: {{ $uuid }}
                            </p>

                            @if (count($configurationRows) > 0)
                                <h2 style="margin: 0 0 14px; color: #212955; font-size: 20px; line-height: 1.3;">Souhrn konfigurace</h2>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="overflow: hidden; border: 1px solid #e5e7eb; border-radius: 12px; border-collapse: separate; border-spacing: 0;">
                                    @foreach ($configurationRows as $row)
                                        <tr>
                                            <td width="48%" style="padding: 13px 16px; background-color: {{ $loop->odd ? '#f4f6fa' : '#ffffff' }}; border-bottom: {{ $loop->last ? '0' : '1px solid #e5e7eb' }}; color: #183d89; font-size: 14px; font-weight: 700; line-height: 1.4; vertical-align: top;">
                                                {{ $row['label'] }}
                                            </td>
                                            <td style="padding: 13px 16px; background-color: {{ $loop->odd ? '#f4f6fa' : '#ffffff' }}; border-bottom: {{ $loop->last ? '0' : '1px solid #e5e7eb' }}; color: #2a293a; font-size: 14px; line-height: 1.4; vertical-align: top;">
                                                {{ $row['value'] }}
                                            </td>
                                        </tr>
                                    @endforeach
                                </table>
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 22px 40px; background-color: #212955; color: #ffffff; font-size: 12px; line-height: 1.6; text-align: center;">
                            Treetino · <a href="https://treetino.eu" style="color: #ffffff; text-decoration: underline;">treetino.eu</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
