# 🚀 Guia de Início Rápido - 8Patas

## 1️⃣ Pré-requisitos

- Python 3.8+ instalado
- Node.js 18+ e npm instalados
- Chave da API OpenAI ([obter aqui](https://platform.openai.com/api-keys))

## 2️⃣ Setup Automático (Linux/Mac)

```bash
# No diretório do projeto
./setup.sh
```

## 3️⃣ Configuração da API OpenAI

Edite o arquivo `.env` na pasta `backend`:

```bash
nano backend/.env
```

Adicione sua chave:
```env
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXX
SECRET_KEY=8patas_super_secret_key_change_in_production
```

## 4️⃣ Resetar Banco de Dados

**⚠️ Importante**: Como mudamos de email para username, é necessário resetar o banco:

```bash
cd backend
source .venv/bin/activate  # No Windows: .venv\Scripts\activate
python reset_database.py
```

Digite `yes` quando solicitado.

## 5️⃣ Criar Usuário Demo

```bash
python create_demo_user.py
```

Isso criará:
- **Username**: `demo`
- **Password**: `senha123`

## 6️⃣ Iniciar Backend

Em um terminal:

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```

Você verá:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## 7️⃣ Iniciar Frontend

Em OUTRO terminal:

```bash
cd frontend
npm run dev
```

Você verá:
```
VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## 8️⃣ Acessar o Sistema

Abra seu navegador em: **http://localhost:5173**

### Login
1. Username: `demo`
2. Password: `senha123`
3. Clique em "Entrar"

### Fluxo Completo
1. **Cadastrar Pet**
   - Clique no ícone "+" na aba "Pets"
   - Preencha nome, idade e informações
   - Faça upload de uma foto do pet
   - A IA irá identificar a raça automaticamente!

2. **Ver Sugestões Inteligentes**
   - Vá para "Agendar" (ícone de calendário)
   - Selecione o pet cadastrado
   - Veja as sugestões coloridas baseadas na raça
   - Clique em uma sugestão para aplicá-la automaticamente

3. **Agendar Consulta**
   - Data e tipo já preenchidos pela sugestão
   - Ajuste se necessário
   - Clique em "Agendar Consulta"

4. **Visualizar no Dashboard**
   - Veja suas consultas agendadas
   - Ícone de casa (início)

## 🎨 Recursos Visuais

- **Logo 8Patas**: Roxo vibrante com patinhas
- **Paleta**: Gradientes roxo (#8B5CF6) e rosa (#EC4899)
- **Animações**: Transições suaves em todos elementos
- **Design**: Clean, profissional e mobile-first

## 🤖 Funcionalidades IA

### Análise de Pet
Ao cadastrar um pet com foto, a IA:
- Identifica a raça
- Gera roteiro personalizado de cuidados
- Considera idade e características

### Sugestões de Agendamento
A IA sugere:
- Checkups baseados na raça
- Calendário de vacinas
- Grooming recomendado
- Cuidados preventivos

## 🐛 Solução de Problemas

### Backend não inicia
```bash
# Verifique se o venv está ativo
source .venv/bin/activate

# Reinstale dependências
pip install -r requirements.txt
```

### Frontend não inicia
```bash
# Reinstale node_modules
rm -rf node_modules
npm install
```

### Erro "OPENAI_API_KEY not found"
Verifique se o arquivo `.env` existe em `backend/` e contém a chave válida.

### Erro de banco de dados
```bash
cd backend
source .venv/bin/activate
python reset_database.py
python create_demo_user.py
```

## 📱 Testando a Aplicação

### 1. Criar Conta Nova
- Clique em "Cadastre-se"
- Username: `seunome`
- Nome: Seu Nome Completo
- Senha: (mínimo 6 caracteres)

### 2. Cadastrar Múltiplos Pets
Teste com diferentes raças:
- 🐕 Golden Retriever
- 🐈 Gato Persa
- 🐶 Poodle
- 🐕‍🦺 Pastor Alemão

### 3. Comparar Sugestões
Cada raça terá sugestões diferentes!

## 🌐 URLs Úteis

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎯 Próximo Passo: Deploy

Quando estiver pronto para produção, veja o arquivo `README.md` seção "Deploy na Oracle Cloud".

---

**Dúvidas?** Consulte o `README.md` ou `CHANGES.md`

🐾 **Aproveite o 8Patas!**
