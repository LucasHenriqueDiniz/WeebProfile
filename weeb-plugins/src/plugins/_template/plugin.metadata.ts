/**
 * PLUGIN_NAME Plugin Metadata
 * 
 * This file defines all sections, configurations and options for the plugin.
 * It's used to automatically generate the centralized metadata.ts.
 * 
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 * 
 * To add new sections:
 * 1. Add the section here in sections[]
 * 2. Run: pnpm generate-metadata
 * 3. metadata.ts will be updated automatically
 */

export const PLUGIN_NAMEPluginMetadata = {
  displayName: "PLUGIN_NAME",
  description: "PLUGIN_NAME plugin description",
  category: "coding" as const, // "coding" | "music" | "anime" | "gaming"
  icon: "IconName", // lucide-react icon name (e.g., "Github", "Music", "BookOpen")
  requiredFields: ["username"], // Required fields
  essentialConfigKeys: ["apiKey"], // Essential config keys (API keys, tokens, etc)
  essentialConfigKeysMetadata: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password" as const, // "text" | "password"
      placeholder: "your-api-key",
      description: "API key description",
      helpUrl: "https://example.com/api-keys", // URL to create/get the key
      docKey: "pluginname.apiKey", // Key for future documentation
    },
  ],
  sections: [
    {
      id: "section_id",
      name: "Section Name",
      description: "Section description",
      configOptions: [
        {
          key: "section_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "section_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Default Title",
        },
        {
          key: "section_max",
          label: "Max items",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 items",
        },
        // Select example
        // {
        //   key: "section_style",
        //   label: "Style",
        //   type: "select" as const,
        //   defaultValue: "default",
        //   options: [
        //     { value: "default", label: "Default" },
        //     { value: "list", label: "List" },
        //   ],
        // },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "example",
    sections: ["section_id"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["section_id"],
    username: "",
  },
  fieldDefaults: {
    username: "example",
  },
}
