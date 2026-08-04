import { z } from "zod"

/**
 * Request-body validation for the Pages Functions.
 *
 * Every handler used to do `(await request.json()) as Record<string, any>` and
 * destructure, so a body that was merely the wrong shape reached code that
 * assumed otherwise -- a non-string `name`, for instance, reached `.toLowerCase()`
 * and surfaced as a 500 instead of a 400. Zod was already a dependency but was
 * only ever used client-side, which is the half that an attacker skips.
 */

export type ParseResult<T> = { ok: true; data: T } | { ok: false; response: Response }

export async function parseBody<S extends z.ZodTypeAny>(request: Request, schema: S): Promise<ParseResult<z.infer<S>>> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return { ok: false, response: Response.json({ error: "Invalid JSON body" }, { status: 400 }) }
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      response: Response.json(
        {
          error: "Invalid request body",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      ),
    }
  }

  return { ok: true, data: parsed.data }
}

// Shared field shapes. Bounds are deliberately generous -- the point is to reject
// wrong types and unbounded input, not to second-guess the wizard.
const name = z.string().trim().min(1, "Name is required").max(120)
const entityType = z.enum(["profile", "repository"])
const artifactType = z.enum(["profile_card", "repository_card"])
const style = z.enum(["default", "terminal"])
const size = z.enum(["half", "full"])
const variant = z.string().max(60)
const theme = z.string().max(60)
// customCss is rendered into its own document (see PreviewSvgContainer), but it
// is still stored and shipped, so cap it rather than accept arbitrary length.
const customCss = z.string().max(20_000).nullable().optional()
// Plugin configs are open-ended by design; assertPluginsMatchEntityType and the
// generator's own validation own the semantics. Here we only insist it is an object.
const pluginsConfig = z.record(z.string(), z.unknown())
const uiConfig = z.record(z.string(), z.unknown())
const pluginsOrder = z.string().max(2_000).nullable().optional()
// Terminal presentation, stored inside uiConfig by setTerminalConfigs.
const fontFamily = z.string().max(60).optional()
const terminalHeaderText = z.string().max(200).optional()

export const svgCreateSchema = z.object({
  name,
  entityType: entityType.default("profile"),
  artifactType: artifactType.default("profile_card"),
  variant: variant.default("default"),
  pluginsConfig: pluginsConfig.default({}),
  uiConfig: uiConfig.default({}),
  style: style.default("default"),
  size: size.default("half"),
  theme: theme.default("default"),
  customCss,
  pluginsOrder,
  hideTerminalEmojis: z.boolean().optional(),
  hideTerminalHeader: z.boolean().optional(),
  hideTerminalCommand: z.boolean().optional(),
  fontFamily,
  terminalHeaderText,
})

/**
 * Templates carry the same presentation payload as an SVG, but a public one is
 * read by other people -- customCss from here ends up applied in someone else's
 * session -- so this is the shape that most warrants being pinned down.
 */
export const templateCreateSchema = z.object({
  name,
  description: z.string().max(500).nullable().optional(),
  svgId: z.string().max(100).nullable().optional(),
  style: style.optional(),
  size: size.optional(),
  theme: theme.optional(),
  customCss,
  pluginsOrder,
  pluginsConfig: pluginsConfig.optional(),
  uiConfig: uiConfig.optional(),
  isPublic: z.boolean().default(false),
  hideTerminalEmojis: z.boolean().optional(),
  hideTerminalHeader: z.boolean().optional(),
  hideTerminalCommand: z.boolean().optional(),
  fontFamily,
  terminalHeaderText,
})

export const templateUpdateSchema = templateCreateSchema.partial()

/**
 * Profile update. essentialConfigs is the plugin_secrets payload: one D1 upsert per
 * leaf key, so the caps here are about bounding write amplification as much as they
 * are about types. Values are secrets -- never echo them back in an error.
 */
export const profileUpdateSchema = z
  .object({
    username: z.string().trim().max(100).nullable().optional(),
    essentialConfigs: z
      .record(z.string().min(1).max(60), z.record(z.string().min(1).max(60), z.string().max(4_000)).optional())
      .refine((configs) => Object.keys(configs).length <= 30, { message: "Too many plugins" })
      .refine((configs) => Object.values(configs).every((keys) => !keys || Object.keys(keys).length <= 20), {
        message: "Too many keys for a plugin",
      })
      .optional(),
  })
  .refine((data) => data.username !== undefined || data.essentialConfigs !== undefined, {
    message: "At least one field is required",
  })

export const svgUpdateSchema = z
  .object({
    name,
    entityType,
    artifactType,
    variant,
    pluginsConfig,
    uiConfig,
    style,
    size,
    theme,
    customCss,
    pluginsOrder,
    isPaused: z.boolean(),
    hideTerminalEmojis: z.boolean(),
    hideTerminalHeader: z.boolean(),
    hideTerminalCommand: z.boolean(),
    fontFamily: z.string().max(60),
    terminalHeaderText: z.string().max(200),
  })
  .partial()
