from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import base64
import json
import datetime
import re

import database, models, schemas, auth
from ai_service import analyze_pet_image, suggest_appointment_dates, identify_breed_mix

"""
Router de pets: cadastro com análise de IA, listagem, identificação de raça,
sugestões de agendamento e exclusão.
"""

router = APIRouter(
    prefix="/pets",
    tags=["Pets"]
)


@router.post("/", response_model=schemas.PetResponse)
async def create_pet(
    name: str = Form(...),
    age: str = Form(...),
    basic_info: str = Form(...),
    size: Optional[str] = Form(None),
    weight: Optional[str] = Form(None),
    photo: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Cadastra um pet: envia a foto para análise de IA (raça, cuidados, doenças)
    e armazena o resultado no banco. A foto é salva como base64 (adequado para protótipo).
    """
    contents = await photo.read()
    b64_img = base64.b64encode(contents).decode("utf-8")

    # Analisa a imagem com IA (porte/peso melhoram a identificação de raça)
    ai_result = await analyze_pet_image(
        b64_img, name, age, basic_info,
        pet_size=size or "",
        pet_weight=weight or "",
    )

    # Armazena a foto como data URL (base64) — adequado para protótipo
    photo_url_data = f"data:image/jpeg;base64,{b64_img}"

    # Serializa a lista de condições de saúde sugeridas como JSON
    suggested_symptoms_str = json.dumps(
        ai_result.get("suggested_symptoms", []), ensure_ascii=False
    )

    new_pet = models.Pet(
        name=name,
        age=age,
        basic_info=basic_info,
        size=size or "",
        weight=weight or "",
        photo_url=photo_url_data,
        ai_breed=ai_result.get("breed", "Unknown"),
        ai_care_script=ai_result.get("care_script", ""),
        ai_suggested_symptoms=suggested_symptoms_str,
        ai_breed_diseases=ai_result.get("breed_diseases", ""),
        owner_id=current_user.id,
    )

    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)
    return new_pet

@router.get("/", response_model=List[schemas.PetResponse])
def get_pets(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Retorna todos os pets do usuário autenticado."""
    return db.query(models.Pet).filter(models.Pet.owner_id == current_user.id).all()

@router.post("/{pet_id}/identify-breed-mix")
async def identify_pet_breed_mix(
    pet_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Re-analyzes the stored pet photo specifically to determine the SRD breed mix.
    Updates ai_breed in the database and returns the result.
    """
    pet = db.query(models.Pet).filter(
        models.Pet.id == pet_id,
        models.Pet.owner_id == current_user.id
    ).first()

    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    if not pet.photo_url or "," not in pet.photo_url:
        raise HTTPException(status_code=400, detail="No photo available for analysis")

    # Extract base64 from "data:image/jpeg;base64,{b64}"
    b64_img = pet.photo_url.split(",", 1)[1]

    mix_result = await identify_breed_mix(b64_img, pet.size or "", pet.weight or "")

    # Persist the updated breed
    pet.ai_breed = mix_result.get("breed", pet.ai_breed)
    db.commit()
    db.refresh(pet)

    return {"breed": pet.ai_breed}


@router.post("/{pet_id}/appointment-suggestions")
async def get_appointment_suggestions(
    pet_id: int,
    symptoms_input: schemas.SymptomsInput,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Get AI-powered appointment suggestions based on pet's breed, age, and symptoms.
    """
    pet = db.query(models.Pet).filter(
        models.Pet.id == pet_id,
        models.Pet.owner_id == current_user.id
    ).first()

    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    # Use breed_override if the user corrected the breed on the frontend
    breed_to_use = symptoms_input.breed_override or pet.ai_breed or "Unknown"

    # Use the AI service to generate suggestions
    suggestions = await suggest_appointment_dates(
        breed=breed_to_use,
        pet_age=pet.age,
        pet_name=pet.name,
        pet_symptoms=symptoms_input.symptoms,
        pet_size=pet.size or "",
        pet_weight=pet.weight or ""
    )

    # Autmatically add these to the user's agenda (appointments table)
    generated_appointments = suggestions.get("appointments", [])
    for appt in generated_appointments:
        interval_days = appt.get("interval_days", 30)
        appt_date = datetime.datetime.utcnow() + datetime.timedelta(days=interval_days)
        
        # Build a descriptive note
        priority = appt.get("priority", "medium").upper()
        reason = appt.get("reason", "Consulta/Exame de rotina recomendada pela IA.")
        appt_type = appt.get("type", "Consulta")
        notes = f"[{priority}] {appt_type} - {reason}"

        new_appt = models.Appointment(
            date_time=appt_date,
            notes=notes,
            user_id=current_user.id,
            pet_id=pet.id
        )
        db.add(new_appt)
    
    db.commit()

    return suggestions


@router.get("/{pet_id}/appointment-suggestions")
def get_pet_appointment_suggestions(
    pet_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Retorna os próximos agendamentos de um pet formatados como sugestões
    para exibição na página de Agendamento. Lê do banco de dados — sem
    chamar a IA novamente.

    O campo 'notes' dos agendamentos é parseado no formato
    '[PRIORITY] Tipo - Motivo' gerado pela IA durante o cadastro do pet.
    """
    pet = db.query(models.Pet).filter(
        models.Pet.id == pet_id,
        models.Pet.owner_id == current_user.id
    ).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    now = datetime.datetime.utcnow()
    upcoming = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.pet_id == pet_id,
            models.Appointment.user_id == current_user.id,
            models.Appointment.date_time > now,
        )
        .order_by(models.Appointment.date_time)
        .limit(10)
        .all()
    )

    appointments_out = []
    for appt in upcoming:
        interval_days = max(1, (appt.date_time - now).days)
        notes = appt.notes or ""
        # Tenta parsear o formato '[PRIORITY] Tipo - Motivo' gerado pela IA
        match = re.match(r'^\[(\w+)\]\s+(.+?)\s+-\s+(.+)$', notes)
        if match:
            priority = match.group(1).lower()
            appt_type = match.group(2)
            reason = match.group(3)
        else:
            priority = "medium"
            appt_type = notes or "Consulta"
            reason = ""

        appointments_out.append({
            "type": appt_type,
            "interval_days": interval_days,
            "priority": priority,
            "reason": reason,
        })

    return {
        "appointments": appointments_out,
        "next_recommended": appointments_out[0]["type"] if appointments_out else "",
    }


@router.delete("/{pet_id}", status_code=204)
def delete_pet(
    pet_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Delete a pet and all its associated appointments (cascade).
    """
    pet = db.query(models.Pet).filter(
        models.Pet.id == pet_id,
        models.Pet.owner_id == current_user.id
    ).first()

    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    db.delete(pet)
    db.commit()
    return None
