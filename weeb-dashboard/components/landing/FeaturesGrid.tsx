"use client"

import { ArrowDown, BookMarked, Eye, KeyRound, RefreshCw, Zap } from "lucide-react"
import { Fragment } from "react"
import { FaGithub } from "react-icons/fa"
import { useTranslations } from "@/i18n/use-translations"
import { SECTION_PREVIEWS } from "@/lib/config/section-previews"
import { cn } from "@/lib/utils"
import { publicSvgUrl } from "@/lib/utils/svg-url"
import { Marker, SectionHeading } from "./SectionHeading"
import { STICKER, TILE, TONE, type Tone } from "./sticker"

// What the README line in the first card turns into.
const README_RESULT = { plugin: "github", section: "profile" } as const
const README_RESULT_SIZE = SECTION_PREVIEWS[README_RESULT.plugin]?.[README_RESULT.section]?.default

interface FeatureItem {
  title: string
  body: string
}

const REST_STYLE: Array<{ icon: typeof Zap; tone: Tone }> = [
  { icon: RefreshCw, tone: "cyan" },
  { icon: Eye, tone: "pink" },
  { icon: KeyRound, tone: "amber" },
  { icon: BookMarked, tone: "lime" },
  { icon: FaGithub as typeof Zap, tone: "violet" },
]

/**
 * Why it works this way. The first reason is shown, not told: the one line that goes in
 * the README and the card it becomes. The other five are a list beside it. As a grid of
 * six equal cards this section was 905px of boxes with two lines of text each.
 *
 * Side by side, the two columns are one block: the same height, and the list is padded
 * by the card's border and padding (2px + 24px) so its first title sits on the card's
 * first title and its last line on the card's last edge. The card's spare height goes
 * to the arrow between the line and the card it becomes.
 */
export function FeaturesGrid() {
  const t = useTranslations("landing.features")
  const items = (t.raw("items") as FeatureItem[]) ?? []
  const [first, ...rest] = items

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <SectionHeading
        kicker={t("kicker")}
        tone="lime"
        title={
          <>
            {t("title")} <Marker>{t("titleHighlight")}</Marker>
          </>
        }
      />
      <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {first && (
          <div className={cn(STICKER, "flex flex-col p-6")}>
            <div className="flex items-start gap-4">
              <span className={cn(TILE, TONE.violet)}>
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">{first.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{first.body}</p>
              </div>
            </div>
            <pre className="mt-5 whitespace-pre-wrap rounded-lg border-2 border-foreground bg-background px-4 py-3 font-mono text-xs leading-relaxed">
              <code className="[overflow-wrap:anywhere]">
                <span className="text-muted-foreground/70"># README.md</span>
                {"\n"}
                <span className="text-pink-500">![</span>
                <span className="text-foreground">WeebProfile</span>
                <span className="text-pink-500">](</span>
                {/* The address the dashboard gives, on whatever origin this is served from. */}
                <span className="text-cyan-600 dark:text-cyan-400">
                  {/* On a phone the address wraps after a slash, not inside a word. */}
                  {/* split("/") and the slash put back, not a lookbehind: (?<=…) throws a
                      SyntaxError before Safari 16.4, and Vite's default target still
                      includes safari14, so the whole landing would fail to render there. */}
                  {publicSvgUrl("<id>")
                    .split("/")
                    .map((part, index, parts) => (
                      <Fragment key={index}>
                        {index > 0 && <wbr />}
                        {index < parts.length - 1 ? `${part}/` : part}
                      </Fragment>
                    ))}
                </span>
                <span className="text-pink-500">)</span>
              </code>
            </pre>
            {/* The line turns into the card: a dashed lead that takes the card's spare height. */}
            <div aria-hidden className="flex min-h-14 flex-1 flex-col items-center py-2 text-foreground/40">
              <span className="w-0 flex-1 border-l-2 border-dashed border-current" />
              <ArrowDown className="-mt-1 h-5 w-5" strokeWidth={2.5} />
            </div>
            <p className="text-xs font-semibold text-muted-foreground">{t("rendersAs")}</p>
            <img
              src={`/previews/${README_RESULT.plugin}/default/${README_RESULT.section}.svg`}
              alt=""
              width={README_RESULT_SIZE?.[0]}
              height={README_RESULT_SIZE?.[1]}
              loading="lazy"
              className="mt-2 block h-auto w-full rounded-lg"
            />
          </div>
        )}
        <ul className="flex flex-col divide-y-2 divide-foreground/10 lg:py-[26px]">
          {rest.map((item, index) => {
            const style = REST_STYLE[index % REST_STYLE.length]!
            const Icon = style.icon
            return (
              <li key={item.title} className="flex flex-1 items-start gap-4 py-4 first:pt-0 last:pb-0">
                <span className={cn(TILE, TONE[style.tone])}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
