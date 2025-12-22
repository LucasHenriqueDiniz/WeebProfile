# /debug-generation

You are helping me debug `svg-generator` generation failures.

## What to do
1) Identify whether the error is:
   - request parsing / validation
   - essential config fetching
   - plugin fetchData
   - plugin render()
   - css loading
   - SVG container creation / renderToString
2) Propose the smallest code change to isolate the failure:
   - toggle `debug` response
   - add a targeted log (no secrets)
   - add a guard with a helpful 400 message
3) Provide a curl request that reproduces the issue.

## Constraints
- Do not log secrets or return them.
- Keep behavior backward compatible unless explicitly required.
