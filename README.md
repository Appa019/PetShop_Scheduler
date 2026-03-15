# 8Patas — Plataforma Veterinaria com IA

Plataforma de gestao veterinaria com cadastro inteligente de pets, analise de raca por IA (visao computacional), cronograma preventivo personalizado e agendamento de consultas.

**Site:** https://projetointraempreendedorismo.vercel.app
**App:** https://projetointraempreendedorismo.vercel.app/app/login

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + Vite + React Router v7 + Framer Motion |
| Landing | React + Vite + Tailwind CSS + Framer Motion |
| Backend | Supabase Edge Functions (Deno/TypeScript) |
| Banco | Supabase PostgreSQL com RLS |
| Auth | Supabase Auth (email verification) |
| IA | OpenAI gpt-5.2 (Responses API — visao + texto) |
| Deploy | Vercel (monorepo landing + app) + Supabase |

## Funcionalidades

- **Cadastro de Pets com IA**: upload de foto, identificacao automatica de raca via visao computacional
- **Cuidados Personalizados**: script de cuidados gerado por IA baseado em raca, idade e porte
- **Perfil de Saude**: condicoes geneticas e doencas comuns da raca identificada
- **Cronograma Preventivo**: plano de 5 anos de consultas, vacinas e exames gerado por IA
- **Agendamento**: sistema completo com sugestoes inteligentes e calendario
- **Dashboard**: visao geral com calendario e proximas consultas
- **Apresentacao**: landing page com slides interativos do projeto

## Estrutura

```
├── frontend/          # App React (SPA em /app/)
│   ├── src/pages/     # Login, Dashboard, PetsList, Scheduling, Profile
│   ├── src/api/       # Axios com interceptor Supabase
│   └── src/lib/       # Supabase client, motion variants
├── landing/           # Landing page + apresentacao (raiz /)
│   └── src/presentation/  # 19 slides interativos
├── supabase/
│   ├── functions/     # Edge Functions (Deno/TS)
│   │   ├── pets/              # CRUD de pets
│   │   ├── appointments/      # CRUD de agendamentos
│   │   ├── ai-analyze/        # Analise de foto + raca + cuidados
│   │   ├── ai-breed-mix/      # Identificacao de mistura de racas (SRD)
│   │   ├── ai-suggest-appointments/  # Cronograma preventivo por IA
│   │   ├── send-reminders/    # Lembretes por email
│   │   └── _shared/          # CORS, auth, email, supabase client
│   └── migrations/    # SQL schema + triggers
├── scripts/           # Utilitarios (create-demo-user.js)
├── build.sh           # Build monorepo (landing + app)
└── vercel.json        # Config de deploy
```

## Desenvolvimento

```bash
# Frontend
cd frontend && pnpm install && pnpm dev

# Landing
cd landing && pnpm install && pnpm dev

# Deploy Edge Functions
npx supabase functions deploy <nome> --project-ref zsjirbjjlnixcjshrapi --no-verify-jwt

# Build completo
bash build.sh

# Deploy producao
vercel deploy --prod
```

## Variaveis de Ambiente

### Frontend (`frontend/.env`)
```
VITE_SUPABASE_URL=https://zsjirbjjlnixcjshrapi.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_API_URL=https://zsjirbjjlnixcjshrapi.supabase.co/functions/v1
```

### Supabase Edge Functions (Dashboard > Manage Secrets)
```
OPENAI_API_KEY=<openai-key>
SMTP_USER=<gmail>
SMTP_PASS=<app-password>
```

## Design System — Lavanda Editorial

- **Fontes**: Fraunces (display) + Outfit (body)
- **Cores**: warm cream (#FAF8F5), accent lavanda (#7B5EA7)
- **Principios**: sem gradientes, whitespace generoso, tipografia forte
- **Animacoes**: Framer Motion, transicoes clean

## Usuario Demo

```
Email: demo@8patas.com
Senha: demo123
```

## Autor

Pedro Pestana — Projeto de Intraempreendedorismo FGV
