# 🚀 Como Usar o 8Patas

## Método 1: Script Automático (Recomendado) ⭐

### Opção A: Executar diretamente
```bash
python3 abrir_site.py
```

### Opção B: Como executável
```bash
./abrir_site.py
```

### O que o script faz automaticamente:

1. ✅ Verifica todas as dependências
2. ✅ Inicia o backend (FastAPI)
3. ✅ Inicia o frontend (React/Vite)
4. ✅ Abre o navegador automaticamente
5. ✅ Mostra logs em tempo real
6. ✅ Para tudo com **CTRL+C**

## Método 2: Manual (Avançado)

### Terminal 1 - Backend
```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3 - Abrir navegador
```
http://localhost:5173
```

## 🎯 Acesso Rápido

Após iniciar:

- **🌐 Site**: http://localhost:5173
- **⚙️ API**: http://127.0.0.1:8000
- **📚 Docs**: http://127.0.0.1:8000/docs

## 👤 Login

- **Username**: `demo`
- **Password**: `senha123`

## 🛑 Parar o Sistema

No script automático:
```
CTRL + C
```

Isso para **TUDO** automaticamente (backend + frontend).

## 🐛 Problemas Comuns

### "Dependências não encontradas"
```bash
# Instalar backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Instalar frontend
cd ../frontend
npm install
```

### "Arquivo .env não encontrado"
```bash
cd backend
cp .env.example .env
nano .env
# Configure OPENAI_API_KEY
```

### "Porta já em uso"
```bash
# Verificar processos usando as portas
lsof -i :8000  # Backend
lsof -i :5173  # Frontend

# Matar processos se necessário
kill -9 <PID>
```

## 📝 Fluxo Completo de Uso

1. **Iniciar Sistema**
   ```bash
   python3 abrir_site.py
   ```

2. **Fazer Login**
   - Username: `demo`
   - Password: `senha123`

3. **Cadastrar Pet**
   - Clique em "+" na aba Pets
   - Upload de foto (IA analisa raça)
   - Preencha informações

4. **Agendar Consulta**
   - Vá para "Agendar"
   - Veja sugestões inteligentes
   - Click para aplicar sugestão
   - Confirme agendamento

5. **Ver Dashboard**
   - Consultas agendadas
   - Próximos compromissos

## 🎨 Recursos do Sistema

- ✨ **IA para Raça**: Identifica automaticamente
- 📅 **Sugestões Smart**: Baseadas em raça e idade
- 💜 **Design Clean**: Paleta roxo do logo
- 🎭 **Animações**: Transições suaves
- 📱 **Responsivo**: Mobile-first

## 🆘 Suporte

Problemas? Consulte:
- `README.md` - Documentação completa
- `QUICKSTART.md` - Início rápido
- `CHANGES.md` - Mudanças recentes

---

**8Patas** - Cuidando do seu pet com tecnologia! 🐾
