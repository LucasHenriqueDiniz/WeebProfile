// Test script to verify template configuration parsing
const { buildPluginsConfigFromTemplate } = require('./components/templates/TemplateCard.tsx');

// Test data from the database
const testTemplates = [
  {
    id: "683fa912-a4b0-4c22-b0c3-386bb80ec414",
    name: "Weeb Profile",
    pluginsConfig: {
      "PLUGIN_GITHUB": true,
      "PLUGIN_MYANIMELIST": true,
      "PLUGIN_16PERSONALITIES": true,
      "PLUGIN_GITHUB_SECTIONS": "profile,stargazers",
      "PLUGIN_MYANIMELIST_SECTIONS": "anime_list,manga_list",
      "PLUGIN_16PERSONALITIES_SECTIONS": "personality"
    },
    pluginsOrder: "github,myanimelist,16personalities",
    platforms: ["GitHub", "MyAnimeList", "16Personalities"]
  },
  {
    id: "2e377ed8-3083-4e20-aac5-c1e9714b8faa",
    name: "Full Weeb Profile",
    pluginsConfig: {
      "github": { "enabled": true, "sections": ["profile", "activity", "repositories"] },
      "myanimelist": { "enabled": true, "sections": ["statistics", "anime_favorites", "manga_favorites"] },
      "16personalities": { "enabled": true, "sections": ["personality"] }
    },
    pluginsOrder: ["github", "myanimelist", "16personalities"],
    platforms: ["GitHub", "MyAnimeList", "16Personalities"]
  }
];

console.log('Testing template configuration parsing...\n');

testTemplates.forEach((template, index) => {
  console.log(`Template ${index + 1}: ${template.name}`);
  console.log('Original pluginsConfig:', JSON.stringify(template.pluginsConfig, null, 2));
  console.log('Original pluginsOrder:', template.pluginsOrder);
  
  try {
    const result = buildPluginsConfigFromTemplate(template);
    console.log('Parsed plugins:', JSON.stringify(result.plugins, null, 2));
    console.log('Parsed pluginsOrder:', result.pluginsOrder);
    console.log('✅ Success\n');
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('');
  }
});
