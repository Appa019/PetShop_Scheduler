from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

import database, models, schemas, auth
from email_service import send_appointment_email

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


@router.post("/", response_model=schemas.AppointmentResponse)
async def create_appointment(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Cria um novo agendamento para o usuário autenticado.
    Verifica se o pet pertence ao usuário e envia e-mail de confirmação.
    """
    # Garante que o pet existe e pertence ao usuário logado
    pet = db.query(models.Pet).filter(
        models.Pet.id == appointment.pet_id,
        models.Pet.owner_id == current_user.id
    ).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    new_app = models.Appointment(
        date_time=appointment.date_time,
        notes=appointment.notes,
        user_id=current_user.id,
        pet_id=appointment.pet_id
    )

    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    # Envia e-mail de confirmação de forma não-bloqueante
    try:
        formatted_dt = new_app.date_time.strftime("%d/%m/%Y às %H:%M")
        await send_appointment_email(
            to_email=current_user.email,
            user_name=current_user.name,
            pet_name=pet.name,
            date_time_str=formatted_dt,
        )
    except Exception as e:
        # Falha no e-mail não deve bloquear a criação do agendamento
        print(f"Warning: could not send appointment email: {e}")

    return new_app


@router.get("/", response_model=List[schemas.AppointmentWithPetResponse])
def get_appointments(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Retorna todos os agendamentos do usuário autenticado,
    incluindo nome e raça do pet em cada agendamento.
    """
    apps = (
        db.query(models.Appointment)
        .options(joinedload(models.Appointment.pet))
        .filter(models.Appointment.user_id == current_user.id)
        .all()
    )

    return [
        schemas.AppointmentWithPetResponse(
            id=app.id,
            date_time=app.date_time,
            notes=app.notes,
            pet_id=app.pet_id,
            user_id=app.user_id,
            pet_name=app.pet.name if app.pet else None,
            pet_breed=app.pet.ai_breed if app.pet else None,
        )
        for app in apps
    ]
