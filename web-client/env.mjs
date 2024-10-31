import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    node_version: z.string(),
  },
  client: {},
  runtimeEnv: {
    node_version: process.version,
  },
})
