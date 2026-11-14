// /svg/<id>.svg: the address the dashboard gives for READMEs, on the dashboard's own
// origin. The SVGs used to be linked straight from the bucket (pub-….r2.dev), which
// Cloudflare rate-limits and documents as for development only, and which changes if
// the bucket's public URL does. Same handler as /api/svg/<id>.
export { onRequestGet } from "../api/svg/[id]"
