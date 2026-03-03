# Frontend Polish + OpenAI json_schema Fix

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the 8Patas frontend look professional and clean, and fix OpenAI API to use json_schema instead of json_object.

**Architecture:** Refinamento polido — mantém paleta lavanda/teal, extrai inline styles para CSS, adiciona design tokens, polisha todas as páginas incluindo Login/Signup. Backend: troca json_object por json_schema nas 3 funções do ai_service.py.

**Tech Stack:** React 19, Vite, CSS custom properties, FastAPI, openai==2.21.0 (Responses API)

---

## Task 1: Fix OpenAI json_schema in ai_service.py

**Files:**
- Modify: `backend/ai_service.py`

**Context:** A doc openai.md (linha 2387) diz explicitamente que `json_object` não é recomendado para modelos gpt-5.2+. Usar `json_schema` garante outputs tipados e confiáveis.

**Step 1: Replace json_object with json_schema in analyze_pet_image (line ~130)**

```python
# Replace:
text={"format": {"type": "json_object"}}

# With (in analyze_pet_image):
text={"format": {
    "type": "json_schema",
    "name": "pet_analysis",
    "schema": {
        "type": "object",
        "properties": {
            "breed": {"type": "string"},
            "care_script": {"type": "string"},
            "suggested_symptoms": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "description": {"type": "string"}
                    },
                    "required": ["name", "description"],
                    "additionalProperties": False
                }
            },
            "breed_diseases": {"type": "string"}
        },
        "required": ["breed", "care_script", "suggested_symptoms", "breed_diseases"],
        "additionalProperties": False
    },
    "strict": True
}}
```

**Step 2: Replace json_object with json_schema in identify_breed_mix (line ~206)**

```python
# Replace:
text={"format": {"type": "json_object"}}

# With (in identify_breed_mix):
text={"format": {
    "type": "json_schema",
    "name": "breed_mix",
    "schema": {
        "type": "object",
        "properties": {
            "breed": {"type": "string"},
            "evidence": {"type": "string"}
        },
        "required": ["breed", "evidence"],
        "additionalProperties": False
    },
    "strict": True
}}
```

**Step 3: Replace json_object with json_schema in suggest_appointment_dates (line ~319)**

```python
# Replace:
text={"format": {"type": "json_object"}}

# With (in suggest_appointment_dates):
text={"format": {
    "type": "json_schema",
    "name": "appointment_schedule",
    "schema": {
        "type": "object",
        "properties": {
            "appointments": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "type": {"type": "string"},
                        "interval_days": {"type": "integer"},
                        "priority": {"type": "string", "enum": ["high", "medium", "low"]},
                        "reason": {"type": "string"}
                    },
                    "required": ["type", "interval_days", "priority", "reason"],
                    "additionalProperties": False
                }
            },
            "next_recommended": {"type": "string"}
        },
        "required": ["appointments", "next_recommended"],
        "additionalProperties": False
    },
    "strict": True
}}
```

**Step 4: Verify syntax**
```bash
cd backend && python -c "import ai_service; print('OK')"
```
Expected: `OK` (no syntax errors)

---

## Task 2: Design System — index.css tokens + component refinements

**Files:**
- Modify: `frontend/src/index.css`

**Step 1: Add spacing and status tokens to :root block (after --bottom-nav-height)**

```css
  /* Spacing system */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Status / Priority colors */
  --color-danger:       #EF4444;
  --color-danger-bg:    rgba(239, 68, 68, 0.08);
  --color-danger-text:  #B91C1C;
  --color-warning:      #F59E0B;
  --color-warning-bg:   rgba(245, 158, 11, 0.08);
  --color-warning-text: #92400E;
  --color-success:      #10B981;
  --color-success-bg:   rgba(16, 185, 129, 0.08);
  --color-success-text: #065F46;

  /* Card radius — slightly larger for premium feel */
  --card-radius: 20px;
```

**Step 2: Update .glass-card to use --card-radius and add variants**

```css
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--card-radius);
  padding: var(--space-lg) var(--space-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition);
}

.glass-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

/* Flat variant — no hover lift */
.glass-card.flat {
  transform: none !important;
}
```

**Step 3: Add shared utility classes after .error-text**

```css
/* Page header — unified title style */
.page-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: 'Quicksand', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: var(--space-md);
}

/* Section label — uppercase tracker */
.section-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: var(--space-lg) 0 var(--space-sm);
}

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--pill-radius);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.status-badge.high    { background: var(--color-danger-bg);  color: var(--color-danger-text); }
.status-badge.medium  { background: rgba(123,94,167,0.1);    color: var(--primary-dark); }
.status-badge.low     { background: var(--color-success-bg); color: var(--color-success-text); }
.status-badge.past    { background: var(--color-success-bg); color: var(--color-success-text); }
.status-badge.upcoming{ background: rgba(123,94,167,0.1);    color: var(--primary-dark); }

/* Empty state — unified */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-xl) var(--space-lg);
  gap: var(--space-md);
}
.empty-state svg { color: var(--primary-light); opacity: 0.6; }
.empty-state p   { color: var(--text-muted); font-size: 0.95rem; margin: 0; }

/* Ghost button */
.btn-ghost {
  background: transparent;
  border: none;
  color: var(--primary-color);
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  cursor: pointer;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--pill-radius);
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}
.btn-ghost:hover { background: rgba(123,94,167,0.08); }

/* Appointment card — move from inline styles */
.appt-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: 14px;
  border-left: 4px solid var(--primary-color);
  background: rgba(123,94,167,0.05);
  transition: var(--transition);
}
.appt-card.high   { border-left-color: var(--color-danger);  background: var(--color-danger-bg); }
.appt-card.medium { border-left-color: var(--primary-light); background: rgba(123,94,167,0.06); }
.appt-card.low    { border-left-color: var(--color-success); background: var(--color-success-bg); }

.appt-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--primary-color);
  color: #fff;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1.1;
}
.appt-icon.clock {
  background: transparent;
  color: var(--primary-color);
  font-size: 1rem;
}
.appt-card.high   .appt-icon { background: var(--color-danger); }
.appt-card.high   .appt-icon.clock { color: var(--color-danger); }
.appt-card.low    .appt-icon { background: var(--color-success); }
.appt-card.low    .appt-icon.clock { color: var(--color-success); }

.appt-pet-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 2px;
  color: var(--primary-dark);
}
.appt-card.high   .appt-pet-label { color: var(--color-danger-text); }
.appt-card.low    .appt-pet-label { color: var(--color-success-text); }
.appt-pet-breed { font-weight: 400; text-transform: none; letter-spacing: 0; opacity: 0.7; }

.appt-time {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 2px;
}
.appt-type {
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--text-main);
  line-height: 1.3;
}
.appt-reason {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 2px;
  line-height: 1.4;
}

/* Suggestion item — clean left-border style */
.suggestion-item-clean {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: 14px;
  border-left: 4px solid var(--primary-color);
  background: rgba(123,94,167,0.05);
  cursor: pointer;
  transition: var(--transition);
}
.suggestion-item-clean:hover { transform: translateX(2px); }
.suggestion-item-clean.high   { border-left-color: var(--color-danger);  background: var(--color-danger-bg); }
.suggestion-item-clean.medium { border-left-color: var(--color-warning); background: var(--color-warning-bg); }
.suggestion-item-clean.low    { border-left-color: var(--color-success); background: var(--color-success-bg); }
.suggestion-item-clean .sug-type   { font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 2px; }
.suggestion-item-clean .sug-detail { font-size: 0.78rem; color: var(--text-muted); }

/* Pet filter select */
.pet-filter-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin: var(--space-md) 0 var(--space-xs);
}
.pet-filter-select {
  flex: 1;
  padding: 10px 36px 10px 14px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  background: var(--input-bg);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237B5EA7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: var(--transition);
}
.pet-filter-select:focus { border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(123,94,167,0.12); }

/* Spin animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.spin { animation: spin 1s linear infinite; }

/* Card list gap */
.card-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
```

**Step 5: Verify build**
```bash
cd frontend && npm run build 2>&1 | tail -5
```
Expected: no errors

---

## Task 3: BottomNav — pill active state

**Files:**
- Modify: `frontend/src/components/BottomNav.css`

**Step 1: Replace entire BottomNav.css**

```css
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 480px;
    margin: 0 auto;
    height: var(--bottom-nav-height);
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 1000;
    padding: 0 var(--space-sm) env(safe-area-inset-bottom);
    box-shadow: 0 -4px 20px rgba(123, 94, 167, 0.08);
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.7rem;
    font-weight: 600;
    font-family: 'Quicksand', sans-serif;
    gap: 3px;
    padding: 6px 16px;
    border-radius: var(--pill-radius);
    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    min-width: 60px;
}

.nav-item svg {
    transition: transform 0.2s ease;
}

.nav-item.active {
    color: var(--primary-color);
    background: rgba(123, 94, 167, 0.1);
}

.nav-item.active svg {
    transform: translateY(-1px);
}

.nav-item:not(.active):hover {
    color: var(--primary-light);
    background: rgba(123, 94, 167, 0.05);
}
```

**Step 2: Verify build**
```bash
cd frontend && npm run build 2>&1 | tail -3
```

---

## Task 4: Auth pages — Login.jsx + Signup.jsx polish

**Files:**
- Modify: `frontend/src/pages/Login.jsx`
- Modify: `frontend/src/pages/Signup.jsx`

**Context:** Auth pages usam `.auth-container` com background gradient + `.glass-card` para o form. Vamos polir o card e adicionar subtítulo mais elegante.

**Step 1: In Login.jsx — wrap form in .auth-card instead of .glass-card, add subtitle**

Find the `<div className="glass-card">` wrapping the form and replace with `<div className="auth-card">`.

Also improve the logo header section:
```jsx
{/* Before <div className="glass-card"> — replace logo-header paragraph */}
<p style={{ color: 'rgba(255, 255, 255, 0.85)', marginTop: '8px', fontSize: '1.05rem' }}>
    A melhor clínica para seu pet
</p>
{/* Replace with: */}
<p style={{ color: 'rgba(255, 255, 255, 0.75)', marginTop: '6px', fontSize: '0.95rem', letterSpacing: '0.3px' }}>
    A melhor clínica para seu pet
</p>
```

Change `<div className="glass-card">` → `<div className="auth-card">` (the form wrapper div).

**Step 2: In Login.jsx — improve error message display**

```jsx
{/* Replace: */}
{error && <p className="error-text text-center">{error}</p>}

{/* With: */}
{error && (
    <div style={{
        background: 'var(--color-danger-bg)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '10px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.875rem',
        color: 'var(--color-danger-text)',
        fontWeight: '500',
    }}>
        ⚠️ {error}
    </div>
)}
```

**Step 3: In Signup.jsx — same changes (glass-card → auth-card, error message polish)**

Apply the same two changes to Signup.jsx.

**Step 4: Verify build**
```bash
cd frontend && npm run build 2>&1 | tail -3
```

---

## Task 5: Dashboard.jsx — remove inline styles from AppointmentCard + pet filter

**Files:**
- Modify: `frontend/src/pages/Dashboard.jsx`

**Step 1: Replace AppointmentCard inline styles with CSS classes**

Replace the entire `AppointmentCard` component:

```jsx
const AppointmentCard = ({ app, showDate }) => {
    const date = new Date(app.date_time);
    const { type, reason, priority } = parseNote(app.notes);
    const p = PRIORITY_COLORS[priority] ? priority : 'medium';

    return (
        <div className={`appt-card ${p}`}>
            {showDate ? (
                <div className="appt-icon">
                    <div>{String(date.getDate()).padStart(2, '0')}</div>
                    <div>{monthShort[date.getMonth()]}</div>
                </div>
            ) : (
                <div className="appt-icon clock">
                    <Clock size={20} />
                </div>
            )}

            <div style={{ flex: 1 }}>
                {app.pet_name && (
                    <div className="appt-pet-label">
                        <PawPrint size={11} />
                        {app.pet_name}
                        {app.pet_breed && (
                            <span className="appt-pet-breed"> · {app.pet_breed}</span>
                        )}
                    </div>
                )}
                <div className="appt-time">
                    {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    {showDate && ` · ${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
                </div>
                <div className="appt-type">{type}</div>
                {reason && <div className="appt-reason">{reason}</div>}
            </div>
        </div>
    );
};
```

**Step 2: Replace pet filter inline styles with .pet-filter-row + .pet-filter-select classes**

```jsx
{/* Replace the entire pets.length > 1 block with: */}
{pets.length > 1 && (
    <div className="pet-filter-row">
        <Filter size={16} color="var(--primary-color)" />
        <select
            value={selectedPetFilter}
            onChange={(e) => setSelectedPetFilter(e.target.value)}
            className="pet-filter-select"
        >
            <option value="all">🐾 Todos os Pets</option>
            {pets.map(pet => (
                <option key={pet.id} value={String(pet.id)}>
                    {pet.name}{pet.ai_breed ? ` — ${pet.ai_breed}` : ''}
                </option>
            ))}
        </select>
    </div>
)}
```

**Step 3: Replace card list inline style with .card-list class**

```jsx
{/* Replace: style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} */}
{/* With:    className="card-list" */}
```
Apply to both card list divs in the Dashboard.

**Step 4: Add .flat to glass-cards in dashboard so they don't hover-lift**
```jsx
{/* Change: className="glass-card mt-4" */}
{/* To:     className="glass-card flat mt-4" */}
```

**Step 5: Verify build**
```bash
cd frontend && npm run build 2>&1 | tail -3
```

---

## Task 6: Scheduling.jsx — clean suggestion items

**Files:**
- Modify: `frontend/src/pages/Scheduling.jsx`

**Step 1: Replace getPriorityColor function and suggestion-item with clean version**

Remove the `getPriorityColor` function entirely.

Replace suggestion item JSX:
```jsx
{/* Replace: */}
<div
    key={idx}
    onClick={() => applySuggestion(apt.type, apt.interval_days)}
    className="suggestion-item"
    style={{ background: getPriorityColor(apt.priority) }}
>
    <div className="suggestion-type">{apt.type}</div>
    <div className="suggestion-details">{apt.reason} • Em {apt.interval_days} dias</div>
</div>

{/* With: */}
<div
    key={idx}
    onClick={() => applySuggestion(apt.type, apt.interval_days)}
    className={`suggestion-item-clean ${apt.priority || 'medium'}`}
>
    <div style={{ flex: 1 }}>
        <div className="sug-type">{apt.type}</div>
        <div className="sug-detail">{apt.reason} · em {apt.interval_days} dias</div>
    </div>
    <span className={`status-badge ${apt.priority || 'medium'}`}>
        {apt.priority === 'high' ? 'Urgente' : apt.priority === 'low' ? 'Eletivo' : 'Importante'}
    </span>
</div>
```

**Step 2: Remove inline paddingBottom from page-container**
```jsx
{/* Change: className="page-container" style={{ paddingBottom: '80px' }} */}
{/* To:     className="page-container" */}
```

**Step 3: Verify build**
```bash
cd frontend && npm run build 2>&1 | tail -3
```

---

## Task 7: Profile.jsx — clean user card + status badges

**Files:**
- Modify: `frontend/src/pages/Profile.jsx`

**Step 1: Replace loading spinner inline style with .spin class**
```jsx
{/* Replace: */}
<Activity size={40} style={{ color: 'var(--primary-color)', animation: 'spin 1s linear infinite' }} />
{/* With: */}
<Activity size={40} style={{ color: 'var(--primary-color)' }} className="spin" />
```

**Step 2: Replace history-status-badge with status-badge**
```jsx
{/* Replace: */}
<span className={`history-status-badge ${statusClass}`}>
    {isPast ? 'Concluído' : 'Agendado'}
</span>
{/* With: */}
<span className={`status-badge ${statusClass}`}>
    {isPast ? 'Concluído' : 'Agendado'}
</span>
```

**Step 3: Replace borderLeft inline style in history-card with CSS var**
```jsx
{/* Replace: */}
style={{ borderLeft: `5px solid ${getAppointmentStatusColor(app.date_time)}` }}
{/* With: */}
style={{ borderLeft: `4px solid ${isPast ? 'var(--color-success)' : 'var(--primary-color)'}` }}
```
And remove the `getAppointmentStatusColor` function since it's no longer needed.

**Step 4: Remove inline paddingBottom from page-container**
```jsx
{/* Change: className="page-container" style={{ paddingBottom: '80px' }} */}
{/* To:     className="page-container" */}
```

**Step 5: Verify build + lint**
```bash
cd frontend && npm run lint && npm run build 2>&1 | tail -5
```
Expected: no errors, successful build.

---

## Task 8: Final verification

**Step 1: Full lint check**
```bash
cd frontend && npm run lint
```
Expected: 0 errors, warnings OK

**Step 2: Production build**
```bash
cd frontend && npm run build
```
Expected: `✓ built in X.XXs`

**Step 3: Visual checklist (manual)**
Open `http://localhost:5173` after running `npm run dev`:
- [ ] Login page: auth-card form, clean error display
- [ ] Signup page: same polish as login
- [ ] Dashboard: AppointmentCards use CSS classes, pet filter is clean
- [ ] Dashboard BottomNav: active item has pill background
- [ ] Scheduling: suggestion items have left-border + status badge (no heavy gradients)
- [ ] Profile: loading uses .spin class, history uses status-badge
