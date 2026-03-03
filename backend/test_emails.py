#!/usr/bin/env python3
"""
Envia os 3 tipos de email para pedropestana.fgv@gmail.com como teste visual.
Uso: cd backend && python test_emails.py
"""
import asyncio
import sys
import os
from datetime import datetime, timedelta

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
