/**
 * 16personalities Plugin Metadata
 * 
 * This file defines all sections, configurations and options for the plugin.
 * It's used to automatically generate the centralized metadata.ts.
 */

// Personality types mapping
const PERSONALITY_TYPES = [
  { value: 'ENFJ', label: 'ENFJ - Protagonist' },
  { value: 'ENFP', label: 'ENFP - Campaigner' },
  { value: 'ENTJ', label: 'ENTJ - Commander' },
  { value: 'ENTP', label: 'ENTP - Debater' },
  { value: 'ESFJ', label: 'ESFJ - Consul' },
  { value: 'ESFP', label: 'ESFP - Entertainer' },
  { value: 'ESTJ', label: 'ESTJ - Executive' },
  { value: 'ESTP', label: 'ESTP - Entrepreneur' },
  { value: 'INFJ', label: 'INFJ - Advocate' },
  { value: 'INFP', label: 'INFP - Mediator' },
  { value: 'INTJ', label: 'INTJ - Architect' },
  { value: 'INTP', label: 'INTP - Thinker' },
  { value: 'ISFJ', label: 'ISFJ - Protector' },
  { value: 'ISFP', label: 'ISFP - Adventurer' },
  { value: 'ISTJ', label: 'ISTJ - Logistician' },
  { value: 'ISTP', label: 'ISTP - Virtuoso' },
] as const

export const personality16PluginMetadata = {
  displayName: "16Personalities",
  description: "Display your 16Personalities type with emoji and link",
  category: "coding" as const,
  icon: "UserCircle", // lucide-react icon
  requiredFields: ["personality_url"],
  essentialConfigKeys: [], // No API key needed
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "personality",
      name: "Personality",
      description: "Display your 16Personalities personality type",
      configOptions: [
        {
          key: "personality_url",
          label: "Result URL",
          type: "string" as const,
          defaultValue: "",
          placeholder: "https://www.16personalities.com/br/resultados/enfj-t/m/...",
          description: "Paste your 16Personalities test result URL to automatically detect your type",
          required: true,
        },
        {
          key: "personality_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "personality_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Personality",
        },
        {
          key: "personality_show_description",
          label: "Show description",
          type: "boolean" as const,
          defaultValue: true,
          description: "Show a short description of the personality type",
        },
        {
          key: "personality_show_link",
          label: "Show link",
          type: "boolean" as const,
          defaultValue: true,
          description: "Show link to the personality type page on 16Personalities",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    sections: ["personality"],
    personality_url: "https://www.16personalities.com/br/resultados/enfj-t/m/example",
  },
  defaultConfig: {
    enabled: false,
    sections: ["personality"],
    personality_url: "",
  },
  fieldDefaults: {},
}
