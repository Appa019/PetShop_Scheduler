"""
Router de autenticação: registro, login, verificação de e-mail e reset de senha.
Todos os endpoints de verificação usam códigos de 6 dígitos com validade de 15 min.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import database, models, schemas, auth
from email_service import send_verification_email, send_password_reset_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

CODE_EXPIRY_MINUTES = 15


def _get_valid_code(db: Session, email: str, code: str, code_type: str) -> models.VerificationCode:
    """
    Busca e valida um código de verificação no banco.
    Lança HTTP 400 se o código for inválido, já usado ou expirado.
    """
    record = db.query(models.VerificationCode).filter(
        models.VerificationCode.email == email,
        models.VerificationCode.code == code,
        models.VerificationCode.code_type == code_type,
        models.VerificationCode.used == False,
    ).first()

    if not record:
        raise HTTPException(status_code=400, detail="Código inválido ou já utilizado.")

    if datetime.utcnow() > record.expires_at:
        raise HTTPException(status_code=400, detail="Código expirado. Solicite um novo código.")

    return record


@router.post("/register", status_code=201)
async def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    """
    Registra um novo usuário (não verificado) e envia e-mail com código de ativação.
    O usuário só pode fazer login após verificar o e-mail.
    """
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado.")

    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        is_verified=False,
    )
    db.add(new_user)
    db.commit()

    # Invalida códigos antigos deste email
    db.query(models.VerificationCode).filter(
        models.VerificationCode.email == user.email,
        models.VerificationCode.code_type == "verify_email",
    ).delete()
    db.commit()

    code = auth.generate_verification_code()
    verification = models.VerificationCode(
        email=user.email,
        code=code,
        code_type="verify_email",
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(minutes=CODE_EXPIRY_MINUTES),
        used=False,
    )
    db.add(verification)
    db.commit()

    await send_verification_email(user.email, user.name, code)

    return {"message": "Cadastro realizado! Verifique seu email para ativar sua conta.", "email": user.email}


@router.post("/login", response_model=schemas.Token)
def login(request: schemas.LoginRequest, db: Session = Depends(database.get_db)):
    """
    Autentica o usuário e retorna um JWT.
    Retorna HTTP 401 se credenciais erradas (mensagem genérica para evitar enumeração).
    Retorna HTTP 403 se o e-mail ainda não foi verificado.
    """
    user = db.query(models.User).filter(models.User.email == request.email).first()

    # Mensagem genérica para não revelar se o email existe
    if not user or not auth.verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos.",
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email não verificado. Verifique sua caixa de entrada.",
        )

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/verify-email", response_model=schemas.Token)
def verify_email(request: schemas.VerifyEmailRequest, db: Session = Depends(database.get_db)):
    """
    Verifica o código de 6 dígitos e ativa a conta do usuário.
    Retorna um JWT para login automático após verificação.
    """
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    record = _get_valid_code(db, request.email, request.code, "verify_email")

    record.used = True
    user.is_verified = True
    db.commit()

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/resend-verification", status_code=200)
async def resend_verification(request: schemas.ResendVerificationRequest, db: Session = Depends(database.get_db)):
    """
    Reenvia o código de verificação de e-mail.
    Resposta genérica para não revelar se o e-mail está cadastrado.
    Invalida códigos anteriores antes de criar um novo.
    """
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or user.is_verified:
        # Resposta genérica para não revelar informações
        return {"message": "Se o email estiver cadastrado e não verificado, um novo código será enviado."}

    # Invalida códigos anteriores
    db.query(models.VerificationCode).filter(
        models.VerificationCode.email == request.email,
        models.VerificationCode.code_type == "verify_email",
    ).delete()
    db.commit()

    code = auth.generate_verification_code()
    verification = models.VerificationCode(
        email=request.email,
        code=code,
        code_type="verify_email",
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(minutes=CODE_EXPIRY_MINUTES),
        used=False,
    )
    db.add(verification)
    db.commit()

    await send_verification_email(request.email, user.name, code)
    return {"message": "Se o email estiver cadastrado e não verificado, um novo código será enviado."}


@router.post("/forgot-password", status_code=200)
async def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(database.get_db)):
    """
    Inicia o fluxo de redefinição de senha enviando um código por e-mail.
    Resposta genérica para não revelar se o e-mail está cadastrado.
    """
    user = db.query(models.User).filter(models.User.email == request.email).first()

    # Resposta genérica para não revelar se email existe
    if not user:
        return {"message": "Se o email estiver cadastrado, você receberá um código de redefinição."}

    # Invalida códigos anteriores de reset
    db.query(models.VerificationCode).filter(
        models.VerificationCode.email == request.email,
        models.VerificationCode.code_type == "password_reset",
    ).delete()
    db.commit()

    code = auth.generate_verification_code()
    reset_record = models.VerificationCode(
        email=request.email,
        code=code,
        code_type="password_reset",
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(minutes=CODE_EXPIRY_MINUTES),
        used=False,
    )
    db.add(reset_record)
    db.commit()

    await send_password_reset_email(request.email, user.name, code)
    return {"message": "Se o email estiver cadastrado, você receberá um código de redefinição."}


@router.post("/reset-password", status_code=200)
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(database.get_db)):
    """
    Redefine a senha usando o código enviado por e-mail.
    Valida tamanho mínimo da nova senha (6 caracteres) antes de prosseguir.
    """
    if len(request.new_password) < 6:
        raise HTTPException(status_code=400, detail="A nova senha deve ter no mínimo 6 caracteres.")

    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    record = _get_valid_code(db, request.email, request.code, "password_reset")

    record.used = True
    user.hashed_password = auth.get_password_hash(request.new_password)
    db.commit()

    return {"message": "Senha redefinida com sucesso. Faça login com sua nova senha."}


@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
