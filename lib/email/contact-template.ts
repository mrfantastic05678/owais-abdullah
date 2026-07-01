interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  ip: string;
  receivedAt: string;
}

export function contactEmailHtml(data: ContactEmailData): string {
  const { name, email, subject, message, ip, receivedAt } = data;
  const escaped = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1f2e 0%,#212428 100%);border-radius:12px 12px 0 0;padding:32px 40px;border-bottom:1px solid #2a2f3a;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:2px;color:#3a69ff;text-transform:uppercase;">Portfolio Contact</p>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">New Message Received</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1a1f2e;padding:32px 40px;">

              <!-- Sender info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="padding-right:8px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:1px;color:#6b7280;text-transform:uppercase;">From</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#f9fafb;">${escaped(name)}</p>
                  </td>
                  <td width="50%" style="padding-left:8px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:1px;color:#6b7280;text-transform:uppercase;">Email</p>
                    <a href="mailto:${escaped(email)}" style="margin:0;font-size:15px;font-weight:600;color:#3a69ff;text-decoration:none;">${escaped(email)}</a>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <div style="background:#212428;border-radius:8px;padding:16px 20px;margin-bottom:20px;border-left:3px solid #3a69ff;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:1px;color:#6b7280;text-transform:uppercase;">Subject</p>
                <p style="margin:0;font-size:16px;font-weight:600;color:#f9fafb;">${escaped(subject)}</p>
              </div>

              <!-- Message -->
              <div style="background:#212428;border-radius:8px;padding:20px;margin-bottom:28px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:1px;color:#6b7280;text-transform:uppercase;">Message</p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#d1d5db;white-space:pre-wrap;">${escaped(message)}</p>
              </div>

              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${escaped(email)}?subject=Re: ${escaped(subject)}"
                       style="display:inline-block;background:linear-gradient(135deg,#2563eb,#3a69ff);color:#ffffff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">
                      Reply to ${escaped(name)} →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#141820;border-radius:0 0 12px 12px;padding:20px 40px;border-top:1px solid #2a2f3a;">
              <p style="margin:0;font-size:11px;color:#4b5563;text-align:center;">
                Received ${escaped(receivedAt)} · IP ${escaped(ip)} · owaisabdullah.dev
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function contactEmailText(data: ContactEmailData): string {
  return `New contact message from ${data.name} (${data.email})

Subject: ${data.subject}

${data.message}

---
Received: ${data.receivedAt}
IP: ${data.ip}`;
}
