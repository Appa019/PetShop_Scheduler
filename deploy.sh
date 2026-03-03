#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# deploy.sh — Deploy 8Patas na Oracle Cloud VM (Ubuntu 22.04)
#
# Compatível com:
#   - VM.Standard.A1.Flex (Ampere, 1 OCPU 6 GB) — recomendado
#   - VM.Standard.E2.1.Micro (AMD, 1 OCPU 1 GB) — adiciona swap automático
#
# Execute na VM depois de copiar o projeto:
#   bash deploy.sh
# ═══════════════════════════════════════════════════════════════════════════════
set -e

DEPLOY_DIR="/var/www/8patas"
BACKEND_DIR="$DEPLOY_DIR/backend"
FRONTEND_DIST="$DEPLOY_DIR/frontend/dist"
PROJECT_SRC="$(cd "$(dirname "$0")" && pwd)"

echo "╔══════════════════════════════════════╗"
echo "║   Deploy 8Patas — Oracle Cloud VM    ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── 0. Swap (protege VMs com pouca RAM no build do React) ────────────────────
TOTAL_RAM_MB=$(free -m | awk '/^Mem:/{print $2}')
if [ "$TOTAL_RAM_MB" -lt 2048 ] && [ ! -f /swapfile ]; then
    echo "▶ [0/8] RAM < 2 GB detectada — criando swap de 2 GB..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab > /dev/null
    echo "   Swap ativado: $(free -h | awk '/^Swap/{print $2}')"
fi

# ── 1. Atualizar sistema ─────────────────────────────────────────────────────
echo "▶ [1/8] Atualizando pacotes do sistema..."
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq

# ── 2. Instalar dependências ─────────────────────────────────────────────────
echo "▶ [2/8] Instalando Python, Nginx, rsync..."
sudo apt-get install -y -qq python3 python3-pip python3-venv nginx curl rsync

echo "   Python: $(python3 --version)"

# Node.js só é necessário se não houver dist/ pré-compilado
FRONTEND_SRC_CHECK="$PROJECT_SRC/frontend"
if [ ! -d "$FRONTEND_SRC_CHECK/dist" ] || [ -z "$(ls -A "$FRONTEND_SRC_CHECK/dist" 2>/dev/null)" ]; then
    if ! command -v node &> /dev/null; then
        echo "   Instalando Node.js 20 (sem dist pré-compilado)..."
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
        echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list > /dev/null
        sudo apt-get update -qq
        sudo apt-get install -y -qq nodejs
        echo "   Node: $(node --version)"
    fi
else
    echo "   dist/ pré-compilado encontrado — Node.js não necessário na VM."
fi

# ── 3. Preparar diretórios ───────────────────────────────────────────────────
echo "▶ [3/8] Preparando diretório $DEPLOY_DIR..."
sudo mkdir -p "$BACKEND_DIR" "$FRONTEND_DIST"
sudo chown -R ubuntu:ubuntu "$DEPLOY_DIR"

echo "   Copiando backend..."
rsync -a --delete "$PROJECT_SRC/backend/" "$BACKEND_DIR/" --exclude='.venv' --exclude='__pycache__' --exclude='*.db' --exclude='.env'

# Copiar .env se existir no projeto (não sobrescreve se já existir na VM)
if [ -f "$PROJECT_SRC/backend/.env" ] && [ ! -f "$BACKEND_DIR/.env" ]; then
    cp "$PROJECT_SRC/backend/.env" "$BACKEND_DIR/.env"
fi

# ── 4. Configurar backend ────────────────────────────────────────────────────
echo "▶ [4/8] Configurando backend (Python venv + dependências)..."
cd "$BACKEND_DIR"
python3 -m venv .venv
.venv/bin/pip install --upgrade pip -q
.venv/bin/pip install -r requirements.txt -q
echo "   Dependências instaladas."

# Verificar .env
if [ ! -f "$BACKEND_DIR/.env" ]; then
    VM_IP=$(curl -s ifconfig.me 2>/dev/null || echo 'SEU_IP_AQUI')
    NEW_SECRET=$(python3 -c 'import secrets; print(secrets.token_hex(32))')
    echo ""
    echo "   ⚠️  Arquivo .env não encontrado! Criando com valores padrão."
    echo "   EDITE $BACKEND_DIR/.env com seus dados reais antes de usar!"
    cat > "$BACKEND_DIR/.env" <<ENVEOF
SECRET_KEY=${NEW_SECRET}
OPENAI_API_KEY=
SMTP_USER=
SMTP_PASS=
ALLOWED_ORIGINS=http://${VM_IP}
ENVEOF
    echo "   .env criado. Edite com: nano $BACKEND_DIR/.env"
fi

# Criar/atualizar banco de dados
echo "   Inicializando banco de dados..."
cd "$BACKEND_DIR"
.venv/bin/python - <<PYEOF
import sys
sys.path.insert(0, '.')
import models
from database import engine, Base
Base.metadata.create_all(bind=engine)
print("   Banco de dados OK.")
PYEOF

# ── 5. Build do frontend ─────────────────────────────────────────────────────
echo "▶ [5/8] Fazendo build do frontend React..."
FRONTEND_SRC="$PROJECT_SRC/frontend"

# Verificar se já existe dist no projeto local (build feito antes do scp)
if [ -d "$FRONTEND_SRC/dist" ] && [ "$(ls -A "$FRONTEND_SRC/dist")" ]; then
    echo "   Usando dist/ pré-compilado encontrado no projeto..."
    rsync -a "$FRONTEND_SRC/dist/" "$FRONTEND_DIST/"
else
    echo "   Compilando na VM (pode demorar ~2 min com pouca RAM)..."
    rsync -a --delete "$FRONTEND_SRC/" "$DEPLOY_DIR/frontend/" --exclude='node_modules' --exclude='dist'
    cd "$DEPLOY_DIR/frontend"
    echo "VITE_API_URL=/api" > .env.production
    npm install --silent
    npm run build --silent
    rsync -a "dist/" "$FRONTEND_DIST/"
fi
echo "   Frontend pronto em: $FRONTEND_DIST"

# ── 6. Configurar Nginx ──────────────────────────────────────────────────────
echo "▶ [6/8] Configurando Nginx..."

# Gerar nginx.conf apontando para o dist correto
sudo tee /etc/nginx/sites-available/8patas > /dev/null <<NGINXEOF
server {
    listen 80;
    server_name _;

    root ${FRONTEND_DIST};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass         http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
    }

    access_log  /var/log/nginx/8patas_access.log;
    error_log   /var/log/nginx/8patas_error.log;
    add_header  X-Content-Type-Options nosniff;
    add_header  X-Frame-Options SAMEORIGIN;
    server_tokens off;
    client_max_body_size 15M;
}
NGINXEOF

sudo ln -sf /etc/nginx/sites-available/8patas /etc/nginx/sites-enabled/8patas
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
echo "   Nginx configurado."

# ── 7. Serviço systemd ───────────────────────────────────────────────────────
echo "▶ [7/8] Configurando serviço systemd do backend..."

sudo tee /etc/systemd/system/8patas-backend.service > /dev/null <<SVCEOF
[Unit]
Description=8Patas FastAPI Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=${BACKEND_DIR}
Environment="PATH=${BACKEND_DIR}/.venv/bin"
EnvironmentFile=${BACKEND_DIR}/.env
ExecStart=${BACKEND_DIR}/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 1
Restart=always
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
SVCEOF

sudo systemctl daemon-reload
sudo systemctl enable 8patas-backend
sudo systemctl restart 8patas-backend
sleep 3

if sudo systemctl is-active --quiet 8patas-backend; then
    echo "   Backend rodando."
else
    echo "   ⚠️  Backend com problema. Verifique:"
    sudo journalctl -u 8patas-backend -n 20 --no-pager
fi

# ── 8. Firewall da VM (iptables) ─────────────────────────────────────────────
echo "▶ [8/8] Liberando portas no firewall interno da VM..."
sudo iptables -C INPUT -m state --state NEW -p tcp --dport 80 -j ACCEPT 2>/dev/null || \
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -C INPUT -m state --state NEW -p tcp --dport 443 -j ACCEPT 2>/dev/null || \
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo apt-get install -y -qq iptables-persistent netfilter-persistent 2>/dev/null || true
sudo netfilter-persistent save 2>/dev/null || true

# ── Resultado ────────────────────────────────────────────────────────────────
VM_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Deploy concluído!                                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "  🌐 Acesse: http://$VM_IP"
echo ""
echo "  📋 Comandos úteis:"
echo "  sudo systemctl status 8patas-backend        # Status"
echo "  journalctl -u 8patas-backend -f             # Logs tempo real"
echo "  sudo tail -f /var/log/nginx/8patas_error.log # Logs Nginx"
echo "  nano $BACKEND_DIR/.env                      # Editar variáveis"
echo ""
echo "  ⚠️  Lembre de abrir a porta 80 no Console Oracle Cloud:"
echo "     Networking → VCN → Security Lists → Add Ingress Rule (TCP 80)"
