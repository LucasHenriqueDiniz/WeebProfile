/**
 * Metadata do Plugin About
 *
 * Este arquivo define as seções, configurações e opções do plugin about.
 * É usado para gerar automaticamente o metadata.ts centralizado.
 *
 * NÃO edite metadata.ts manualmente - ele é gerado automaticamente a partir deste arquivo.
 *
 * Para atualizar:
 * 1. Edite este arquivo
 * 2. Execute: pnpm --filter @weeb/weeb-plugins run generate-metadata
 */

export const MAX_NEOFETCH_FIELDS = 10
export const MAX_LINKS = 8

export const aboutPluginMetadata = {
  displayName: "About me",
  description: "An intro in the style of neofetch and link badges, from what you type in. Nothing to connect",
  category: "profile" as const,
  icon: "IdCard",
  requiredFields: [],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "neofetch",
      name: "Neofetch intro",
      description: "Your picture next to a user@host title and the lines you write, like neofetch prints them",
      configOptions: [
        {
          key: "neofetch_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "",
          description: "Shown as user@host, like a terminal prompt",
          tooltip:
            "The part before the @ and the part after it are drawn in the theme's accent color. Without an @, the whole title is.",
        },
        {
          key: "neofetch_fields",
          label: "Lines",
          type: "object-array" as const,
          defaultValue: [],
          maxItems: MAX_NEOFETCH_FIELDS,
          description: `Up to ${MAX_NEOFETCH_FIELDS} lines of Label: value`,
          tooltip:
            "Each line is a label and its value, such as Location: Brazil or Stack: TypeScript · React. A value too long for the card ends in an ellipsis.",
          itemFields: [
            {
              key: "label",
              label: "Label",
              type: "string" as const,
              placeholder: "Location",
              required: true,
            },
            {
              key: "value",
              label: "Value",
              type: "string" as const,
              placeholder: "Brazil",
              required: true,
            },
          ],
        },
        {
          key: "neofetch_image",
          label: "Picture URL",
          type: "string" as const,
          defaultValue: "",
          description: "An https:// address of a PNG, JPEG or WebP image, up to 400 KB",
          tooltip:
            "The image is downloaded once per generation and embedded in the SVG, because a README cannot load images from inside an image. https://github.com/<you>.png works. Leave it empty for no picture.",
        },
        {
          key: "neofetch_show_palette",
          label: "Show color palette",
          type: "boolean" as const,
          defaultValue: true,
          tooltip: "A row of the card theme's colors under the lines, like the color blocks neofetch prints.",
        },
        {
          key: "neofetch_show_cursor",
          label: "Show prompt at the end",
          type: "boolean" as const,
          defaultValue: true,
          tooltip: "Terminal style only: a last prompt with a block cursor, which blinks when animations are on.",
        },
      ],
    },
    {
      id: "links",
      name: "Link badges",
      description: "A row of buttons for your site, profiles and email. Each one can also be its own image and link",
      configOptions: [
        {
          key: "links_items",
          label: "Links",
          type: "object-array" as const,
          defaultValue: [],
          maxItems: MAX_LINKS,
          description: `Up to ${MAX_LINKS} links. Only the address is required.`,
          tooltip:
            "An address can be a site (https://… or just example.com) or an email (you@example.com). The icon and the text are picked from the address unless you choose them.",
          itemFields: [
            {
              key: "url",
              label: "Address",
              type: "string" as const,
              placeholder: "https://my-site.dev or you@example.com",
              required: true,
            },
            {
              key: "label",
              label: "Text",
              type: "string" as const,
              placeholder: "LinkedIn",
              description: "Optional. Defaults to the site's name or domain.",
            },
            {
              key: "icon",
              label: "Icon",
              type: "select" as const,
              options: [
                { value: "auto", label: "From the address" },
                { value: "website", label: "Website" },
                { value: "email", label: "Email" },
                { value: "github", label: "GitHub" },
                { value: "linkedin", label: "LinkedIn" },
                { value: "x", label: "X (Twitter)" },
                { value: "bluesky", label: "Bluesky" },
                { value: "mastodon", label: "Mastodon" },
                { value: "youtube", label: "YouTube" },
                { value: "twitch", label: "Twitch" },
                { value: "discord", label: "Discord" },
                { value: "instagram", label: "Instagram" },
                { value: "devto", label: "DEV" },
                { value: "medium", label: "Medium" },
                { value: "kofi", label: "Ko-fi" },
                { value: "rss", label: "RSS" },
              ],
            },
          ],
        },
        {
          key: "links_brand_colors",
          label: "Brand colors",
          type: "boolean" as const,
          defaultValue: true,
          tooltip:
            "Icons of known sites in their brand color (LinkedIn blue, YouTube red…). Off, every icon takes the theme's accent color.",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    sections: ["neofetch", "links"],
    neofetch_title: "you@earth",
    neofetch_fields: [
      { label: "Location", value: "Brazil" },
      { label: "Stack", value: "TypeScript · React · Cloudflare" },
    ],
    links_items: [{ url: "https://my-site.dev" }, { url: "you@example.com" }],
  },
}
