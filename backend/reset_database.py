#!/usr/bin/env python3
"""
Script para resetar o banco de dados (USE COM CUIDADO!)
Isso irá DELETAR todos os dados existentes.
"""
import os
import sys
from database import engine, Base
import models

def reset_database():
    response = input("⚠️  ATENÇÃO: Isso irá deletar TODOS os dados! Confirma? (yes/no): ")
    
    if response.lower() != 'yes':
        print("Operação cancelada.")
        sys.exit(0)
    
    # Remover banco de dados existente
    db_path = "8patas.db"
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"✅ Banco de dados {db_path} removido.")
    
    # Recriar todas as tabelas
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados recriado com sucesso!")
    print("\n📝 Agora você pode executar: python create_demo_user.py")

if __name__ == "__main__":
    try:
        reset_database()
    except Exception as e:
        print(f"❌ Erro ao resetar banco: {e}")
        sys.exit(1)
