# /tighten-logging

Reduce noisy logs in `svg-generator` without losing debuggability.

## Goals
- Production logs:
  - one line per request with request id + enabled plugin count
  - errors with stack traces (no secrets)
- Debug mode (`debug=true` or `dev=true`):
  - allow detailed logs but sanitize

## Constraints
- Never log tokens / api keys / DATABASE_URL.
- Keep response contract unchanged.
