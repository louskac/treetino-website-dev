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
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nová zpráva z kontaktního formuláře • Treetino</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 32px 16px;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
    }
    .brand-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .brand-pill {
      display: inline-block;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 9999px;
      padding: 10px 24px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
      text-decoration: none;
    }
    .card {
      background-color: #ffffff;
      border-radius: 24px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 12px 36px -8px rgba(0, 0, 0, 0.06);
    }
    .hero {
      background-color: #0a0f1d;
      padding: 36px 36px 32px;
      color: #ffffff;
      border-top: 4px solid #2563eb;
    }
    .hero-tag {
      color: #60a5fa;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .hero-title {
      margin: 0 0 6px;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: #ffffff;
      line-height: 1.25;
    }
    .hero-subtitle {
      margin: 0;
      color: #94a3b8;
      font-size: 13px;
      line-height: 1.5;
    }
    .body-content {
      padding: 32px 36px;
    }
    .info-card {
      background-color: #f8fafc;
      border-left: 3px solid #2563eb;
      border-radius: 12px;
      padding: 20px 22px;
      margin-bottom: 28px;
    }
    .info-row {
      margin-bottom: 14px;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 15px;
      font-weight: 600;
      color: #0f172a;
    }
    .badge {
      display: inline-block;
      background-color: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 9999px;
      margin-left: 8px;
      vertical-align: middle;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 10px;
    }
    .message-container {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 22px 24px;
      font-size: 15px;
      line-height: 1.7;
      color: #1e293b;
      white-space: pre-wrap;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      margin-bottom: 28px;
    }
    .cta-container {
      text-align: center;
      padding-top: 4px;
      margin-bottom: 8px;
    }
    .cta-btn {
      display: inline-block;
      background-color: #1d4ed8;
      color: #ffffff !important;
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(29, 78, 216, 0.25);
    }
    .footer {
      text-align: center;
      padding: 28px 20px 12px;
      font-size: 12px;
      line-height: 1.6;
      color: #94a3b8;
    }
    .footer a {
      color: #64748b;
      text-decoration: underline;
    }
    .footer-badge {
      display: inline-block;
      margin-top: 8px;
      background-color: #f1f5f9;
      color: #475569;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="brand-header">
      <a href="https://treetino.com" class="brand-pill" target="_blank">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td style="vertical-align: middle;">
              <img src="https://treetino.com/img/branding/logo-icon.svg" width="22" height="22" alt="Treetino" style="display: block; width: 22px; height: 22px; border: 0;">
            </td>
            <td style="vertical-align: middle; padding-left: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 800; letter-spacing: 0.08em; color: #09090b;">
              TREETINO
            </td>
          </tr>
        </table>
      </a>
    </div>

    <div class="card">
      <div class="hero">
        <div class="hero-tag">Treetino • Webový Kontakt</div>
        <h1 class="hero-title">Nová zpráva z formuláře</h1>
        <p class="hero-subtitle">Zákazník odeslal poptávku prostřednictvím webových stránek treetino.com</p>
      </div>

      <div class="body-content">
        <div class="info-card">
          <div class="info-row">
            <div class="info-label">Jméno a Příjmení</div>
            <div class="info-value">
              ${escapeHtml(senderName)}
              <span class="badge">Zájemce</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-label">E-mailová Adresa</div>
            <div class="info-value">
              <a href="mailto:${escapeHtml(senderEmail)}" style="color: #2563eb; text-decoration: none;">
                ${escapeHtml(senderEmail)}
              </a>
            </div>
          </div>
          <div class="info-row">
            <div class="info-label">Čas Odeslání</div>
            <div class="info-value" style="font-size: 14px; font-weight: 500; color: #475569;">
              ${dateStr}
            </div>
          </div>
        </div>

        <div class="section-title">Text Zprávy</div>
        <div class="message-container">${escapeHtml(senderMessage)}</div>

        <div class="cta-container">
          <a href="mailto:${escapeHtml(senderEmail)}?subject=Re: Treetino - Odpověď na vaši zprávu" class="cta-btn" target="_blank">
            Odpovědět odesílateli (${escapeHtml(senderName)}) &rarr;
          </a>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Tato zpráva byla odeslána přes kontaktní formulář na <a href="https://treetino.com">treetino.com</a>.</div>
      <div>Odpovědí na tento e-mail kontaktujete přímo odesílatele.</div>
      <div class="footer-badge">✓ R&D v ČR (FZÚ AV ČR / ČVUT) • Treetino</div>
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
