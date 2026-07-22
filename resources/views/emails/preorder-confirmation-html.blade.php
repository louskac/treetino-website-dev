<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Potvrzení objednávky</title>
</head>
<body style="margin: 0; background-color: #f4f4f4; color: #1f2937; font-family: Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px;">
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 20px; font-size: 26px;">Děkujeme za vaši objednávku</h1>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                                Vaši objednávku jsme přijali. Její identifikátor je:
                            </p>
                            <p style="margin: 0; padding: 14px 18px; background-color: #f3f4f6; border-radius: 8px; font-family: monospace; font-size: 16px; word-break: break-all;">
                                {{ $uuid }}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
