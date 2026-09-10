# Pixora API (özet)

Route Handlers under `app/api`. Auth for admin: signed cookie `pixora_admin_session` (jose HS256). Public endpoints are unauthenticated.

Error shape (consistent):

```json
{ "error": "string", "details": {} }
```

`details` is optional. Success bodies are plain JSON (no envelope) unless noted.

---

## Public

| Method | Path | Body / notes |
|--------|------|----------------|
| `POST` | `/api/public/contact` | `{ name, email, message, company?, phone?, budget?, locale?, website? }` — honeypot `website`; **rate limit** 5 / 10 min / IP (in-memory, best-effort on serverless) → `429` |
| `POST` | `/api/public/locale` | `{ code }` — sets `pixora_locale` cookie (`httpOnly: false`); code must be active Locale |
| `GET` | `/api/public/locale` | Probe: cookie name + default locale |

---

## Admin auth

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/api/admin/auth/login` | `{ email, password }` → sets session cookie |
| `POST` | `/api/admin/auth/logout` | Clears session |
| `GET` | `/api/admin/auth/me` | Current admin user or `401` |

All other `/api/admin/*` require a valid session cookie (`401` otherwise). Protected by `proxy.ts`.

---

## Admin resources (CRUD summary)

| Path | Methods | Notes |
|------|---------|--------|
| `/api/admin/locales` | GET, POST | List / create locale |
| `/api/admin/locales/[id]` | GET, PATCH, DELETE | Update active/default/name; delete |
| `/api/admin/settings` | GET, PUT/PATCH | Site settings JSON |
| `/api/admin/projects` | GET, POST | List / create (+ translations) |
| `/api/admin/projects/[id]` | GET, PATCH, DELETE | |
| `/api/admin/posts` | GET, POST | Blog |
| `/api/admin/posts/[id]` | GET, PATCH, DELETE | |
| `/api/admin/pages` | GET | Page list |
| `/api/admin/pages/[key]` | GET | Page + sections |
| `/api/admin/pages/[key]/sections` | PUT/PATCH | Section payloads by locale |
| `/api/admin/media` | GET, POST | List / upload (`multipart`) |
| `/api/admin/media/[id]` | PATCH, DELETE | Alt / delete file |
| `/api/admin/messages` | GET | Inbox query |
| `/api/admin/messages/[id]` | GET, PATCH, DELETE | Read / archive / delete |
| `/api/admin/messages/unread-count` | GET | Badge count |

Validation: Zod schemas under `lib/admin/*-schema.ts`. Helpers: `ok` / `err` / `ApiError` in `lib/api/*`.

---

## Locale (public site)

- Cookie: `pixora_locale`
- Optional path prefix: `/tr/...`, `/en/...` rewritten in `proxy.ts` to unprefixed route + `x-pixora-locale` header + cookie
- Default locale = `Locale.isDefault` (seed: `en`)
- Content fallback: requested → default → first available

---

## Rate limit note

`lib/api/rate-limit.ts` is an **in-memory sliding window**. On multi-instance / serverless, each isolate has its own Map — limits are best-effort, not a global edge limiter.
