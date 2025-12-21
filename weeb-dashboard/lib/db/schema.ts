import { pgTable, uuid, text, boolean, timestamp, jsonb, index, unique } from "drizzle-orm/pg-core"

/**
 * User profiles table (global settings)
 */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().unique(),
    username: text("username"), // Username from authentication provider (GitHub, etc)
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_profiles_user_id").on(table.userId),
    usernameIdx: index("idx_profiles_username").on(table.username),
    activeIdx: index("idx_profiles_active").on(table.isActive),
  })
)

/**
 * Essential configurations table (API keys, tokens, etc)
 * 
 * Sensitive data stored separately with restrictive RLS.
 * Frontend cannot read, only write (via API route using service_role).
 */
export const essentialConfigs = pgTable(
  "essential_configs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(), // FK to profiles.user_id
    plugin: text("plugin").notNull(), // 'github', 'lastfm', 'myanimelist', etc
    key: text("key").notNull(), // 'pat', 'apiKey', 'username', 'token', etc
    value: text("value").notNull(), // Configuration value (plain text for now)
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_essential_configs_user_id").on(table.userId),
    pluginKeyIdx: index("idx_essential_configs_plugin_key").on(table.plugin, table.key),
    userIdPluginKeyUnique: unique("idx_essential_configs_user_plugin_key_unique")
      .on(table.userId, table.plugin, table.key), // One value per (userId, plugin, key)
  })
)

/**
 * Generated SVGs table
 */
export const svgs = pgTable(
  "svgs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    style: text("style").notNull().default("default"),
    size: text("size").notNull().default("half"),
    theme: text("theme").default("default"), // Unified theme field (replaces terminalTheme and defaultTheme)
    hideTerminalEmojis: boolean("hide_terminal_emojis").default(false).notNull(),
    hideTerminalHeader: boolean("hide_terminal_header").default(false).notNull(),
    customCss: text("custom_css"),
    pluginsOrder: text("plugins_order"), // Order will be generated dynamically from PLUGINS_METADATA (null = alphabetical order)
    pluginsConfig: jsonb("plugins_config").notNull().default({}),
    storagePath: text("storage_path"),
    storageUrl: text("storage_url"),
    status: text("status").notNull().default("pending"),
    forceRegenerate: boolean("force_regenerate").default(false).notNull(),
    dataHash: text("data_hash"),
    lastGeneratedAt: timestamp("last_generated_at", { withTimezone: true }),
    nextGenerationAt: timestamp("next_generation_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_svgs_user_id").on(table.userId),
    slugIdx: index("idx_svgs_slug").on(table.slug),
    userIdSlugIdx: index("idx_svgs_user_id_slug").on(table.userId, table.slug),
    statusIdx: index("idx_svgs_status").on(table.status),
    forceRegenerateIdx: index("idx_svgs_force_regenerate").on(table.forceRegenerate),
    nextGenerationIdx: index("idx_svgs_next_generation").on(table.nextGenerationAt),
  })
)

/**
 * Templates table
 * 
 * Templates are saved SVG configurations that can be reused.
 * Created from existing SVGs in the dashboard.
 */
export const templates = pgTable(
  "templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    svgId: uuid("svg_id"), // Reference to the SVG this template is based on (optional)
    style: text("style").notNull().default("default"),
    size: text("size").notNull().default("half"),
    theme: text("theme").default("default"),
    hideTerminalEmojis: boolean("hide_terminal_emojis").default(false).notNull(),
    hideTerminalHeader: boolean("hide_terminal_header").default(false).notNull(),
    customCss: text("custom_css"),
    pluginsOrder: text("plugins_order"), // Order will be generated dynamically (null = alphabetical order)
    pluginsConfig: jsonb("plugins_config").notNull().default({}),
    isPublic: boolean("is_public").default(false).notNull(), // Whether template is publicly available
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_templates_user_id").on(table.userId),
    svgIdIdx: index("idx_templates_svg_id").on(table.svgId),
    publicIdx: index("idx_templates_public").on(table.isPublic),
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

/**
 * Template likes table
 * 
 * Users can like/unlike templates
 */
export const templateLikes = pgTable(
  "template_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    templateId: uuid("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_template_likes_user_id").on(table.userId),
    templateIdIdx: index("idx_template_likes_template_id").on(table.templateId),
    userTemplateUnique: unique("idx_template_likes_user_template_unique")
      .on(table.userId, table.templateId), // One like per user per template
  })
)

export type TemplateLike = typeof templateLikes.$inferSelect
export type NewTemplateLike = typeof templateLikes.$inferInsert


