/**
 * World of Warcraft: Forever plugin metadata
 *
 * This file defines all sections, configurations and options for the plugin.
 * It's used to automatically generate the centralized metadata.ts.
 *
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 */

export const wowForeverPluginMetadata = {
  displayName: "WoW Forever",
  description:
    "Show your World of Warcraft: Forever character: gear, stats, professions, reputations, talents and more",
  category: "gaming" as const,
  icon: "Swords",
  // The character is public: name and surname, unique per region. The Battle.net client
  // that reads it belongs to the application, so nothing here is a user secret. The region
  // is optional: without it every region is searched.
  requiredFields: ["character"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "character",
      name: "Character",
      description: "Your character's render, level, race, class, guild and item level",
      configOptions: [
        {
          key: "character",
          label: "Character",
          type: "string" as const,
          defaultValue: "",
          placeholder: "Anduin Wrynn",
          description: "Name and surname, or the character's armory link (Blizzard's or wowforeverdata.com)",
          required: true,
          helpUrl: "https://worldofwarcraft.blizzard.com/en-us/forever/us/armory",
          tooltip:
            "Forever characters have no realm: the name and the surname identify one per region. Blizzard shows a character from level 10, after it logs out, and draws its picture some hours later.",
        },
        {
          key: "region",
          label: "Region",
          type: "select" as const,
          defaultValue: "auto",
          description:
            "The region the character plays in. Any region searches all four; Blizzard's armory link sets it on its own.",
          options: [
            { value: "auto", label: "Any region" },
            { value: "us", label: "Americas (US)" },
            { value: "eu", label: "Europe (EU)" },
            { value: "kr", label: "Korea (KR)" },
            { value: "tw", label: "Taiwan (TW)" },
          ],
        },
        {
          key: "character_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "character_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Character",
        },
        {
          key: "character_image",
          label: "Picture",
          type: "select" as const,
          defaultValue: "render",
          description: "The full-body render (about 300 KB in the card), the portrait (4 KB) or no picture",
          options: [
            { value: "render", label: "Full-body render" },
            { value: "avatar", label: "Portrait" },
            { value: "none", label: "None" },
          ],
        },
      ],
    },
    {
      id: "equipment",
      name: "Equipment",
      description: "The items the character wears, with their quality and item level",
      configOptions: [
        {
          key: "equipment_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "equipment_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Equipment",
        },
        {
          key: "equipment_max",
          label: "Maximum items",
          type: "number" as const,
          defaultValue: 17,
          min: 1,
          max: 17,
          description: "Items in slot order, from the head down to the weapons. Shirt, tabard and ammo are left out.",
        },
        {
          key: "equipment_show_icons",
          label: "Show item icons",
          type: "boolean" as const,
          defaultValue: true,
          description: "Each item's icon in a frame of its quality color (about 2 KB each)",
        },
      ],
    },
    {
      id: "stats",
      name: "Attributes",
      description: "Health, power, primary attributes and armor",
      configOptions: [
        {
          key: "stats_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "stats_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Attributes",
        },
      ],
    },
    {
      id: "journey",
      name: "Journey",
      description: "Lifetime numbers: kills, deaths, quests, dungeons, flight paths and more",
      configOptions: [
        {
          key: "journey_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "journey_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Journey",
        },
      ],
    },
    {
      id: "professions",
      name: "Professions",
      description: "Primary and secondary professions, with their skill",
      configOptions: [
        {
          key: "professions_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "professions_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Professions",
        },
      ],
    },
    {
      id: "reputations",
      name: "Reputations",
      description: "Standing with each faction, the highest first",
      configOptions: [
        {
          key: "reputations_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "reputations_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Reputations",
        },
        {
          key: "reputations_max",
          label: "Maximum factions",
          type: "number" as const,
          defaultValue: 6,
          min: 1,
          max: 15,
          description: "Highest standing first",
        },
      ],
    },
    {
      id: "talents",
      name: "Talents",
      description: "Points spent in each talent tree of the active specialization",
      configOptions: [
        {
          key: "talents_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "talents_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Talents",
        },
      ],
    },
    {
      id: "dungeons",
      name: "Dungeons",
      description: "Dungeon bosses defeated, and how many times",
      configOptions: [
        {
          key: "dungeons_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "dungeons_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Dungeons",
        },
        {
          key: "dungeons_max",
          label: "Maximum bosses",
          type: "number" as const,
          defaultValue: 8,
          min: 1,
          max: 20,
          description: "Most kills first",
        },
      ],
    },
    {
      id: "achievements",
      name: "Achievements",
      description: "The latest achievements, with their icon and date",
      configOptions: [
        {
          key: "achievements_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "achievements_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Achievements",
        },
        {
          key: "achievements_max",
          label: "Maximum achievements",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 10,
          description: "The latest first",
        },
      ],
    },
    {
      id: "collection",
      name: "Collection",
      description: "Mounts, pets and toys",
      configOptions: [
        {
          key: "collection_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "collection_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Collection",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    sections: ["character", "equipment", "stats"],
    character: "Anduin Wrynn",
  },
}
