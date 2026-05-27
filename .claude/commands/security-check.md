Audit the current diff or specified files for security issues specific to this project:

- `essentialConfig` values being serialized or returned in HTTP responses
- API keys or tokens in `requiredFields` instead of `essentialConfigKeys`
- Any `DATABASE_URL`, `CRON_SECRET`, `GH_TOKEN`, or credentials being logged or exposed
- `essentialConfig` being passed to client-side code or stored in public config
- Missing sanitization in new endpoints in `svg-generator/src/server.ts`

Report each finding with file, line number, and why it's a risk.
