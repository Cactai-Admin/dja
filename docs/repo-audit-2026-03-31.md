# Repo Evaluation (March 31, 2026)

## Overall assessment

The repository is a pragmatic MVP that ships quickly, but it has several correctness and reliability gaps that will cause data integrity issues in production.

### What is working well

- Consistent API shape (`{ data, error }`) across routes.
- Good use of Zod schemas for request validation.
- Workflow-first UX and clear stage progression.
- TypeScript typecheck passes.

## Findings

### 1) Build is not reliably reproducible in restricted/offline CI

- `app/layout.tsx` imports `Inter` from `next/font/google`, which requires fetching from Google at build time in some environments.
- In this environment, `npm run build` fails due to font fetch failure.

**Impact:** production build fragility; CI false negatives in restricted networks.

**Fix options:**
1. Switch to `next/font/local` and commit the font files.
2. Keep Google font but add a CI profile with network access and/or fallback style strategy.

---

### 2) Lint script is not CI-safe yet

- `npm run lint` triggers Next.js ESLint setup prompt because ESLint config is missing.

**Impact:** linting is effectively disabled in automation.

**Fix:** add an explicit ESLint config (`.eslintrc.json` or `eslint.config.*`) with `next/core-web-vitals` and run lint in CI.

---

### 3) Data mapping bug in `GET /api/jobs/[id]`

- The route queries `job_listings` by `id`, then remaps the response ID to `data.job_listing_id`.
- `job_listing_id` is not guaranteed to exist on `job_listings`; that field name belongs to derived views in other places.

**Impact:** responses can return incorrect or `undefined` ID, causing downstream UI/update bugs.

**Fix:** return `id: data.id` when reading from `job_listings`, and standardize ID mapping rules per table/view.

---

### 4) Non-atomic write path when creating jobs

- `POST /api/jobs` inserts into `job_listings` and then `applications` as two independent writes.
- If the second write fails, the listing remains orphaned.

**Impact:** inconsistent workflow state and manual cleanup burden.

**Fix options:**
1. Use a database transaction (preferred; RPC or server-side function).
2. Compensate on failure by deleting the listing if application insert fails.

---

### 5) Bulk endpoints use destructive replace patterns without transaction

- `application_evidence` and `application_questions` POST handlers delete existing rows, then insert replacements.
- If insert fails after delete, data is lost.

**Impact:** potential user data loss during save.

**Fix:** transactional delete+insert, or use upsert semantics with stable keys.

---

### 6) Keyword upsert logic can silently fail per-row

- `application-keywords` loops rows and does insert/update calls, but does not check per-call errors before returning overall success payload.

**Impact:** partial writes can be masked.

**Fix:** collect and handle per-row errors, or use one `upsert` call with conflict target.

---

### 7) Open proxy behavior in listing intake (SSRF hardening needed)

- `POST /api/listing-intake` fetches arbitrary user-supplied URLs.

**Impact:** SSRF risk in deployed environments.

**Fix:** validate allowlist / block private CIDRs / restrict protocols / add request timeout & size limits.

---

### 8) Environment variable strategy is fragile and insecure-by-default

- Server and browser code both use `NEXT_PUBLIC_*` Supabase keys.
- `NEXT_PUBLIC_DEV_USER_ID` fallback to a hard-coded UUID is enabled in server routes.

**Impact:** accidental cross-user writes and weak auth assumptions.

**Fix:**
1. Separate server-only env (`SUPABASE_SERVICE_ROLE_KEY` only where needed).
2. Remove hardcoded user fallback in non-dev mode.
3. Enforce auth/session-derived user ID in API handlers.

---

### 9) Maintainability: highly compressed one-line files in critical API routes

- Multiple route handlers are single-line/near-single-line implementations.

**Impact:** difficult reviews, harder diffs, reduced testability.

**Fix:** reformat and factor shared CRUD helpers (validation, error handling, timestamp stamping).

## Recommended implementation order

1. **Stability gates:** fix lint setup + build font strategy.
2. **Data integrity:** transactional job create + transactional bulk replace endpoints.
3. **Correctness:** fix `/api/jobs/[id]` ID mapping.
4. **Security:** SSRF hardening + real user identity/auth in API routes.
5. **Maintainability:** route refactor and shared data-access helpers.

## Suggested acceptance checks after fixes

- `npm run lint` non-interactive pass.
- `npm run typecheck` pass.
- `npm run build` pass in CI profile.
- Integration test: `POST /api/jobs` never leaves orphan listings.
- Integration test: bulk evidence/questions updates are atomic.
- Security test: `listing-intake` blocks loopback/private network targets.
