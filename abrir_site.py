#!/usr/bin/env python3
"""
🐾 8Patas Petshop - Script de Inicialização Automática
Inicia o backend (FastAPI) e frontend (React/Vite) automaticamente.
"""

import os
import sys
import time
import subprocess
import signal
import webbrowser
from pathlib import Path
import threading

# Cores para terminal
class Colors:
    PURPLE = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

# Caminhos do projeto
PROJECT_DIR = Path(__file__).parent.absolute()
BACKEND_DIR = PROJECT_DIR / "backend"
FRONTEND_DIR = PROJECT_DIR / "frontend"
VENV_PATH = BACKEND_DIR / ".venv"

# URLs
BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:5173"

# Processos globais
backend_process = None
frontend_process = None

def print_header():
    """Mostra cabeçalho bonito"""
    print(f"{Colors.PURPLE}{Colors.BOLD}")
    print("=" * 60)
    print("🐾  8PATAS PETSHOP - SISTEMA DE GESTÃO VETERINÁRIA")
    print("=" * 60)
    print(f"{Colors.ENDC}")

def print_status(message, status="info"):
    """Imprime mensagem colorida"""
    color_map = {
        "info": Colors.BLUE,
        "success": Colors.GREEN,
        "warning": Colors.YELLOW,
        "error": Colors.RED
    }
    color = color_map.get(status, Colors.BLUE)
    print(f"{color}➜ {message}{Colors.ENDC}")

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    print_status("Verificando dependências...", "info")

    # Verificar Python
    if sys.version_info < (3, 8):
        print_status("Python 3.8+ é necessário!", "error")
        return False

    # Verificar se backend existe
    if not BACKEND_DIR.exists():
        print_status(f"Diretório backend não encontrado em {BACKEND_DIR}", "error")
        return False

    # Verificar se frontend existe
    if not FRONTEND_DIR.exists():
        print_status(f"Diretório frontend não encontrado em {FRONTEND_DIR}", "error")
        return False

    # Verificar venv do backend
    if not VENV_PATH.exists():
        print_status("Ambiente virtual Python não encontrado!", "warning")
        print_status("Execute: cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt", "info")
        return False

    # Verificar node_modules
    if not (FRONTEND_DIR / "node_modules").exists():
        print_status("node_modules não encontrado!", "warning")
        print_status("Execute: cd frontend && npm install", "info")
        return False

    print_status("Todas as dependências verificadas ✓", "success")
    return True

def check_env_file():
    """Verifica se o arquivo .env existe"""
    env_file = BACKEND_DIR / ".env"
    if not env_file.exists():
        print_status("Arquivo .env não encontrado!", "warning")
        print_status("Copie .env.example para .env e configure suas chaves API", "info")
        return False
    return True

def start_backend():
    """Inicia o servidor backend FastAPI"""
    global backend_process

    print_status("Iniciando Backend (FastAPI)...", "info")

    # Caminho do uvicorn no venv
    if os.name == 'nt':  # Windows
        uvicorn_path = VENV_PATH / "Scripts" / "uvicorn.exe"
        python_path = VENV_PATH / "Scripts" / "python.exe"
    else:  # Linux/Mac
        uvicorn_path = VENV_PATH / "bin" / "uvicorn"
        python_path = VENV_PATH / "bin" / "python"

    try:
        # Iniciar uvicorn
        backend_process = subprocess.Popen(
            [str(python_path), "-m", "uvicorn", "main:app", "--reload"],
            cwd=str(BACKEND_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )

        # Aguardar inicialização
        print_status("Aguardando backend inicializar...", "info")
        time.sleep(3)

        if backend_process.poll() is None:
            print_status(f"Backend rodando em {BACKEND_URL} ✓", "success")
            return True
        else:
            print_status("Falha ao iniciar backend!", "error")
            return False

    except Exception as e:
        print_status(f"Erro ao iniciar backend: {e}", "error")
        return False

def start_frontend():
    """Inicia o servidor frontend Vite"""
    global frontend_process

    print_status("Iniciando Frontend (React + Vite)...", "info")

    try:
        # Iniciar npm run dev
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=str(FRONTEND_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )

        # Aguardar inicialização
        print_status("Aguardando frontend inicializar...", "info")
        time.sleep(5)

        if frontend_process.poll() is None:
            print_status(f"Frontend rodando em {FRONTEND_URL} ✓", "success")
            return True
        else:
            print_status("Falha ao iniciar frontend!", "error")
            return False

    except Exception as e:
        print_status(f"Erro ao iniciar frontend: {e}", "error")
        return False

def open_browser():
    """Abre o navegador automaticamente"""
    print_status("Abrindo navegador...", "info")
    time.sleep(2)
    try:
        webbrowser.open(FRONTEND_URL)
        print_status("Navegador aberto ✓", "success")
    except Exception as e:
        print_status(f"Não foi possível abrir o navegador: {e}", "warning")
        print_status(f"Abra manualmente: {FRONTEND_URL}", "info")

def monitor_processes():
    """Monitora os processos em execução"""
    print(f"\n{Colors.GREEN}{Colors.BOLD}")
    print("=" * 60)
    print("✅ SISTEMA 8PATAS RODANDO!")
    print("=" * 60)
    print(f"{Colors.ENDC}")
    print(f"{Colors.BLUE}Backend API:  {BACKEND_URL}{Colors.ENDC}")
    print(f"{Colors.BLUE}Frontend App: {FRONTEND_URL}{Colors.ENDC}")
    print(f"{Colors.BLUE}API Docs:     {BACKEND_URL}/docs{Colors.ENDC}")
    print(f"\n{Colors.YELLOW}Pressione CTRL+C para parar todos os serviços{Colors.ENDC}\n")

    try:
        while True:
            time.sleep(1)

            # Verificar se os processos ainda estão rodando
            if backend_process and backend_process.poll() is not None:
                print_status("Backend parou inesperadamente!", "error")
                break

            if frontend_process and frontend_process.poll() is not None:
                print_status("Frontend parou inesperadamente!", "error")
                break

    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Recebido sinal de interrupção...{Colors.ENDC}")

def stop_all_services():
    """Para todos os serviços"""
    global backend_process, frontend_process

    print_status("Parando serviços...", "warning")

    if backend_process:
        print_status("Parando backend...", "info")
        try:
            backend_process.terminate()
            backend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            backend_process.kill()
        print_status("Backend parado ✓", "success")

    if frontend_process:
        print_status("Parando frontend...", "info")
        try:
            frontend_process.terminate()
            frontend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            frontend_process.kill()
        print_status("Frontend parado ✓", "success")

    print(f"\n{Colors.PURPLE}{Colors.BOLD}🐾 Até logo! Obrigado por usar o 8Patas!{Colors.ENDC}\n")

def signal_handler(sig, frame):
    """Handler para sinais de interrupção"""
    stop_all_services()
    sys.exit(0)

def show_usage_tips():
    """Mostra dicas de uso"""
    print(f"\n{Colors.BOLD}📝 Dicas Rápidas:{Colors.ENDC}")
    print(f"{Colors.BLUE}  • Login:     Username: demo / Senha: senha123{Colors.ENDC}")
    print(f"{Colors.BLUE}  • Cadastre pets com fotos para análise IA da raça{Colors.ENDC}")
    print(f"{Colors.BLUE}  • Veja sugestões inteligentes ao agendar consultas{Colors.ENDC}")
    print()

def main():
    """Função principal"""
    # Configurar handler de sinais
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Mostrar header
    print_header()

    # Verificações
    if not check_dependencies():
        sys.exit(1)

    if not check_env_file():
        print_status("Configure o arquivo .env antes de continuar", "warning")
        response = input(f"{Colors.YELLOW}Continuar mesmo assim? (s/N): {Colors.ENDC}")
        if response.lower() not in ['s', 'sim', 'y', 'yes']:
            sys.exit(1)

    print()

    # Iniciar backend
    if not start_backend():
        print_status("Falha ao iniciar backend. Abortando...", "error")
        sys.exit(1)

    # Iniciar frontend
    if not start_frontend():
        print_status("Falha ao iniciar frontend. Parando backend...", "error")
        stop_all_services()
        sys.exit(1)

    # Mostrar dicas
    show_usage_tips()

    # Abrir navegador
    threading.Thread(target=open_browser, daemon=True).start()

    # Monitorar processos
    monitor_processes()

    # Parar tudo ao finalizar
    stop_all_services()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print_status(f"Erro inesperado: {e}", "error")
        stop_all_services()
        sys.exit(1)
