/**
 * Stack Overflow Plugin Metadata
 *
 * This file defines all sections, configurations and options for the Stack Overflow plugin.
 * It's used to automatically generate the centralized metadata.ts.
 *
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 */

export const stackoverflowPluginMetadata = {
  displayName: "Stack Overflow",
  description: "Show your Stack Overflow reputation and activity statistics",
  category: "coding" as const,
  icon: "MessageSquareQuestion",
  requiredFields: ["userId"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "reputation",
      name: "Reputation",
      description: "Display your current reputation and reputation change",
      configOptions: [
        {
          key: "reputation_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "reputation_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Reputation",
        },
      ],
    },
    {
      id: "badges",
      name: "Badges",
      description: "Display your badge counts (gold, silver, bronze)",
      configOptions: [
        {
          key: "badges_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "badges_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Badges",
        },
      ],
    },
    {
      id: "answers_questions",
      name: "Answers & Questions",
      description: "Display your total answers and questions count",
      configOptions: [
        {
          key: "answers_questions_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "answers_questions_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Answers & Questions",
        },
        {
          key: "answers_questions_hide_questions",
          label: "Hide questions count",
          type: "boolean" as const,
          defaultValue: false,
          description: "Only show answers count",
        },
      ],
    },
    {
      id: "tags_expertise",
      name: "Tags Expertise",
      description: "Display your top tags by score",
      configOptions: [
        {
          key: "tags_expertise_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "tags_expertise_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Tags Expertise",
        },
        {
          key: "tags_expertise_max",
          label: "Maximum tags",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 tags",
          tooltip: "Maximum number of tags to display. Tags are ordered by score (highest score first).",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    userId: "123456",
    sections: ["reputation", "badges", "answers_questions"],
  },
}
