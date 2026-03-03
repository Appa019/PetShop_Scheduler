#!/bin/bash

echo "🐾 Iniciando setup do 8Patas Petshop..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backend
echo -e "${BLUE}📦 Configurando Backend...${NC}"
cd backend

if [ ! -d ".venv" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv .venv
fi

echo "Ativando ambiente virtual..."
source .venv/bin/activate

echo "Instalando dependências..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
    echo -e "${GREEN}⚠️  IMPORTANTE: Configure suas chaves API no arquivo backend/.env${NC}"
fi

cd ..

# Frontend
echo -e "${BLUE}🎨 Configurando Frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do frontend..."
    npm install
fi

cd ..

echo -e "${GREEN}✅ Setup completo!${NC}"
echo ""
echo "Para iniciar o projeto:"
echo "  1. Configure as chaves API em backend/.env"
echo "  2. Terminal 1 - Backend:"
echo "     cd backend && source .venv/bin/activate && uvicorn main:app --reload"
echo "  3. Terminal 2 - Frontend:"
echo "     cd frontend && npm run dev"
echo ""
echo "🐾 8Patas estará rodando em http://localhost:5173"
