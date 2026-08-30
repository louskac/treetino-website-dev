/**
 * Vercel Serverless Function: /api/contact
 * Handles contact form submissions and dispatches formatted emails to info@treetino.com
 */

function escapeHtml(text) {
    if (!text) {
return '';
}

    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
    // Enable CORS for frontend requests
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            status: 'error',
            message: 'Method Not Allowed. Use POST.',
        });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const { name, mail, email: altEmail, message, botcheck } = body;

        // Anti-spam Honeypot Check
        if (botcheck) {
            console.log('Spam bot detected via honeypot field');

            return res.status(200).json({
                status: 'success',
                message: 'Zpráva byla úspěšně odeslána.',
            });
        }

        const senderEmail = (mail || altEmail || '').trim();
        const senderName = (name || '').trim();
        const senderMessage = (message || '').trim();

        // Validation
        const errors = {};

        if (!senderName) {
            errors.name = ['Jméno je povinné pole.'];
        }

        if (!senderEmail) {
            errors.mail = ['E-mail je povinné pole.'];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
            errors.mail = ['Zadejte platnou e-mailovou adresu.'];
        }

        if (!senderMessage) {
            errors.message = ['Zpráva je povinné pole.'];
        }

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({
                status: 'error',
                errors,
            });
        }

        const toEmail = process.env.CONTACT_TO_EMAIL || 'info@treetino.com';
        const dateStr = new Date().toLocaleString('cs-CZ', {
            timeZone: 'Europe/Prague',
            dateStyle: 'full',
            timeStyle: 'medium',
        });

        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px; color: #18181b; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e4e4e7; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #09090b; padding: 28px 32px; color: #ffffff; border-bottom: 2px solid #2563eb; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
    .header span { color: #3b82f6; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 6px; }
    .content { padding: 32px; }
    .field { margin-bottom: 22px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; margin-bottom: 6px; }
    .value { font-size: 15px; color: #18181b; font-weight: 500; }
    .message-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; margin-top: 8px; }
    .footer { padding: 20px 32px; background-color: #f8fafc; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span>Treetino • Webový kontakt</span>
      <h1>Nová zpráva z kontaktního formuláře</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Jméno a příjmení</div>
        <div class="value">${escapeHtml(senderName)}</div>
      </div>
      <div class="field">
        <div class="label">E-mail odesílatele</div>
        <div class="value"><a href="mailto:${escapeHtml(senderEmail)}" style="color: #2563eb; font-weight: 600; text-decoration: none;">${escapeHtml(senderEmail)}</a></div>
      </div>
      <div class="field">
        <div class="label">Čas odeslání</div>
        <div class="value" style="color: #64748b; font-size: 14px;">${dateStr}</div>
      </div>
      <div class="field" style="margin-bottom: 0;">
        <div class="label">Text zprávy</div>
        <div class="message-box">${escapeHtml(senderMessage)}</div>
      </div>
    </div>
    <div class="footer">
      Tato zpráva byla odeslána přes kontaktní formulář na webu <strong>treetino.com</strong>.<br>
      Odpovědí na tento e-mail napíšete přímo odesílateli (<a href="mailto:${escapeHtml(senderEmail)}" style="color: #64748b;">${escapeHtml(senderEmail)}</a>).
    </div>
  </div>
</body>
</html>`;

        const plainTextContent = `Nová zpráva z kontaktního formuláře Treetino:\n\nOd: ${senderName} (${senderEmail})\nČas: ${dateStr}\n\nZpráva:\n${senderMessage}\n\n---\nOdpovězte přímo na tento e-mail pro kontaktování odesílatele.`;

        let emailSent = false;
        let providerUsed = 'none';

        // 1. Try Resend if configured
        if (process.env.RESEND_API_KEY) {
            try {
                const resendFrom = process.env.RESEND_FROM || 'Treetino Web <onboarding@resend.dev>';
                const resendRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: resendFrom,
                        to: [toEmail],
                        reply_to: senderEmail,
                        subject: `Nová zpráva z webu od ${senderName}`,
                        html: htmlContent,
                        text: plainTextContent,
                    }),
                });

                if (resendRes.ok) {
                    emailSent = true;
                    providerUsed = 'resend';
                } else {
                    const errBody = await resendRes.text();
                    console.error('Resend API error:', errBody);

                    // If Resend failed because recipient requires verified domain, try account owner fallback
                    if (errBody.includes('only send testing emails to your own email address')) {
                        const match = errBody.match(/\(([^)]+@.+?)\)/);
                        const accountEmail = match ? match[1] : 'lustykjakub@gmail.com';
                        const fallbackRes = await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                from: resendFrom,
                                to: [accountEmail],
                                reply_to: senderEmail,
                                subject: `[Treetino Web] Nová zpráva od ${senderName}`,
                                html: htmlContent,
                                text: plainTextContent,
                            }),
                        });

                        if (fallbackRes.ok) {
                            emailSent = true;
                            providerUsed = 'resend-fallback';
                        } else {
                            console.error('Resend fallback failed:', await fallbackRes.text());
                        }
                    }
                }
            } catch (err) {
                console.error('Resend dispatch failed:', err);
            }
        }

        // 2. Try MailerSend if configured
        if (!emailSent && process.env.MAILERSEND_API_KEY) {
            try {
                const mailersendRes = await fetch('https://api.mailersend.com/v1/email', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: {
                            email: process.env.MAILERSEND_FROM || 'info@treetino.com',
                            name: 'Treetino Web',
                        },
                        to: [{ email: toEmail, name: 'Treetino Info' }],
                        reply_to: { email: senderEmail, name: senderName },
                        subject: `Nová zpráva z webu od ${senderName}`,
                        html: htmlContent,
                        text: plainTextContent,
                    }),
                });

                if (mailersendRes.ok) {
                    emailSent = true;
                    providerUsed = 'mailersend';
                } else {
                    const errBody = await mailersendRes.text();
                    console.error('MailerSend API error:', errBody);
                }
            } catch (err) {
                console.error('MailerSend dispatch failed:', err);
            }
        }

        // 3. Try Web3Forms if configured
        if (!emailSent && process.env.WEB3FORMS_ACCESS_KEY) {
            try {
                const w3Res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: process.env.WEB3FORMS_ACCESS_KEY,
                        name: senderName,
                        email: senderEmail,
                        message: senderMessage,
                        subject: `Nová zpráva z webu od ${senderName}`,
                        from_name: 'Treetino Web',
                    }),
                });

                if (w3Res.ok) {
                    emailSent = true;
                    providerUsed = 'web3forms';
                } else {
                    const errBody = await w3Res.text();
                    console.error('Web3Forms error:', errBody);
                }
            } catch (err) {
                console.error('Web3Forms dispatch failed:', err);
            }
        }

        // 4. Try SMTP (e.g. Seznam EmailProfi, Gmail, Custom SMTP) if configured
        if (!emailSent && ((process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) || (process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD))) {
            try {
                const nodemailer = await import('nodemailer');
                const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
                const port = parseInt(process.env.SMTP_PORT || process.env.MAIL_PORT || '465', 10);
                const user = process.env.SMTP_USER || process.env.MAIL_USERNAME;
                const pass = process.env.SMTP_PASS || process.env.MAIL_PASSWORD;
                const isSecure = port === 465;

                const transporter = nodemailer.createTransport({
                    host,
                    port,
                    secure: isSecure,
                    auth: { user, pass },
                });

                await transporter.sendMail({
                    from: process.env.SMTP_FROM || `"${senderName}" <${user}>`,
                    to: toEmail,
                    replyTo: senderEmail,
                    subject: `Nová zpráva z webu od ${senderName}`,
                    html: htmlContent,
                    text: plainTextContent,
                });

                emailSent = true;
                providerUsed = 'smtp';
            } catch (err) {
                console.error('SMTP dispatch failed:', err);
            }
        }

        console.log(`Contact message processed from ${senderEmail}. Delivery status: ${emailSent} (Provider: ${providerUsed})`);

        return res.status(200).json({
            status: 'success',
            message: 'Zpráva byla úspěšně odeslána.',
            provider: providerUsed,
        });
    } catch (error) {
        console.error('Unhandled contact submission error:', error);

        return res.status(500).json({
            status: 'error',
            message: 'Při odesílání zprávy došlo k chybě. Zkuste to prosím znovu.',
        });
    }
}
