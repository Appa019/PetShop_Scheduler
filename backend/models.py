"""
Modelos SQLAlchemy que mapeiam as tabelas do banco de dados SQLite.
"""
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime


class User(Base):
    """Usuário da plataforma. Um usuário pode ter vários pets e agendamentos."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    is_verified = Column(Boolean, default=False)  # Deve ser True para fazer login

    pets = relationship("Pet", back_populates="owner")
    appointments = relationship("Appointment", back_populates="user")


class VerificationCode(Base):
    """
    Código de 6 dígitos usado para verificação de e-mail e reset de senha.
    code_type: 'verify_email' | 'password_reset'
    """
    __tablename__ = "verification_codes"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    code = Column(String)
    code_type = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime)
    used = Column(Boolean, default=False)


class Pet(Base):
    """
    Pet cadastrado por um usuário.
    Campos 'ai_*' são preenchidos pela análise de IA durante o cadastro.
    ai_suggested_symptoms armazena JSON: [{"name": str, "description": str}]
    """
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(String)
    basic_info = Column(String)
    size = Column(String, nullable=True)    # Miniatura | Pequeno | Médio | Grande | Gigante
    weight = Column(String, nullable=True)  # Peso aproximado (ex: "12kg")
    photo_url = Column(String)              # base64 da foto (data:image/jpeg;base64,...)
    ai_breed = Column(String)
    ai_care_script = Column(String)
    ai_suggested_symptoms = Column(String)  # JSON array de condições de saúde
    ai_breed_diseases = Column(Text, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="pets")
    appointments = relationship("Appointment", back_populates="pet", cascade="all, delete-orphan")


class Appointment(Base):
    """
    Agendamento veterinário vinculado a um usuário e a um pet.
    O campo 'notes' gerado pela IA segue o formato '[PRIORITY] Tipo - Motivo'.
    """
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    date_time = Column(DateTime)
    notes = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    pet_id = Column(Integer, ForeignKey("pets.id"))

    user = relationship("User", back_populates="appointments")
    pet = relationship("Pet", back_populates="appointments")
