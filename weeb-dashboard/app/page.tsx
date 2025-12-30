"use client"

import { Header } from "@/components/layout/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { PlatformsSection } from "@/components/sections/PlatformsSection"
import { VisualWizardSection } from "@/components/sections/VisualWizardSection"
import { TemplatesGallery } from "@/components/sections/TemplatesGallery"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { ComparisonSection } from "@/components/sections/ComparisonSection"
import { CTASection } from "@/components/sections/CTASection"
import { SectionDivider } from "@/components/sections/SectionDivider"

// Inline homepage data types and data
interface HomepagePlatform {
  id: string
  name: string
  icon: string
  description: string
  color: string
  category: string | null
}

interface HomepageFeature {
  id: string
  title: string
  description: string
  steps: Array<{
    number: number
    title: string
    description: string
  }>
}

interface HomepageTemplate {
  id: string
  name: string
  description: string
  preview: string
  platforms: string[]
  style: string
  theme: string
}

interface HomepageHowItWorks {
  step: number
  title: string
  description: string
  icon: string
  codeExample?: string
}

interface HomepageComparison {
  title: string
  subtitle: string
  points: Array<{
    feature: string
    traditional: string
    weebprofile: string
  }>
}

interface HomepageKeyFeature {
  id: string
  title: string
  description: string
  icon: string
  highlight?: string
}

interface HomepageData {
  hero: {
    title: string
    subtitle: string
    ctaPrimary: {
      text: string
      href: string
    }
  }
  platforms: HomepagePlatform[]
  features: HomepageFeature[]
  templates: HomepageTemplate[]
  templatesGallery: {
    title: string
    subtitle: string
  }
  howItWorks: HomepageHowItWorks[]
  comparison: HomepageComparison
  keyFeatures: HomepageKeyFeature[]
  cta: {
    title: string
    description: string
    buttonText: string
    buttonHref: string
  }
}

const homepageData: HomepageData = {
  hero: {
    title: "One SVG to flex your entire nerd life",
    subtitle:
      "Visual builder for your GitHub, anime, games, books and music stats. No YAML, no Actions — just click, preview, embed.",
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
  ],
  features: [
    {
      id: "visual-wizard",
      title: "Have your dream README in seconds",
      description:
        "Our visual builder lets you create stunning profile cards without writing a single line of code. Pick plugins, customize layouts, and see changes in real-time.",
      steps: [
        {
          number: 1,
          title: "Pick your plugins",
          description: "GitHub, Steam, MAL, LastFM...",
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
  templatesGallery: {
    title: "Feeling lazy?",
    subtitle: "Pick a template and customize it to match your vibe",
  },
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
  keyFeatures: [
    {
      id: "visual-builder",
      title: "Visual Builder",
      description: "Create your profile card without writing any code. Just click, drag, and customize.",
      icon: "Layout",
      highlight: "No code required",
    },
    {
      id: "multi-platform",
      title: "Multi-Platform",
      description: "Connect GitHub, MyAnimeList, LastFM, Steam, Goodreads and more in one place.",
      icon: "Plug",
      highlight: "Unified stats",
    },
    {
      id: "real-time-preview",
      title: "Real-time Preview",
      description: "See exactly how your card will look before generating. No trial and error.",
      icon: "Eye",
      highlight: "Instant feedback",
    },
    {
      id: "fully-customizable",
      title: "Fully Customizable",
      description: "Choose from multiple themes, layouts, and styles. Make it truly yours.",
      icon: "Palette",
      highlight: "Your style",
    },
    {
      id: "permanent-urls",
      title: "Permanent URLs",
      description: "Your generated SVGs are hosted permanently. No GitHub Actions needed.",
      icon: "Link",
      highlight: "Always available",
    },
    {
      id: "secure",
      title: "Secure & Private",
      description:
        "Only our backend accesses your data. Your API keys and tokens are stored securely and never exposed.",
      icon: "Shield",
      highlight: "Your data safe",
    },
  ],
  cta: {
    title: "Ready to level up your profile?",
    description: "Create your first card in under 2 minutes. No installation, no YAML, no Actions.",
    buttonText: "Create Your Profile",
    buttonHref: "/login",
  },
}

export default function Home() {
  return (
    <div className="bg-background">
      <Header />
      <HeroSection {...homepageData.hero} />
      <SectionDivider variant="gradient" />
      <PlatformsSection />
      <SectionDivider />
      <HowItWorksSection items={homepageData.howItWorks} />
      <SectionDivider />
      <VisualWizardSection feature={homepageData.features[0]} />
      <SectionDivider />
      <TemplatesGallery 
        templates={homepageData.templates} 
        title={homepageData.templatesGallery.title}
        subtitle={homepageData.templatesGallery.subtitle}
        totalTemplatesCount={homepageData.templates.length}
      />
      <SectionDivider />
      <ComparisonSection features={homepageData.keyFeatures} />
      <SectionDivider variant="gradient" />
      <CTASection {...homepageData.cta} />
    </div>
  )
}
