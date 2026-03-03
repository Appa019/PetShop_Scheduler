#!/usr/bin/env python3
"""
Script para criar um usuário de demonstração no banco de dados.
"""
import sys
from database import SessionLocal
from models import User
from auth import get_password_hash

def create_demo_user():
    db = SessionLocal()

    # Verificar se o usuário já existe
    existing_user = db.query(User).filter(User.email == "demo@8patas.com").first()

    if existing_user:
        print("✅ Usuário demo já existe!")
        print(f"   Email: demo@8patas.com")
        print(f"   Password: senha123")
        db.close()
        return

    # Criar novo usuário com senha válida
    password = "senha123"

    try:
        demo_user = User(
            email="demo@8patas.com",
            name="Usuário Demonstração",
            hashed_password=get_password_hash(password),
            is_verified=True,  # Necessário para o usuário conseguir fazer login
        )

        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        print("✅ Usuário de demonstração criado com sucesso!")
        print(f"   Email: demo@8patas.com")
        print(f"   Password: senha123")

    except Exception as e:
        print(f"❌ Erro ao criar usuário: {e}")
        print("\n💡 Tente criar o usuário manualmente via API /auth/register")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_user()
