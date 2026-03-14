import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
const SMTP_USER = Deno.env.get("SMTP_USER") || "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") || "";

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP credentials not set, email not sent.");
    return false;
  }

  try {
    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: false,
        auth: { username: SMTP_USER, password: SMTP_PASS },
      },
    });

    await client.send({
      from: `8Patas Clínica Veterinária <${SMTP_USER}>`,
      to,
      subject,
      content: text,
      html,
    });

    await client.close();
    return true;
  } catch (e) {
    console.error("Error sending email:", e);
    return false;
  }
}

// Shared HTML template structure
function baseTemplate(
  title: string,
  bodyHtml: string,
  headerGradient = "linear-gradient(135deg,#7B5EA7 0%,#5A3E7A 100%)"
): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#FDFCFF;font-family:'Inter','Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFCFF;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 16px 48px rgba(123,94,167,0.18);max-width:540px;border:1px solid #EDE8F5;">
          <tr>
            <td style="background:${headerGradient};padding:44px 40px 32px;text-align:center;">
              <span style="font-size:36px;font-weight:800;color:#FFFFFF;letter-spacing:1px;font-family:'Quicksand',sans-serif;">🐾 8Patas</span>
              <p style="margin:0;color:rgba(255,255,255,0.88);font-size:14px;letter-spacing:0.6px;font-weight:500;text-transform:uppercase;">A melhor clínica para seu pet</p>
            </td>
          </tr>
          <tr>
            <td style="background:linear-gradient(90deg,#7B5EA7,#A68FCC,#5BBFB8,#7B5EA7);height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:40px 44px 32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background:#FAF8FC;padding:22px 40px;text-align:center;border-top:1px solid #EDE8F5;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.7;">
                Este email foi enviado automaticamente pela <strong>8Patas Clínica Veterinária</strong>.<br/>
                Por favor, não responda este email.
              </p>
              <p style="margin:10px 0 0;font-size:11px;color:#A68FCC;">© 2026 8Patas · Todos os direitos reservados</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const signature = `
<p style="margin:24px 0 0;color:#6B7280;font-size:14px;border-top:1px solid #F3F0FF;padding-top:18px;">
  Com carinho,<br/>
  <strong style="color:#7B5EA7;">Equipe 8Patas 🐾</strong>
</p>`;

export async function sendAppointmentEmail(
  toEmail: string,
  userName: string,
  petName: string,
  dateTimeStr: string
): Promise<boolean> {
  const firstName = userName.split(" ")[0] || "usuário";
  const bodyHtml = `
    <h2 style="margin:0 0 8px;color:#2A2140;font-size:22px;font-family:'Quicksand',sans-serif;">Agendamento confirmado! ✅</h2>
    <p style="margin:0 0 22px;color:#7A7090;font-size:15px;line-height:1.65;">
      Olá, <strong>${firstName}</strong>! Seu agendamento foi confirmado com sucesso. Confira os detalhes abaixo:
    </p>
    <div style="background:linear-gradient(135deg,#F3F0FF,#EDE8F5);border-radius:16px;padding:22px 26px;margin:0 0 22px;border:1px solid #D8D0F0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E5DFF5;">
            <span style="color:#7B5EA7;font-weight:700;font-size:15px;">🐶 Pet</span>
            <span style="color:#2A2140;margin-left:12px;font-size:15px;">${petName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E5DFF5;">
            <span style="color:#7B5EA7;font-weight:700;font-size:15px;">📅 Data e Hora</span>
            <span style="color:#2A2140;margin-left:12px;font-size:15px;">${dateTimeStr}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <span style="color:#7B5EA7;font-weight:700;font-size:15px;">📍 Local</span>
            <span style="color:#2A2140;margin-left:12px;font-size:15px;">Av. Marquês de São Vicente, 2219</span>
          </td>
        </tr>
      </table>
    </div>
    <p style="margin:0 0 6px;color:#7A7090;font-size:14px;line-height:1.65;">
      Obrigado por confiar no padrão 8Patas de cuidado! Aguardamos você e <strong>${petName}</strong>.
    </p>
    ${signature}`;

  const html = baseTemplate(`Agendamento confirmado — ${petName}`, bodyHtml);
  const plain = `Olá ${firstName}! Agendamento confirmado para ${petName} em ${dateTimeStr}. Local: Av. Marquês de São Vicente, 2219.`;
  return sendEmail(
    toEmail,
    `🐾 Agendamento confirmado — ${petName} · 8Patas`,
    html,
    plain
  );
}

export async function sendReminderEmail(
  toEmail: string,
  userName: string,
  petName: string,
  dateTimeStr: string
): Promise<boolean> {
  const firstName = userName.split(" ")[0] || "usuário";
  const bodyHtml = `
    <h2 style="margin:0 0 8px;color:#2A2140;font-size:22px;font-family:'Quicksand',sans-serif;">Lembrete: consulta amanhã! 🔔</h2>
    <p style="margin:0 0 22px;color:#7A7090;font-size:15px;line-height:1.65;">
      Olá, <strong>${firstName}</strong>! Estamos lembrando que <strong>${petName}</strong> tem uma consulta marcada para <strong>amanhã</strong>. Não se esqueça!
    </p>
    <div style="background:linear-gradient(135deg,#EDFCFB,#D4F5F3);border-radius:16px;padding:22px 26px;margin:0 0 22px;border:1px solid #A8E6E2;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #C0E9E6;">
            <span style="color:#3A9E97;font-weight:700;font-size:15px;">🐶 Pet</span>
            <span style="color:#2A2140;margin-left:12px;font-size:15px;">${petName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #C0E9E6;">
            <span style="color:#3A9E97;font-weight:700;font-size:15px;">📅 Data e Hora</span>
            <span style="color:#2A2140;margin-left:12px;font-size:15px;">${dateTimeStr}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <span style="color:#3A9E97;font-weight:700;font-size:15px;">📍 Local</span>
            <span style="color:#2A2140;margin-left:12px;font-size:15px;">Av. Marquês de São Vicente, 2219</span>
          </td>
        </tr>
      </table>
    </div>
    <div style="background:#FFFBEB;border-left:5px solid #5BBFB8;border-radius:0 10px 10px 0;padding:14px 18px;margin:0 0 22px;">
      <p style="margin:0;font-size:13px;color:#065F46;line-height:1.6;">
        🐾 <strong>Não esqueça de trazer a carteirinha de vacinação do seu pet!</strong>
      </p>
    </div>
    ${signature}`;

  const tealGradient = "linear-gradient(135deg,#5BBFB8 0%,#3A9E97 100%)";
  const html = baseTemplate(
    `Lembrete de consulta — ${petName}`,
    bodyHtml,
    tealGradient
  );
  const plain = `Olá ${firstName}! Lembrete: ${petName} tem consulta amanhã em ${dateTimeStr}. Local: Av. Marquês de São Vicente, 2219.`;
  return sendEmail(
    toEmail,
    `🔔 Lembrete: consulta de ${petName} amanhã · 8Patas`,
    html,
    plain
  );
}
