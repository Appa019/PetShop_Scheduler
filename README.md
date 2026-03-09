# 🐾 8Patas Petshop - Sistema de Gestão Veterinária
**Link do Site: http://137.131.253.56/**

Sistema completo de gestão para petshops com funcionalidades de agendamento inteligente, cadastro de pets com análise de IA e sugestões personalizadas de cuidados.

## 🎨 Design

- Paleta de cores baseada no logo roxo (#8B5CF6)
- Interface clean e profissional
- Transições suaves e animações modernas
- Design responsivo (mobile-first)

## 🚀 Funcionalidades

- ✅ **Sistema de Login Simplificado**: Username e senha (sem necessidade de email)
- 🐕 **Cadastro de Pets com IA**: Upload de foto e análise automática da raça
- 📅 **Agendamento Inteligente**: Sugestões de consultas baseadas na raça e idade do pet
- 🎯 **Dashboard**: Visualização de próximos agendamentos
- 💜 **Design Profissional**: Paleta de cores consistente e transições suaves

## 🛠️ Tecnologias

### Backend
- FastAPI (Python)
- SQLite
- OpenAI API (GPT-4o Vision)
- JWT Authentication

### Frontend
- React 19
- Vite
- Axios
- Lucide React (ícones)
- React Router

## 📦 Instalação

### Início Rápido (Linux/Mac)

```bash
# Clone ou baixe o projeto
cd projeto_intraempreendedorismo

# Execute o script de setup
./setup.sh

# Configure suas chaves API
nano backend/.env

# Resetar banco de dados (necessário se já existir)
cd backend
source .venv/bin/activate
python reset_database.py
python create_demo_user.py
cd ..
```

### Instalação Manual

#### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # No Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Crie um arquivo `.env` na pasta `backend`:

```env
OPENAI_API_KEY=sua_chave_openai_aqui
SECRET_KEY=sua_chave_secreta_jwt
```

Resetar e criar banco de dados:

```bash
python reset_database.py  # Confirme com 'yes'
python create_demo_user.py
```

Execute o servidor:

```bash
uvicorn main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 👤 Usuário Demo

Após executar `create_demo_user.py`:

- **Username**: `demo`
- **Password**: `senha123`

## 🌐 Deploy na Oracle Cloud (Always Free)

### Pré-requisitos

1. Criar conta na Oracle Cloud (Always Free Tier)
2. Criar uma instância VM.Standard.E2.1.Micro (Always Free)
3. Configurar firewall para portas 80, 443, 8000

### Passo a Passo

#### 1. Conectar via SSH

```bash
ssh ubuntu@<seu-ip-publico>
```

#### 2. Instalar dependências

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python e Node.js
sudo apt install python3-pip python3-venv nginx -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

#### 3. Clonar/Copiar o projeto

```bash
cd /home/ubuntu
# Cole seus arquivos aqui
```

#### 4. Configurar Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Criar arquivo .env
nano .env
```

Criar serviço systemd:

```bash
sudo nano /etc/systemd/system/8patas-api.service
```

Conteúdo:

```ini
[Unit]
Description=8Patas FastAPI
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/backend
Environment="PATH=/home/ubuntu/backend/.venv/bin"
ExecStart=/home/ubuntu/backend/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Ativar serviço:

```bash
sudo systemctl enable 8patas-api
sudo systemctl start 8patas-api
```

#### 5. Configurar Frontend

```bash
cd frontend

# Atualizar a URL da API em todos os arquivos .jsx
# Mudar de http://localhost:8000 para http://seu-ip-publico:8000

npm install
npm run build
```

#### 6. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/8patas
```

Conteúdo:

```nginx
server {
    listen 80;
    server_name seu-ip-publico;

    # Frontend
    location / {
        root /home/ubuntu/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /auth/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /pets/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /appointments/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Ativar site:

```bash
sudo ln -s /etc/nginx/sites-available/8patas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Configurar Firewall Oracle

No console da Oracle Cloud:
1. Vá em Networking → Virtual Cloud Networks
2. Clique na sua VCN → Security Lists
3. Adicione regras de ingress para portas 80, 443, 8000

No servidor:

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8000
sudo ufw enable
```

## 📝 Usuários de Teste

Para criar usuários de teste, você pode usar a interface de Signup ou fazer requisições diretas:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "pedro",
    "name": "Pedro Pestana",
    "password": "senha123"
  }'
```

## 🎯 Fluxo de Uso

1. **Cadastro**: Criar conta com username e senha
2. **Login**: Entrar no sistema
3. **Cadastrar Pet**: Adicionar foto e informações do pet (IA analisa a raça)
4. **Agendar Consulta**: Sistema sugere datas baseadas na raça do pet
5. **Dashboard**: Visualizar agendamentos

## 🤖 Integração com OpenAI

A API da OpenAI é usada para:

1. **Análise de Imagem**: Identificar raça do pet pela foto
2. **Geração de Cuidados**: Criar roteiro personalizado de cuidados
3. **Sugestão de Consultas**: Recomendar tipos e intervalos de consultas baseados na raça

## 🎨 Paleta de Cores

- Primary: `#8B5CF6` (Roxo vibrante)
- Primary Light: `#A78BFA`
- Primary Dark: `#6D28D9`
- Secondary: `#EC4899` (Rosa)
- Background: `#FAFAFA`
- Surface: `#FFFFFF`

## 📄 Licença

Projeto desenvolvido para fins educacionais e demonstração.

## 👨‍💻 Autor

Pedro Pestana - Sistema de Intraempreendedorismo

---

**8Patas** - Cuidando do seu pet com tecnologia e carinho 🐾
