/**
 * Metadata do Plugin Websites
 *
 * Este arquivo define as seções, configurações e opções do plugin websites.
 * É usado para gerar automaticamente o metadata.ts centralizado.
 *
 * NÃO edite metadata.ts manualmente - ele é gerado automaticamente a partir deste arquivo.
 *
 * Para atualizar:
 * 1. Edite este arquivo
 * 2. Execute: pnpm --filter @weeb/weeb-plugins run generate-metadata
 */

export const MAX_WEBSITES = 12

export const websitesPluginMetadata = {
  displayName: "Websites",
  description: "Showcase your own websites, with thumbnails pulled from each page",
  category: "coding" as const,
  icon: "Globe",
  requiredFields: [],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "websites",
      name: "Websites",
      description: "A showcase of the websites you add, with page thumbnail, title and description",
      configOptions: [
        {
          key: "websites_items",
          label: "Websites",
          type: "object-array" as const,
          defaultValue: [],
          maxItems: MAX_WEBSITES,
          description: "The websites to show. Only the URL is required.",
          tooltip:
            "Add one entry per website. Title, description and image are filled in automatically from the page's Open Graph tags when 'Fill in from the page' is on — anything you type here wins over what is detected.",
          itemFields: [
            {
              key: "url",
              label: "URL",
              type: "string" as const,
              placeholder: "https://my-portfolio.dev",
              required: true,
              description: "Must be an https:// address",
            },
            {
              key: "title",
              label: "Title",
              type: "string" as const,
              placeholder: "My Portfolio",
            },
            {
              key: "description",
              label: "Description",
              type: "string" as const,
              placeholder: "Personal site built with Astro",
            },
            {
              key: "image",
              label: "Thumbnail URL",
              type: "string" as const,
              placeholder: "https://my-portfolio.dev/preview.png",
              description: "Optional. Overrides the thumbnail detected on the page.",
            },
          ],
        },
        {
          key: "websites_variant",
          label: "Style",
          type: "select" as const,
          defaultValue: "grid",
          description: "Choose how the websites are laid out",
          options: [
            { value: "grid", label: "Grid (cards with a big thumbnail)" },
            { value: "list", label: "List (compact rows with favicon)" },
            { value: "featured", label: "Featured (first site highlighted, rest as a list)" },
          ],
        },
        {
          key: "websites_max",
          label: "Maximum websites",
          type: "number" as const,
          defaultValue: 6,
          min: 1,
          max: MAX_WEBSITES,
          step: 1,
          description: `Maximum ${MAX_WEBSITES} websites`,
          tooltip: "Websites beyond this limit are not fetched or displayed.",
        },
        {
          key: "websites_autofill",
          label: "Fill in from the page",
          type: "boolean" as const,
          defaultValue: true,
          description: "Read title, description and thumbnail from each page's Open Graph tags",
          tooltip:
            "Turn this off to use only what you typed. With it on, each website is fetched once per generation to read its <meta> tags — that makes generation slower and depends on the site being reachable.",
        },
        {
          key: "websites_show_thumbnail",
          label: "Show thumbnail",
          type: "boolean" as const,
          defaultValue: true,
          tooltip: "When off, the Grid and Featured styles fall back to a favicon-only layout.",
        },
        {
          key: "websites_show_description",
          label: "Show description",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "websites_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "websites_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Websites",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    sections: ["websites"],
    websites_items: [{ url: "https://weebprofile.pages.dev" }, { url: "https://github.com", title: "GitHub" }],
    websites_variant: "grid",
  },
}
