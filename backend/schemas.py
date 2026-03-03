from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_verified: bool

    class Config:
        from_attributes = True

# --- Auth Request Schemas ---
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str

# --- Pet Schemas ---
class SymptomsInput(BaseModel):
    symptoms: List[str]
    breed_override: Optional[str] = None

class PetBase(BaseModel):
    name: str
    age: str
    basic_info: str
    size: Optional[str] = None
    weight: Optional[str] = None

class PetCreate(PetBase):
    pass

class PetResponse(PetBase):
    id: int
    owner_id: int
    photo_url: Optional[str] = None
    size: Optional[str] = None
    weight: Optional[str] = None
    ai_breed: Optional[str] = None
    ai_care_script: Optional[str] = None
    ai_suggested_symptoms: Optional[str] = None
    ai_breed_diseases: Optional[str] = None

    class Config:
        from_attributes = True

# --- Appointment Schemas ---
class AppointmentCreate(BaseModel):
    date_time: datetime
    notes: Optional[str] = None
    pet_id: int

class AppointmentResponse(AppointmentCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class AppointmentWithPetResponse(AppointmentResponse):
    pet_name: Optional[str] = None
    pet_breed: Optional[str] = None
