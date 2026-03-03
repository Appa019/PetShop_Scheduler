"""
Job diário para lembretes de consulta.
Roda todo dia às 08:00 (horário de Brasília) e envia emails para consultas do dia seguinte.
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
