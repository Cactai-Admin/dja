# Dream Job App (v0.8 clean rewrite pass)

This package is a clean rewrite pass against the new database taxonomy:

- `user_*`
- `job_listings`
- `applications`

## What was removed

- Inngest
- old background-job scaffolding
- legacy migrations from the handoff package

## Current route surface

- `/api/jobs`
- `/api/listing-intake`
- `/api/job-listing-research`
- `/api/application-keywords`
- `/api/application-questions`
- `/api/application-answers`
- `/api/application-evidence`
- `/api/application-resume`
- `/api/application-cover-letters`

## Environment

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Recommended for local development until auth wiring is added:

- `NEXT_PUBLIC_DEV_USER_ID`

## Notes

- This handoff intentionally does not include the old migration files.
- The code is aligned to the new schema bootstrap you created separately.
- Content entry flows are autosave-based where authored text is entered.
- Explicit buttons remain for actions that should not happen automatically, such as listing scraping, parsing, copying prompts, and downloading documents.
