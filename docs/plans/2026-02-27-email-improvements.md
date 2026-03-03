# Email Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix logo embedding in all emails, polish aesthetics, add appointment reminder email, and APScheduler daily job.

**Architecture:** Rewrite `email_service.py` using `email.mime.*` classes for reliable RFC 2387 inline-image structure. Add `scheduler.py` with `AsyncIOScheduler` registered via FastAPI lifespan. Test with `test_emails.py` script.

**Tech Stack:** Python `email.mime`, `aiosmtplib`, `apscheduler==3.11.0`, FastAPI lifespan context manager.

---

### Task 1: Fix MIME structure + polish email_service.py

**Files:**
- Modify: `backend/email_service.py` (full rewrite)

**Step 1: Replace email_service.py with corrected MIME structure**

The current `get_payload()[1].add_related()` approach is fragile. Replace entire file with MIME classes for reliable inline logo across Gmail, Outlook, and mobile clients.

```python
"""
Serviço de e-mail assíncrono usando aiosmtplib e SMTP com STARTTLS.
Funções disponíveis:
  - send_verification_email: código de ativação de conta
  - send_password_reset_email: código de redefinição de senha
  - send_appointment_email: confirmação de agendamento veterinário
  - send_appointment_reminder_email: lembrete 1 dia antes da consulta

O logo da 8Patas é incorporado como imagem inline (CID).
Estrutura MIME: multipart/related > [multipart/alternative > text/plain + text/html] + image/png
"""
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import aiosmtplib
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

# Carrega o logo como bytes no startup (30 KB)
_LOGO_BYTES = b""
_logo_path = os.path.join(os.path.dirname(__file__), "logo.png")
if os.path.exists(_logo_path):
    with open(_logo_path, "rb") as f:
        _LOGO_BYTES = f.read()


def _logo_tag() -> str:
    if _LOGO_BYTES:
        return '<img src="cid:logo" alt="8Patas" style="max-height:80px;width:auto;display:block;margin:0 auto 12px;" />'
    return '<span style="font-size:36px;font-weight:800;color:#FFFFFF;letter-spacing:1px;font-family:\'Quicksand\',sans-serif;">🐾 8Patas</span>'


def _base_template(title: str, body_html: str, header_gradient: str = "linear-gradient(135deg,#7B5EA7 0%,#5A3E7A 100%)") -> str:
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background:#FDFCFF;font-family:'Inter','Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFCFF;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 16px 48px rgba(123,94,167,0.18);max-width:540px;border:1px solid #EDE8F5;">

          <!-- Header -->
          <tr>
            <td style="background:{header_gradient};padding:44px 40px 32px;text-align:center;">
              {_logo_tag()}
              <p style="margin:0;color:rgba(255,255,255,0.88);font-size:14px;letter-spacing:0.6px;font-weight:500;text-transform:uppercase;">A melhor clínica para seu pet</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="background:linear-gradient(90deg,#7B5EA7,#A68FCC,#5BBFB8,#7B5EA7);height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 44px 32px;">
              {body_html}
            </td>
          </tr>

          <!-- Footer -->
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
</html>"""


def _code_block(code: str) -> str:
    digits = "".join(
        f'<span style="display:inline-block;width:44px;height:56px;line-height:56px;text-align:center;'
        f'background:linear-gradient(145deg,#FAF8FC,#F3F0FF);border:2px solid #7B5EA7;border-radius:12px;'
        f'font-size:28px;font-weight:800;color:#5A3E7A;margin:0 4px;font-family:monospace;'
        f'box-shadow:0 2px 8px rgba(123,94,167,0.18);">{d}</span>'
        for d in code
    )
    return f'<div style="text-align:center;margin:28px 0;">{digits}</div>'


def _warning_banner(text: str) -> str:
    return f"""
    <div style="background:#FFFBEB;border-left:5px solid #F59E0B;border-radius:0 10px 10px 0;padding:14px 18px;margin:0 0 22px;">
      <p style="margin:0;font-size:13px;color:#92400E;line-height:1.6;">{text}</p>
    </div>"""


def _signature() -> str:
    return """
    <p style="margin:24px 0 0;color:#6B7280;font-size:14px;border-top:1px solid #F3F0FF;padding-top:18px;">
      Com carinho,<br/>
      <strong style="color:#7B5EA7;">Equipe 8Patas 🐾</strong>
    </p>"""


def _build_message(to_email: str, subject: str, plain: str, html: str) -> MIMEMultipart:
    """
    Monta mensagem MIME com estrutura correta para imagem inline (RFC 2387):
      multipart/related
        └── multipart/alternative
              ├── text/plain
              └── text/html
        └── image/png  (Content-ID: <logo>)
    """
    outer = MIMEMultipart("related")
    outer["From"] = f"8Patas Clínica Veterinária <{SMTP_USER}>"
    outer["To"] = to_email
    outer["Subject"] = subject

    alternative = MIMEMultipart("alternative")
    alternative.attach(MIMEText(plain, "plain", "utf-8"))
    alternative.attach(MIMEText(html, "html", "utf-8"))
    outer.attach(alternative)

    if _LOGO_BYTES:
        img = MIMEImage(_LOGO_BYTES, "png")
        img.add_header("Content-ID", "<logo>")
        img.add_header("Content-Disposition", "inline", filename="logo.png")
        outer.attach(img)

    return outer


async def _send(msg: MIMEMultipart) -> bool:
    try:
        await aiosmtplib.send(
            msg,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASS,
            start_tls=True,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


async def send_verification_email(to_email: str, name: str, code: str) -> bool:
    if not SMTP_USER or not SMTP_PASS:
        print("Warning: SMTP credentials not set, email not sent.")
        return False

    first_name = name.split()[0] if name else "usuário"
    body_html = f"""
      <h2 style="margin:0 0 12px;color:#2A2140;font-size:22px;font-family:'Quicksand',sans-serif;">Olá, {first_name}! 👋</h2>
      <p style="margin:0 0 16px;color:#7A7090;font-size:15px;line-height:1.65;">
        Bem-vindo(a) à <strong style="color:#7B5EA7;">8Patas</strong>! Para ativar sua conta e começar a cuidar do seu pet,
        utilize o código de verificação abaixo:
      </p>
      {_code_block(code)}
      {_warning_banner("⏱ <strong>Este código expira em 15 minutos.</strong><br/>Se você não criou uma conta na 8Patas, ignore este email.")}
      {_signature()}
    """
    html = _base_template("Verifique seu email — 8Patas", body_html)
    plain = f"Olá {first_name}! Seu código de verificação é: {code} (válido por 15 minutos)."
    msg = _build_message(to_email, "🐾 Ative sua conta 8Patas — Código de verificação", plain, html)
    return await _send(msg)


async def send_password_reset_email(to_email: str, name: str, code: str) -> bool:
    if not SMTP_USER or not SMTP_PASS:
        print("Warning: SMTP credentials not set, email not sent.")
        return False

    first_name = name.split()[0] if name else "usuário"
    body_html = f"""
      <h2 style="margin:0 0 12px;color:#2A2140;font-size:22px;font-family:'Quicksand',sans-serif;">Olá, {first_name}! 🔐</h2>
      <p style="margin:0 0 16px;color:#7A7090;font-size:15px;line-height:1.65;">
        Recebemos uma solicitação para redefinir a senha da sua conta <strong style="color:#7B5EA7;">8Patas</strong>.
        Use o código abaixo para criar uma nova senha:
      </p>
      {_code_block(code)}
      {_warning_banner("⏱ <strong>Este código expira em 15 minutos.</strong><br/>Se você não solicitou a redefinição de senha, ignore este email. Sua senha permanecerá a mesma.")}
      {_signature()}
    """
    html = _base_template("Redefinição de senha — 8Patas", body_html)
    plain = f"Olá {first_name}! Seu código para redefinir a senha é: {code} (válido por 15 minutos)."
    msg = _build_message(to_email, "🔐 Redefinição de senha — 8Patas", plain, html)
    return await _send(msg)


async def send_appointment_email(to_email: str, user_name: str, pet_name: str, date_time_str: str) -> bool:
    if not SMTP_USER or not SMTP_PASS:
        print("Warning: SMTP credentials not set, email not sent.")
        return False

    first_name = user_name.split()[0] if user_name else "usuário"
    body_html = f"""
      <h2 style="margin:0 0 8px;color:#2A2140;font-size:22px;font-family:'Quicksand',sans-serif;">Agendamento confirmado! ✅</h2>
      <p style="margin:0 0 22px;color:#7A7090;font-size:15px;line-height:1.65;">
        Olá, <strong>{first_name}</strong>! Seu agendamento foi confirmado com sucesso. Confira os detalhes abaixo:
      </p>

      <div style="background:linear-gradient(135deg,#F3F0FF,#EDE8F5);border-radius:16px;padding:22px 26px;margin:0 0 22px;border:1px solid #D8D0F0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #E5DFF5;">
              <span style="color:#7B5EA7;font-weight:700;font-size:15px;">🐶 Pet</span>
              <span style="color:#2A2140;margin-left:12px;font-size:15px;">{pet_name}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #E5DFF5;">
              <span style="color:#7B5EA7;font-weight:700;font-size:15px;">📅 Data e Hora</span>
              <span style="color:#2A2140;margin-left:12px;font-size:15px;">{date_time_str}</span>
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
        Obrigado por confiar no padrão 8Patas de cuidado! Aguardamos você e <strong>{pet_name}</strong>.
      </p>
      {_signature()}
    """
    html = _base_template(f"Agendamento confirmado — {pet_name}", body_html)
    plain = f"Olá {first_name}! Agendamento confirmado para {pet_name} em {date_time_str}. Local: Av. Marquês de São Vicente, 2219."
    msg = _build_message(to_email, f"🐾 Agendamento confirmado — {pet_name} · 8Patas", plain, html)
    return await _send(msg)


async def send_appointment_reminder_email(to_email: str, user_name: str, pet_name: str, date_time_str: str) -> bool:
    if not SMTP_USER or not SMTP_PASS:
        print("Warning: SMTP credentials not set, email not sent.")
        return False

    first_name = user_name.split()[0] if user_name else "usuário"
    body_html = f"""
      <h2 style="margin:0 0 8px;color:#2A2140;font-size:22px;font-family:'Quicksand',sans-serif;">Lembrete: consulta amanhã! 🔔</h2>
      <p style="margin:0 0 22px;color:#7A7090;font-size:15px;line-height:1.65;">
        Olá, <strong>{first_name}</strong>! Estamos lembrando que <strong>{pet_name}</strong> tem uma consulta marcada para <strong>amanhã</strong>. Não se esqueça!
      </p>

      <div style="background:linear-gradient(135deg,#EDFCFB,#D4F5F3);border-radius:16px;padding:22px 26px;margin:0 0 22px;border:1px solid #A8E6E2;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #C0E9E6;">
              <span style="color:#3A9E97;font-weight:700;font-size:15px;">🐶 Pet</span>
              <span style="color:#2A2140;margin-left:12px;font-size:15px;">{pet_name}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #C0E9E6;">
              <span style="color:#3A9E97;font-weight:700;font-size:15px;">📅 Data e Hora</span>
              <span style="color:#2A2140;margin-left:12px;font-size:15px;">{date_time_str}</span>
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

      {_signature()}
    """
    teal_gradient = "linear-gradient(135deg,#5BBFB8 0%,#3A9E97 100%)"
    html = _base_template(f"Lembrete de consulta — {pet_name}", body_html, header_gradient=teal_gradient)
    plain = f"Olá {first_name}! Lembrete: {pet_name} tem consulta amanhã em {date_time_str}. Local: Av. Marquês de São Vicente, 2219."
    msg = _build_message(to_email, f"🔔 Lembrete: consulta de {pet_name} amanhã · 8Patas", plain, html)
    return await _send(msg)
```

**Step 2: Verify the file saved correctly**

```bash
head -5 backend/email_service.py
# Expected: the docstring with the 4 function names listed
```

---

### Task 2: Install APScheduler

**Files:**
- Modify: `backend/requirements.txt`

**Step 1: Add apscheduler to requirements.txt**

Add this line after `annotated-types==0.7.0`:
```
apscheduler==3.11.0
```

**Step 2: Install on local machine**

```bash
cd backend
pip install apscheduler==3.11.0
# Expected: Successfully installed apscheduler-3.11.0
```

---

### Task 3: Create scheduler.py

**Files:**
- Create: `backend/scheduler.py`

**Step 1: Write scheduler.py**

```python
"""
Job diário para lembretes de consulta.
Roda todo dia às 08:00 e envia emails para consultas do dia seguinte.
"""
from datetime import datetime, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler(timezone="America/Sao_Paulo")


async def send_daily_reminders() -> None:
    """Busca consultas de amanhã e envia email de lembrete para cada uma."""
    from database import SessionLocal
    from models import Appointment, User, Pet
    from email_service import send_appointment_reminder_email

    db = SessionLocal()
    try:
        now = datetime.now()
        tomorrow_start = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow_end = tomorrow_start + timedelta(days=1, seconds=-1)

        appointments = (
            db.query(Appointment)
            .filter(Appointment.date_time >= tomorrow_start, Appointment.date_time <= tomorrow_end)
            .all()
        )

        print(f"[scheduler] {len(appointments)} consulta(s) amanhã — enviando lembretes...")

        for appt in appointments:
            user = db.query(User).filter(User.id == appt.user_id).first()
            pet = db.query(Pet).filter(Pet.id == appt.pet_id).first()
            if user and pet:
                formatted = appt.date_time.strftime("%d/%m/%Y às %H:%M")
                ok = await send_appointment_reminder_email(
                    to_email=user.email,
                    user_name=user.name,
                    pet_name=pet.name,
                    date_time_str=formatted,
                )
                status = "✅" if ok else "❌"
                print(f"  {status} Lembrete → {user.email} (pet: {pet.name})")
    finally:
        db.close()
```

---

### Task 4: Integrate scheduler in main.py

**Files:**
- Modify: `backend/main.py`

**Step 1: Replace main.py content**

```python
"""
Ponto de entrada da API 8Patas (FastAPI).
Configura CORS, cria as tabelas do banco e registra os routers.
APScheduler envia lembretes de consulta todo dia às 08:00.
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import models
from database import engine
from routers import auth, pets, appointments
from scheduler import scheduler, send_daily_reminders

load_dotenv()

models.Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: registra e inicia o scheduler
    scheduler.add_job(send_daily_reminders, "cron", hour=8, minute=0, id="daily_reminders", replace_existing=True)
    scheduler.start()
    print("[scheduler] APScheduler iniciado — lembretes às 08:00 diariamente.")
    yield
    # Shutdown
    scheduler.shutdown(wait=False)
    print("[scheduler] APScheduler encerrado.")


app = FastAPI(title="8Patas Veterinary API", lifespan=lifespan)

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to 8Patas API"}


app.include_router(auth.router)
app.include_router(pets.router)
app.include_router(appointments.router)
```

**Step 2: Verify server starts without errors**

```bash
cd backend
uvicorn main:app --reload --port 8001
# Expected output includes: [scheduler] APScheduler iniciado — lembretes às 08:00 diariamente.
# No ImportError or AttributeError
```

Stop server with Ctrl+C after verifying.

---

### Task 5: Create test script and send test emails

**Files:**
- Create: `backend/test_emails.py`

**Step 1: Write test_emails.py**

```python
#!/usr/bin/env python3
"""
Envia os 3 tipos de email para pedropestana.fgv@gmail.com como teste visual.
Uso: cd backend && python test_emails.py
"""
import asyncio
import sys
import os
from datetime import datetime, timedelta

# Garante que os imports do projeto funcionem
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from email_service import (
    send_verification_email,
    send_appointment_email,
    send_appointment_reminder_email,
    SMTP_USER,
)

TEST_EMAIL = "pedropestana.fgv@gmail.com"
TEST_NAME = "Pedro Pestana"
PET_NAME = "Rex"


async def main() -> None:
    if not SMTP_USER:
        print("❌ SMTP_USER não configurado no .env — configure antes de rodar.")
        return

    tomorrow = (datetime.now() + timedelta(days=1)).replace(hour=14, minute=0, second=0)
    formatted_dt = tomorrow.strftime("%d/%m/%Y às %H:%M")

    print(f"Enviando emails de teste para: {TEST_EMAIL}")
    print("─" * 50)

    print("1. Email de verificação de conta...", end=" ", flush=True)
    ok = await send_verification_email(TEST_EMAIL, TEST_NAME, "482951")
    print("✅ enviado!" if ok else "❌ falha")

    print("2. Email de confirmação de agendamento...", end=" ", flush=True)
    ok = await send_appointment_email(TEST_EMAIL, TEST_NAME, PET_NAME, formatted_dt)
    print("✅ enviado!" if ok else "❌ falha")

    print("3. Email de lembrete de consulta...", end=" ", flush=True)
    ok = await send_appointment_reminder_email(TEST_EMAIL, TEST_NAME, PET_NAME, formatted_dt)
    print("✅ enviado!" if ok else "❌ falha")

    print("─" * 50)
    print("Verifique a caixa de entrada de:", TEST_EMAIL)


if __name__ == "__main__":
    asyncio.run(main())
```

**Step 2: Run the test script**

```bash
cd backend
python test_emails.py
# Expected:
# Enviando emails de teste para: pedropestana.fgv@gmail.com
# ──────────────────────────────────────────────────────
# 1. Email de verificação de conta... ✅ enviado!
# 2. Email de confirmação de agendamento... ✅ enviado!
# 3. Email de lembrete de consulta... ✅ enviado!
# ──────────────────────────────────────────────────────
# Verifique a caixa de entrada de: pedropestana.fgv@gmail.com
```

If any email fails, the error message will be printed to stdout.

---

### Task 6: Deploy to production server

**Files:** (remote server at 137.131.253.56)
- Upload: `backend/email_service.py`
- Upload: `backend/scheduler.py`
- Upload: `backend/main.py`
- Upload: `backend/test_emails.py`
- Upload: `backend/requirements.txt`

**Step 1: Copy files to server**

```bash
SSH_KEY="/home/pedropestana/codigos_python/projeto_intraempreendedorismo/ssh-key-2026-02-22(1).key"
chmod 600 "$SSH_KEY"

scp -i "$SSH_KEY" \
  backend/email_service.py \
  backend/scheduler.py \
  backend/main.py \
  backend/test_emails.py \
  backend/requirements.txt \
  root@137.131.253.56:/var/www/8patas/backend/
```

**Step 2: Install apscheduler on server**

```bash
ssh -i "$SSH_KEY" root@137.131.253.56 \
  "cd /var/www/8patas/backend && pip install apscheduler==3.11.0"
# Expected: Successfully installed apscheduler-3.11.0
```

**Step 3: Restart backend service**

```bash
ssh -i "$SSH_KEY" root@137.131.253.56 \
  "systemctl restart 8patas-backend && sleep 2 && systemctl status 8patas-backend --no-pager | head -20"
# Expected: active (running)
# Expected log: [scheduler] APScheduler iniciado — lembretes às 08:00 diariamente.
```

**Step 4: Run test script on server to confirm SMTP works in production**

```bash
ssh -i "$SSH_KEY" root@137.131.253.56 \
  "cd /var/www/8patas/backend && python test_emails.py"
# Expected: all 3 ✅
```

---

## Verification Checklist

- [ ] `backend/email_service.py` uses `MIMEMultipart` — no `get_payload()` calls
- [ ] Logo appears in all 3 email types (verified visually in Gmail)
- [ ] Verification email: purple digit boxes with shadow
- [ ] Appointment email: lavender card with details
- [ ] Reminder email: teal header + teal card
- [ ] Server starts with scheduler log message
- [ ] APScheduler job registered as "daily_reminders" at 08:00 SP timezone
- [ ] Test emails received at pedropestana.fgv@gmail.com
