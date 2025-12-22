# /refactor-server-handler

Refactor `src/server.ts` for readability while preserving behavior.

## Must keep
- CORS behavior (OPTIONS)
- POST-only handling
- Validation rules (`style` + `size`)
- userId -> essential configs fetch
- debug response sanitization

## Desired structure
- Small helpers:
  - `readJsonBody(req)`
  - `buildInternalConfig(requestData, essentialConfigs)`
  - `respondJson(res, code, payload)`
- Minimize `any` usage; prefer typed narrowing.
