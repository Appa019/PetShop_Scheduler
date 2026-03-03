# Frontend Refinement Design — 8Patas

**Date:** 2026-02-27
**Scope:** Frontend polish + OpenAI API json_schema fix
**Approach:** Polished refinement (preserve palette, improve consistency)

---

## Goals

1. Make the app look professional, aesthetic and clean
2. Fix OpenAI API calls to use `json_schema` instead of deprecated `json_object`
3. Eliminate inline styles → move to CSS classes
4. Unify spacing, typography, and color tokens
5. Polish every page including Login/Signup

---

## What stays the same

- Color palette: lavender primary `#7B5EA7`, teal secondary `#5BBFB8`
- Page structure and routing
- All functionality and API calls
- Mobile-first max-width 480px layout

---

## Design System Changes (index.css)

### New tokens

```css
/* Spacing system */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;

/* Status colors */
--color-danger:      #EF4444;
--color-danger-bg:   rgba(239, 68, 68, 0.08);
--color-danger-text: #B91C1C;
--color-warning:     #F59E0B;
--color-warning-bg:  rgba(245, 158, 11, 0.08);
--color-warning-text:#92400E;
--color-success:     #10B981;
--color-success-bg:  rgba(16, 185, 129, 0.08);
--color-success-text:#065F46;
```

### Component improvements

- `.glass-card`: `border-radius: 20px`, `padding: var(--space-lg)`, softer shadow
- `.btn-primary`: larger tap target (48px min-height), subtle hover lift
- `.btn-secondary`: cleaner outlined style
- Add `.btn-ghost` as proper class (remove inline versions)
- `.input-field`: slightly larger font-size (16px), better focus ring
- `.page-header`: unified page title style across all protected pages
- `.status-badge`: reusable badge for high/medium/low priority
- `.empty-state`: single component style (icon + heading + subtitle + CTA)
- `.section-label`: uppercase tracking label for section headers

---

## OpenAI API Fix (ai_service.py)

Replace `text={"format": {"type": "json_object"}}` with typed `json_schema` in all 3 functions:

- `analyze_pet_image` → schema with `breed`, `care_script`, `suggested_symptoms`, `breed_diseases`
- `identify_breed_mix` → schema with `breed`, `evidence`
- `suggest_appointment_dates` → schema with `appointments` array, `next_recommended`

This aligns with OpenAI's recommendation for gpt-5.2 and improves reliability of structured output.

---

## Page-by-Page Changes

### Auth Pages (Login + Signup)

**Current issues:** Hero image takes too much vertical space, form card looks generic
**Changes:**
- Softer gradient background (add subtle animated gradient)
- Logo area: larger, more centered branding
- Form card: more padding, subtle entrance animation
- Input fields: consistent height, cleaner focus state
- Buttons: full-width, 48px height, rounded pill
- Link styles: unified color and weight
- Error messages: icon + text, not just text

### Dashboard

**Current issues:** AppointmentCard has ~150 lines of inline styles
**Changes:**
- `.appt-card`, `.appt-card--high`, `.appt-card--medium`, `.appt-card--low` CSS classes
- Better date/time display (time chip on the right)
- Header: cleaner name greeting, logout as icon button
- Banner: tighter, more elegant gradient overlay
- Pet filter: styled select with better visual
- Section titles: use `.section-label` + `.page-header` tokens

### PetsList

**Current issues:** ~500 lines of inline styles in SectionToggle/CategoryToggle
**Changes:**
- `.section-toggle`, `.category-toggle` CSS classes
- Smooth CSS transitions instead of inline style toggling
- Pet card: photo fills top 180px with overlay, info below with breathing room
- Breed badge: pill style, consistent with rest of app
- Disease paragraphs: better line-height, alternating bg via CSS class

### Scheduling

**Current issues:** Priority gradients are heavy, layout feels cramped
**Changes:**
- Suggestion items: left-border + icon + text (no heavy gradients)
- Priority shown as small `.status-badge` chip
- Form section: more whitespace, cleaner select + datetime inputs
- Success state: clean confirmation card, not inline styles

### Profile

**Current issues:** User card uses background image that can cause readability issues
**Changes:**
- User card: solid gradient instead of background image, avatar circle with initials
- History list: `.history-card` as proper CSS class with borderLeft color via CSS vars
- Status badge: reuse `.status-badge` component
- Logout: clean button at bottom of page, not pill style

### BottomNav

**Current issues:** Active state is just color change, feels flat
**Changes:**
- Active item: pill background `rgba(--primary-color, 0.1)`, icon+label highlighted
- More breathing room between icons
- Subtle entrance animation on mount

---

## Files to Modify

| File | Change Type |
|------|-------------|
| `frontend/src/index.css` | Add tokens, refine component styles |
| `frontend/src/components/BottomNav.jsx` + `BottomNav.css` | Redesign active state |
| `frontend/src/pages/Login.jsx` | Auth page polish |
| `frontend/src/pages/Signup.jsx` | Auth page polish |
| `frontend/src/pages/Dashboard.jsx` | Convert inline → CSS classes |
| `frontend/src/pages/PetsList.jsx` | Convert inline → CSS classes |
| `frontend/src/pages/Scheduling.jsx` | Polish suggestions + form |
| `frontend/src/pages/Profile.jsx` | Polish user card + history |
| `backend/ai_service.py` | json_object → json_schema |

---

## Verification

After implementation:
1. `cd frontend && npm run lint` — no lint errors
2. `cd frontend && npm run build` — build succeeds
3. Visual check: Login, Signup, Dashboard, PetsList, Scheduling, Profile on mobile viewport (375px)
4. Test demo user login: `demo@8patas.com` / `senha123`
5. Check that AI features still work (graceful fallback if no API key)
