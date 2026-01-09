import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/config'

export interface HeroSectionProps {
  title: string
  subtitle: string
  ctaPrimary: {
    text: string
    href: string
  }
}

export interface PlatformsSectionProps {
  badge: string
  title: string
  subtitle: string
  createPlugin: string
  createPluginLink: string
}

export interface HowItWorksItem {
  step: number
  title: string
  description: string
  icon: string
  bullets: string[]
  badge: string
  cta: {
    text: string
    href?: string
    action?: 'modal' | 'scroll' | 'navigate'
  }
}

export interface HowItWorksSectionProps {
  badge: string
  title: string
  subtitle: string
  items: HowItWorksItem[]
}

export interface HomepageTemplate {
  id: string
  name: string
  description: string
  preview: string
  platforms: string[]
  style: string
  theme: string
}

export interface TemplatesGalleryProps {
  title: string
  subtitle: string
  viewAll: string
  useTemplate: string
  exploreCount: string
  exploreSubtitle: string
}

export interface KeyFeature {
  id: string
  title: string
  description: string
  icon: string
  highlight?: string
}

export interface ComparisonSectionProps {
  title: string
  subtitle: string
  features: KeyFeature[]
}

export interface CTASectionProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
}

export interface HomepageContent {
  hero: HeroSectionProps
  platforms: PlatformsSectionProps
  howItWorks: HowItWorksSectionProps
  templatesGallery: TemplatesGalleryProps
  templates: HomepageTemplate[]
  comparison: ComparisonSectionProps
  cta: CTASectionProps
}

// Static template data (not translatable, same across locales)
const STATIC_TEMPLATES: Omit<HomepageTemplate, 'name' | 'description'>[] = [
  {
    id: 'dev-weeb',
    preview: '/placeholder.svg',
    platforms: ['GitHub', 'MyAnimeList'],
    style: 'terminal',
    theme: 'dark',
  },
  {
    id: 'gamer-status',
    preview: '/placeholder.svg',
    platforms: ['Steam'],
    style: 'default',
    theme: 'dark',
  },
  {
    id: 'bookworm',
    preview: '/placeholder.svg',
    platforms: ['Goodreads'],
    style: 'default',
    theme: 'light',
  },
  {
    id: 'music-junkie',
    preview: '/placeholder.svg',
    platforms: ['LastFM'],
    style: 'default',
    theme: 'dark',
  },
  {
    id: 'all-in-one',
    preview: '/placeholder.svg',
    platforms: ['GitHub', 'Steam', 'LastFM', 'MyAnimeList', 'Goodreads'],
    style: 'default',
    theme: 'dark',
  },
]

export async function getHomepageContent(locale: Locale): Promise<HomepageContent> {
  const t = await getTranslations('homepage')

  // Get templates with translations
  const templatesData = t.raw('templates') as Array<{ id: string; name: string; description: string }>
  const templates: HomepageTemplate[] = templatesData.map((tmpl) => {
    const staticData = STATIC_TEMPLATES.find((s) => s.id === tmpl.id)
    if (!staticData) {
      throw new Error(`Template ${tmpl.id} not found in static data`)
    }
    return {
      ...staticData,
      name: tmpl.name,
      description: tmpl.description,
    }
  })

  return {
    hero: {
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      ctaPrimary: {
        text: t('hero.ctaPrimary'),
        href: '/login',
      },
    },
    platforms: {
      badge: t('platforms.badge', { count: 0 }), // Will be replaced with actual count in component
      title: t('platforms.title'),
      subtitle: t('platforms.subtitle'),
      createPlugin: t('platforms.createPlugin'),
      createPluginLink: t('platforms.createPluginLink'),
    },
    howItWorks: {
      badge: t('howItWorks.badge'),
      title: t.raw('howItWorks.title').replace('{zero}', t('howItWorks.zero')),
      subtitle: t('howItWorks.subtitle'),
      items: (t.raw('howItWorks.steps') as Array<{
        step: number
        title: string
        description: string
        icon: string
        bullets: string[]
        badge: string
        cta: {
          text: string
          href?: string
          action?: 'modal' | 'scroll' | 'navigate'
        }
      }>).map((step) => ({
        ...step,
        bullets: step.bullets || [],
      })),
    },
    templatesGallery: {
      title: t('templatesGallery.title'),
      subtitle: t('templatesGallery.subtitle'),
      viewAll: t('templatesGallery.viewAll'),
      useTemplate: t('templatesGallery.useTemplate'),
      exploreCount: t('templatesGallery.exploreCount', { count: templates.length }),
      exploreSubtitle: t('templatesGallery.exploreSubtitle'),
    },
    templates,
    comparison: {
      title: t('comparison.title'),
      subtitle: t('comparison.subtitle'),
      features: t.raw('comparison.features') as KeyFeature[],
    },
    cta: {
      title: t('cta.title'),
      description: t('cta.description'),
      buttonText: t('cta.buttonText'),
      buttonHref: t('cta.buttonHref'),
    },
  }
}

