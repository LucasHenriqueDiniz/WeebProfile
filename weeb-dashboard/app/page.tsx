"use client"

import { HeroSection } from "@/components/sections/HeroSection"
import { PlatformsSection } from "@/components/sections/PlatformsSection"
import { VisualWizardSection } from "@/components/sections/VisualWizardSection"
import { TemplatesGallery } from "@/components/sections/TemplatesGallery"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { ComparisonSection } from "@/components/sections/ComparisonSection"
import { CTASection } from "@/components/sections/CTASection"

// Dados hardcoded para a homepage
const homepageData = {
  hero: {
    title: "One SVG to flex your entire nerd life",
    subtitle: "Visual builder for your GitHub, anime, games, books and music stats. No YAML, no Actions — just click, preview, embed.",
    ctaPrimary: {
      text: "Start for free",
      href: "/login",
    },
  },
  platforms: [
    {
      id: "github",
      name: "GitHub",
      icon: "Github",
      description: "Code & contributions",
      color: "#181717",
      category: "coding",
    },
    {
      id: "steam",
      name: "Steam",
      icon: "Gamepad2",
      description: "Games & hours",
      color: "#1b2838",
      category: "gaming",
    },
    {
      id: "lastfm",
      name: "LastFM",
      icon: "Music",
      description: "Music stats",
      color: "#d51007",
      category: "music",
    },
    {
      id: "myanimelist",
      name: "MyAnimeList",
      icon: "Tv",
      description: "Anime & manga",
      color: "#2e51a2",
      category: "anime",
    },
    {
      id: "goodreads",
      name: "Goodreads",
      icon: "BookOpen",
      description: "Books & reading",
      color: "#382110",
      category: "reading",
    },
    {
      id: "coming-soon",
      name: "+ More",
      icon: "Plus",
      description: "Coming soon",
      color: "#6b7280",
      category: null,
    },
  ],
  features: [
    {
      id: "visual-wizard",
      title: "No YAML. No Actions. Just a visual builder.",
      description: "Pick your plugins, choose a layout, customize theme, and see real-time preview before generating the final SVG.",
      steps: [
        {
          number: 1,
          title: "Pick your plugins",
          description: "GitHub, Steam, MAL, LastFM, Goodreads...",
        },
        {
          number: 2,
          title: "Choose a layout",
          description: "Default, compact, terminal, vertical, banner...",
        },
        {
          number: 3,
          title: "Customize theme",
          description: "Fonts, colors, accent, light/dark.",
        },
        {
          number: 4,
          title: "See real-time preview",
          description: "Before generating the final SVG.",
        },
      ],
    },
  ],
  templates: [
    {
      id: "dev-weeb",
      name: "Dev + Weeb",
      description: "GitHub + MAL, terminal style",
      preview: "/placeholder.svg",
      platforms: ["GitHub", "MyAnimeList"],
      style: "terminal",
      theme: "dark",
    },
    {
      id: "gamer-status",
      name: "Gamer Status",
      description: "Steam focus, dark theme",
      preview: "/placeholder.svg",
      platforms: ["Steam"],
      style: "default",
      theme: "dark",
    },
    {
      id: "bookworm",
      name: "Bookworm",
      description: "Goodreads + minimal, clean",
      preview: "/placeholder.svg",
      platforms: ["Goodreads"],
      style: "default",
      theme: "light",
    },
    {
      id: "music-junkie",
      name: "Music Junkie",
      description: "LastFM now playing + top artists",
      preview: "/placeholder.svg",
      platforms: ["LastFM"],
      style: "default",
      theme: "dark",
    },
    {
      id: "all-in-one",
      name: "All-in-One",
      description: "Everything combined",
      preview: "/placeholder.svg",
      platforms: ["GitHub", "Steam", "LastFM", "MyAnimeList", "Goodreads"],
      style: "default",
      theme: "dark",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Clean, single platform",
      preview: "/placeholder.svg",
      platforms: ["GitHub"],
      style: "default",
      theme: "light",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Connect",
      description: "Sign in with GitHub and connect the platforms you want.",
      icon: "Link",
    },
    {
      step: 2,
      title: "Customize",
      description: "Pick plugins, layout, theme and what to show.",
      icon: "Palette",
    },
    {
      step: 3,
      title: "Embed",
      description: "Copy the SVG URL or Markdown snippet and paste it into your README, blog or portfolio.",
      icon: "Code",
      codeExample: "![My nerd life stats](https://cdn.weebprofile.com/u/username/main.svg)",
    },
  ],
  comparison: {
    title: "Why WeebProfile?",
    subtitle: "Compared to classic GitHub profile metrics tools...",
    points: [
      {
        feature: "Setup",
        traditional: "Manual YAML",
        weebprofile: "Visual wizard",
      },
      {
        feature: "Platform support",
        traditional: "GitHub only",
        weebprofile: "Multi-platform",
      },
      {
        feature: "Preview",
        traditional: "Trial-and-error",
        weebprofile: "Real-time preview",
      },
      {
        feature: "Customization",
        traditional: "Basic customization",
        weebprofile: "Template system",
      },
      {
        feature: "Storage",
        traditional: "GitHub Actions dependency",
        weebprofile: "Permanent URLs (Supabase-backed)",
      },
    ],
  },
  cta: {
    title: "Ready to level up your profile?",
    description: "Create your first card in under 2 minutes. No installation, no YAML, no Actions.",
    buttonText: "Create Your Profile",
    buttonHref: "/login",
    note: "Free for up to 3 active cards per account",
  },
}

export default function Home() {
  return (
    <div className="bg-background">
      <HeroSection {...homepageData.hero} />
      <PlatformsSection platforms={homepageData.platforms} />
      <VisualWizardSection feature={homepageData.features[0]} />
      <TemplatesGallery templates={homepageData.templates} />
      <HowItWorksSection items={homepageData.howItWorks} />
      <ComparisonSection comparison={homepageData.comparison} />
      <CTASection {...homepageData.cta} />
    </div>
  )
}
