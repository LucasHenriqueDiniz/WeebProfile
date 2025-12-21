/**
 * Metadata do Plugin Stack Overflow
 */

export const stackoverflowPluginMetadata = {
  displayName: "Stack Overflow",
  description: "Show your Stack Overflow statistics and expertise",
  category: "coding" as const,
  icon: "Code",
  requiredFields: ["userId"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "reputation",
      name: "Reputation",
      description: "Display your reputation and recent change",
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
      description: "Display your badges (gold, silver, bronze)",
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
      description: "Display total answers and questions",
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
          defaultValue: "Stack Overflow Activity",
        },
        {
          key: "answers_questions_hide_questions",
          label: "Hide questions",
          type: "boolean" as const,
          defaultValue: false,
        },
      ],
    },
    {
      id: "tags_expertise",
      name: "Tags Expertise",
      description: "Display top tags by score",
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
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 tags",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    userId: "123456",
    sections: ["reputation", "badges", "answers_questions", "tags_expertise"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["reputation"],
    userId: "",
  },
  fieldDefaults: {
    userId: "123456",
  },
}


