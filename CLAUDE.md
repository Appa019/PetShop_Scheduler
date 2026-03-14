# 8Patas — Clinica Veterinaria com IA

## Stack
- Frontend: React 19 + Vite + React Router v7 + Axios + Framer Motion + @supabase/supabase-js
- Backend: Supabase Edge Functions (Deno/TypeScript)
- DB: Supabase PostgreSQL com RLS
- Auth: Supabase Auth (email verification built-in)
- AI: OpenAI gpt-5.2 (Responses API via fetch)
- Email: Gmail SMTP via denomailer (Deno)
- Deploy: Vercel (monorepo landing+app) + Supabase

## Comandos
- Frontend dev: `cd frontend && pnpm dev`
- Frontend build: `cd frontend && pnpm build`
- Frontend lint: `cd frontend && pnpm lint`
- Full build (landing+app): `bash build.sh`
- Deploy functions: `npx supabase functions deploy <name> --project-ref zsjirbjjlnixcjshrapi --no-verify-jwt`
- Deploy Vercel: `vercel deploy --prod`

## Design System — Lavanda Editorial
- Fontes: Fraunces (display/headings) + Outfit (body) via Google Fonts
- Cores: warm cream background (#FAF8F5), accent lavanda (#7B5EA7), sem gradientes (exceto banners funcionais)
- CSS variables definidas em `frontend/src/index.css` (prefixo `--color-*`, `--font-*`, `--radius-*`, `--shadow-*`)
- Motion variants compartilhadas em `frontend/src/lib/motion.js` (pageVariants, listContainer, listItem)
- SEM glass-morphism, backdrop-blur, ou border-radius pill (exceto avatares)
- Classe `glass-card` mantida no nome mas restyled (solid surface, sem blur)

## Estrutura
- `supabase/functions/` — Edge Functions (Deno/TS)
- `supabase/functions/_shared/` — Utilitarios (cors, auth, email, supabase client)
- `supabase/migrations/` — SQL migrations
- `frontend/src/pages/` — Paginas React (JSX)
- `frontend/src/lib/supabase.js` — Supabase client
- `frontend/src/lib/motion.js` — Framer Motion shared variants
- `frontend/src/api/axios.js` — Axios com interceptor Supabase session
- `landing/` — Landing page (React+Vite+Tailwind)
- `backend/` — FastAPI LEGADO (NAO MODIFICAR)
- `infra/` — Oracle Cloud LEGADO (NAO MODIFICAR)

## Regras
- NAO modificar `backend/` ou `infra/` — codigo legado apenas para referencia
- Edge Functions: imports via URL (https://esm.sh/, https://deno.land/x/)
- Toda operacao de banco DEVE usar Supabase client autenticado (respeita RLS)
- Fotos de pets sao base64 data URLs (prototipo)
- A anon key e PUBLICA — RLS protege os dados
- Nunca hardcodar secrets
- Supabase project ref: zsjirbjjlnixcjshrapi
- CSS variables: usar tokens `--color-*` (nunca `--primary-*` ou `--bg-color`)
- Animacoes: importar variants de `frontend/src/lib/motion.js`, usar `<motion.div>`
