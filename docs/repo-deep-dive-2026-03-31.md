# Deep-Dive Repository Evaluation (March 31, 2026)

Scope of this pass:
- Re-evaluate issues and regressions after recent refactors.
- Focus on correctness and schema/taxonomy alignment against `types/index.ts` (assumed canonical unless altered).
- Exclude auth/security model item 8 from remediation recommendations per prior direction.

## Executive summary

The codebase is functional and now passes local lint/typecheck/build, but there are still **important mismatches** between API behavior and the canonical taxonomy/types. The highest-risk gaps are around write semantics (bulk endpoints no longer truly replace), API contract drift, and hidden misconfiguration behavior.

## High-priority findings

### 1) `/api/jobs/[id]` returns shape that is still not a true `PipelineJob`

**Why this is a mismatch**
- `PipelineJob` includes many `application_*` timestamp fields and `pipeline_stage`.
- `/api/jobs/[id]` now returns listing fields plus only `application_id` + `application_stage` from a join.

**Impact**
- Consumers assuming `PipelineJob` parity with `/api/jobs` responses can mis-handle null/undefined fields.
- Hidden drift between list view and detail view contracts.

**Suggested fix**
- Standardize on one read model for job detail (prefer `pipeline_job_listing_state` view or a dedicated SQL view/RPC) so `/api/jobs/[id]` and `/api/jobs` return the same contract.

---

### 2) Bulk evidence endpoint no longer preserves “replace set” semantics

**Why this is a mismatch**
- Evidence generation UI sends rows without IDs.
- Endpoint uses `upsert(rows)` without a conflict target and without deleting stale rows.

**Impact**
- Re-parsing evidence can create duplicate records or stale rows rather than replacing the set.
- User sees inconsistent evidence lists over time.

**Suggested fix**
- Implement explicit replace semantics in one transaction (server function/RPC):
  1) delete by `application_id`,
  2) insert new set,
  3) commit/rollback atomically.

---

### 3) Questions endpoint has the same semantic drift risk as evidence

**Why this is a mismatch**
- POST now upserts with optional IDs and no explicit conflict target or replacement transaction.

**Impact**
- Regeneration/editing paths can leave stale or duplicate questions depending on payload shape and DB constraints.

**Suggested fix**
- Same transactional replace strategy as evidence, or enforce a robust unique key and upsert on that key.

---

### 4) Type taxonomy mismatch: category fields are unbounded strings in API validation

**Why this is a mismatch**
- `KeywordCategory` is a strict union in `types/index.ts`.
- API schema allows any string category.

**Impact**
- Invalid categories can be persisted and later break assumptions in UI logic/reporting.

**Suggested fix**
- Use a Zod enum matching `KeywordCategory`.

---

### 5) Type taxonomy mismatch: evidence schema omits `source_user_evidence_id`

**Why this is a mismatch**
- `ApplicationEvidence` type includes `source_user_evidence_id`.
- API schema and persistence path do not carry it.

**Impact**
- Loss of lineage metadata and drift from canonical data model.

**Suggested fix**
- Add `source_user_evidence_id` to API schema and persistence path (nullable).

---

### 6) Type taxonomy mismatch: resume/cover-letter model includes `version`, API doesn’t manage it

**Why this is a mismatch**
- `ApplicationResume` type includes required `version`.
- API routes for resume/cover-letter do not set or increment version.

**Impact**
- Versioned-document assumptions cannot be trusted.

**Suggested fix**
- Either:
  - make `version` DB-managed with default/increment semantics, or
  - explicitly update version in API writes.

## Medium-priority findings

### 7) Misconfiguration is silently masked by Supabase fallback values

**Observation**
- Fallback URL/key values avoid build crashes, but can hide missing env configuration and cause surprising runtime behavior.

**Impact**
- Misconfigured environments may appear “healthy” while talking to invalid targets.

**Suggested fix**
- Keep build-safe behavior but add explicit startup warnings/errors in non-dev deploys.

---

### 8) Listing intake status codes blur client vs server errors

**Observation**
- Invalid target checks and blocked URL scenarios fall through catch and return 500.

**Impact**
- UX and monitoring receive server-error signals for client-invalid requests.

**Suggested fix**
- Return 400 for validation/blocked-target failures and reserve 500 for genuine server faults.

---

### 9) API formatting/readability improved in some files, but consistency is incomplete

**Observation**
- Several routes are now well-structured, but others remain compressed one-liners.

**Impact**
- Ongoing maintenance and review quality remain uneven.

**Suggested fix**
- Apply a single formatting/refactor pass across all API routes and consolidate shared helpers.

## Contract alignment checklist (types vs API)

- [ ] `PipelineJob` parity for `/api/jobs` and `/api/jobs/[id]`
- [ ] `KeywordCategory` enforced by API validation
- [ ] `ApplicationEvidence.source_user_evidence_id` supported end-to-end
- [ ] `ApplicationResume.version` lifecycle defined and enforced
- [ ] Bulk replace semantics made explicit and atomic where expected

## Recommended next implementation order

1. **Contract parity:** normalize `/api/jobs/[id]` to `PipelineJob`-equivalent output.
2. **Bulk integrity:** transactional replace strategy for evidence/questions.
3. **Taxonomy enforcement:** strict enums/fields in Zod schemas.
4. **Operational clarity:** better env-misconfig signaling and request status code mapping.
5. **Maintainability:** finish route formatting/helper extraction.

## Verification plan for follow-up PRs

- Add integration tests for evidence/questions re-parse idempotency.
- Add API contract tests comparing `/api/jobs` list item shape vs `/api/jobs/[id]` detail shape.
- Add schema guard tests ensuring invalid keyword categories are rejected.
- Add versioning tests for resume/cover-letter writes.


## Added-jobs taxonomy verification

Follow-up validation on requested naming:
- Canonical pipeline stage now uses `added_jobs` instead of `new`.
- Job selection helper is now `getAddedJobs()` with `getInterestedJobs()` retained as a compatibility alias during migration.
- Dashboard and the interested pipeline page now read from `getAddedJobs()` and filter by `pipeline_stage === "added_jobs"`.

Remaining recommendation:
- If you want a full terminology cleanup, rename `/pipeline/interested` route and sidebar/mobile labels to “Added Jobs” everywhere (currently route path is still `interested` for compatibility).
