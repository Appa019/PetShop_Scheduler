# Email Improvements Design — 8Patas

**Date:** 2026-02-27
**Scope:** Email aesthetics, logo fix, appointment reminder, APScheduler

---

## Goals

1. Fix MIME structure so logo appears reliably in all email clients
2. Polish `send_appointment_email` to match the visual quality of code emails
3. Add `send_appointment_reminder_email()` with distinct teal header
4. APScheduler job that runs daily at 08:00 and sends reminders for next-day appointments
5. Test script that sends all email types to pedropestana.fgv@gmail.com

---

## MIME Structure Fix

Current code uses `get_payload()[1].add_related()` which is fragile.

Correct RFC 2387 structure for inline images:
```
multipart/related
├── multipart/alternative
│   ├── text/plain
│   └── text/html  (src="cid:logo")
└── image/png  (Content-ID: <logo>)
```

Implementation: use `email.mime.*` classes instead of `EmailMessage` high-level API.

---

## Email Visual Design

### Code emails (verification + password reset)
- Digit boxes: add `box-shadow: 0 2px 8px rgba(123,94,167,0.20)` and subtle gradient
- Warning banner: thicker amber border (4px → 5px), slightly larger text
- No structural changes — already high quality

### Confirmation email (`send_appointment_email`)
- Header: same lavender gradient as other emails (`#7B5EA7 → #5A3E7A`)
- Details card: `background:#F3F0FF`, `border-radius:16px`, icon + label + value rows
- Add visual CTA button "Ver Agendamentos" (non-functional, decorative link)
- Consistent footer and signature

### Reminder email (`send_appointment_reminder_email`)
- Header: teal gradient `#5BBFB8 → #3A9E97` — visually distinct from confirmation
- Title: "Lembrete: consulta amanhã! 🔔"
- Same details card as confirmation
- Banner: "Não esqueça de trazer a carteirinha de vacinação 🐾"
- Signature consistent with other emails

---

## APScheduler

File: `backend/scheduler.py`

```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()

async def send_daily_reminders():
    # Query appointments where date_time is between tomorrow 00:00 and 23:59
    # For each → send_appointment_reminder_email()
```

Registered in `main.py`:
```python
@app.on_event("startup")
async def startup():
    scheduler.start()

@app.on_event("shutdown")
async def shutdown():
    scheduler.shutdown()
```

---

## Test Script

File: `backend/test_emails.py`

Sends to `pedropestana.fgv@gmail.com`:
1. Verification email (code: 123456)
2. Appointment confirmation (pet: Rex, data: tomorrow 14:00)
3. Appointment reminder (pet: Rex, data: tomorrow 14:00)

---

## Files Modified

| File | Change |
|------|--------|
| `backend/email_service.py` | Fix MIME structure, polish aesthetics, add reminder function |
| `backend/scheduler.py` | New — APScheduler daily job |
| `backend/main.py` | Register scheduler on startup/shutdown |
| `backend/test_emails.py` | New — test script |
