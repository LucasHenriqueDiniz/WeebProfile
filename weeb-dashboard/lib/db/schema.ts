import { sqliteTable, text, integer, index, unique } from "drizzle-orm/sqlite-core"

// JSON helper — values are stored as text and JSON.parsed/stringified transparently
const json = <T>(name: string) =>
  text(name, { mode: "json" }).$type<T>()

const uuid = (name: string) =>
  text(name).$defaultFn(() => crypto.randomUUID())

const now = () =>
  text().$defaultFn(() => new Date().toISOString()).notNull()

/**
 * User profiles table
 */
export const profiles = sqliteTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    username: text("username"),
    isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
    updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()).notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_profiles_user_id").on(table.userId),
    usernameIdx: index("idx_profiles_username").on(table.username),
    activeIdx: index("idx_profiles_active").on(table.isActive),
  })
)

/**
 * Essential configurations table (API keys, tokens, etc.)
 * Never returned in HTTP responses — server-side only.
 */
export const essentialConfigs = sqliteTable(
  "plugin_secrets",
  {
    id: uuid("id").primaryKey(),
    userId: text("user_id").notNull(),
    plugin: text("plugin").notNull(),
    key: text("key").notNull(),
    value: text("value").notNull(),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
    updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()).notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_essential_configs_user_id").on(table.userId),
    pluginKeyIdx: index("idx_essential_configs_plugin_key").on(table.plugin, table.key),
    userIdPluginKeyUnique: unique("idx_essential_configs_user_plugin_key_unique")
      .on(table.userId, table.plugin, table.key),
  })
)

/**
 * Generated SVGs table
 */
export const svgs = sqliteTable(
  "svgs",
  {
    id: uuid("id").primaryKey(),
    userId: text("user_id").notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    style: text("style").notNull().default("default"),
    size: text("size").notNull().default("half"),
    theme: text("theme").default("default"),
    customCss: text("custom_css"),
    pluginsOrder: text("plugins_order"),
    pluginsConfig: json<Record<string, unknown>>("plugins_config").notNull().$default(() => ({})),
    uiConfig: json<Record<string, unknown>>("ui_config").notNull().$default(() => ({})),
    storagePath: text("storage_path"),
    storageUrl: text("storage_url"),
    status: text("status").notNull().default("pending"),
    forceRegenerate: integer("force_regenerate", { mode: "boolean" }).default(false).notNull(),
    dataHash: text("data_hash"),
    lastGeneratedAt: text("last_generated_at"),
    updatedAt: text("updated_at").$defaultFn(() => new Date().toISOString()).notNull(),
    nextRegenerationAt: text("next_regeneration_at"),
    lastPayloadHash: text("last_payload_hash"),
    failCount: integer("fail_count").notNull().default(0),
    lastError: text("last_error"),
    isPaused: integer("is_paused", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_svgs_user_id").on(table.userId),
    slugIdx: index("idx_svgs_slug").on(table.slug),
    userIdSlugIdx: index("idx_svgs_user_id_slug").on(table.userId, table.slug),
    statusIdx: index("idx_svgs_status").on(table.status),
    forceRegenerateIdx: index("idx_svgs_force_regenerate").on(table.forceRegenerate),
  })
)

/**
 * Templates table
 */
export const templates = sqliteTable(
  "templates",
  {
    id: uuid("id").primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    svgId: text("svg_id"),
    style: text("style").notNull().default("default"),
    size: text("size").notNull().default("half"),
    theme: text("theme").default("default"),
    customCss: text("custom_css"),
    pluginsOrder: text("plugins_order"),
    pluginsConfig: json<Record<string, unknown>>("plugins_config").notNull().$default(() => ({})),
    uiConfig: json<Record<string, unknown>>("ui_config").notNull().$default(() => ({})),
    isPublic: integer("is_public", { mode: "boolean" }).default(false).notNull(),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_templates_user_id").on(table.userId),
    svgIdIdx: index("idx_templates_svg_id").on(table.svgId),
    publicIdx: index("idx_templates_public").on(table.isPublic),
  })
)

/**
 * Template likes table
 */
export const templateLikes = sqliteTable(
  "template_likes",
  {
    id: uuid("id").primaryKey(),
    userId: text("user_id").notNull(),
    templateId: text("template_id").notNull(),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_template_likes_user_id").on(table.userId),
    templateIdIdx: index("idx_template_likes_template_id").on(table.templateId),
    userTemplateUnique: unique("idx_template_likes_user_template_unique")
      .on(table.userId, table.templateId),
  })
)

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert

export type EssentialConfig = typeof essentialConfigs.$inferSelect
export type NewEssentialConfig = typeof essentialConfigs.$inferInsert

export type Svg = typeof svgs.$inferSelect
export type NewSvg = typeof svgs.$inferInsert

export type Template = typeof templates.$inferSelect
export type NewTemplate = typeof templates.$inferInsert

export type TemplateLike = typeof templateLikes.$inferSelect
export type NewTemplateLike = typeof templateLikes.$inferInsert
