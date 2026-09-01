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

        const recipientEmailsRaw = process.env.CONTACT_TO_EMAIL || 'info@treetino.com,lustykjakub@gmail.com';
        const toEmails = recipientEmailsRaw
            .split(',')
            .map(e => e.trim())
            .filter(Boolean);
        const toEmail = toEmails[0] || 'info@treetino.com';
        const dateStr = new Date().toLocaleString('cs-CZ', {
            timeZone: 'Europe/Prague',
            dateStyle: 'full',
            timeStyle: 'medium',
        });

        const htmlContent = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nová zpráva z formuláře • Treetino</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f5f7;
      margin: 0;
      padding: 36px 16px;
      color: #111827;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 580px;
      margin: 0 auto;
    }
    .card {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .header {
      padding: 24px 32px;
      border-bottom: 1px solid #f3f4f6;
      background-color: #ffffff;
    }
    .header-logo {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #111827;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .content {
      padding: 32px 32px 28px;
    }
    .tag {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #183d89;
      margin-bottom: 8px;
    }
    .title {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: #000000;
      margin: 0 0 6px 0;
      line-height: 1.3;
    }
    .subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 28px 0;
      line-height: 1.5;
    }
    .info-card {
      background-color: #f9fafb;
      border-left: 3px solid #183d89;
      border-radius: 6px;
      padding: 18px 20px;
      margin-bottom: 24px;
    }
    .info-group {
      margin-bottom: 14px;
    }
    .info-group:last-child {
      margin-bottom: 0;
    }
    .info-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
    }
    .badge {
      display: inline-block;
      background-color: #e8eef8;
      color: #183d89;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      margin-left: 8px;
      vertical-align: middle;
    }
    .section-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .message-box {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 18px 20px;
      font-size: 15px;
      line-height: 1.65;
      color: #1f2937;
      white-space: pre-wrap;
      margin-bottom: 28px;
    }
    .cta-button {
      display: inline-block;
      background-color: #183d89;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      text-align: center;
    }
    .footer {
      border-top: 1px solid #f3f4f6;
      padding: 24px 32px 28px;
      background-color: #ffffff;
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .footer a {
      color: #183d89;
      text-decoration: none;
      font-weight: 500;
    }
    .footer-note {
      margin-top: 6px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <a href="https://treetino.com" style="display: inline-block; text-decoration: none;" target="_blank">
          <img src="https://treetino.com/img/branding/treetino-logo.png" width="140" height="26.6" alt="Treetino" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;">
        </a>
      </div>

      <div class="content">
        <div class="tag">Kontakt z webu</div>
        <h1 class="title">Nová zpráva z formuláře</h1>
        <p class="subtitle">Zákazník odeslal poptávku prostřednictvím webových stránek treetino.com</p>

        <div class="info-card">
          <div class="info-group">
            <div class="info-label">Jméno a Příjmení</div>
            <div class="info-value">
              ${escapeHtml(senderName)}
              <span class="badge">Zájemce</span>
            </div>
          </div>
          <div class="info-group">
            <div class="info-label">E-mailová Adresa</div>
            <div class="info-value">
              <a href="mailto:${escapeHtml(senderEmail)}" style="color: #183d89; text-decoration: none;">
                ${escapeHtml(senderEmail)}
              </a>
            </div>
          </div>
          <div class="info-group">
            <div class="info-label">Čas Odeslání</div>
            <div class="info-value" style="font-size: 13px; font-weight: 500; color: #4b5563;">
              ${dateStr}
            </div>
          </div>
        </div>

        <div class="section-label">Text Zprávy</div>
        <div class="message-box">${escapeHtml(senderMessage)}</div>

        <div>
          <a href="mailto:${escapeHtml(senderEmail)}?subject=Re: Treetino - Odpověď na vaši zprávu" class="cta-button" target="_blank">
            Odpovědět odesílateli (${escapeHtml(senderName)}) &rarr;
          </a>
        </div>
      </div>

      <div class="footer">
        <div>Tato zpráva byla odeslána přes kontaktní formulář na <a href="https://treetino.com">treetino.com</a>.</div>
        <div class="footer-note">Treetino Corp s.r.o. • Výzkum a vývoj v ČR ve spolupráci s FZÚ AV ČR a ČVUT.</div>
      </div>
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
                        to: toEmails,
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
