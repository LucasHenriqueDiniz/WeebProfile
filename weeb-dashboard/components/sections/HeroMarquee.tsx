"use client"

/**
 * HeroMarquee — duas colunas verticais de cards mock rolando em direções
 * opostas, usadas como visual do hero. Os cards são estáticos (mock data)
 * e usam tokens de tema, então funcionam em dark e light.
 */

function CalendarCells() {
  // Padrão fixo de células estilo contribution calendar (sem aleatoriedade
  // para não quebrar hidratação).
  const levels = [
    0, 2, 1, 3, 4, 0, 2, 1, 3, 4, 0, 2, 1, 3, 4, 0, 2, 1, 3, 4, 0, 2, 1, 3, 4, 0, 2, 1, 3, 4, 0, 2, 1, 3, 4, 0, 2, 1, 3,
    4, 0, 2, 1, 3, 4, 0, 2, 1, 3, 4, 0, 2, 1, 3, 4, 0,
  ]
  const colors = ["bg-muted", "bg-muted/60", "bg-emerald-900/70", "bg-emerald-600", "bg-emerald-400"]
  return (
    <div className="mt-3 grid grid-cols-[repeat(14,1fr)] gap-[3px]">
      {levels.map((l, i) => (
        <span key={i} className={`aspect-square rounded-[2px] ${colors[l]}`} />
      ))}
    </div>
  )
}

function CardShell({ children, terminal = false }: { children: React.ReactNode; terminal?: boolean }) {
  return (
    <div
      className={`mb-3.5 flex min-h-[186px] flex-col rounded-xl border border-border p-3.5 ${
        terminal ? "bg-background" : "bg-card"
      }`}
    >
      {children}
    </div>
  )
}

function TopArtistsCard() {
  const artists = [
    { name: "Seycara", plays: "208 plays" },
    { name: "Peppsen", plays: "75 plays" },
    { name: "Sabaton", plays: "41 plays" },
  ]
  return (
    <CardShell>
      <div className="font-heading text-xs font-bold text-foreground">Top Artists</div>
      <div className="mt-3 flex flex-col gap-2.5">
        {artists.map((a) => (
          <div key={a.name} className="flex items-center gap-2">
            <span className="block h-[30px] w-[30px] rounded-[5px] bg-muted" />
            <div>
              <div className="text-[11.5px] font-semibold text-foreground">{a.name}</div>
              <div className="text-[10px] text-muted-foreground">{a.plays}</div>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function CalendarCard() {
  return (
    <CardShell terminal>
      <div className="font-mono text-[10.5px] text-emerald-500">❯ weeb calendar</div>
      <CalendarCells />
      <div className="mt-auto pt-2.5 font-mono text-[10px] text-muted-foreground">1.284 commits · 12 meses</div>
    </CardShell>
  )
}

function SteamCard() {
  const games = [
    { name: "Dota 2", pct: "82%", color: "bg-violet-500" },
    { name: "Elden Ring", pct: "54%", color: "bg-pink-500" },
    { name: "Hades", pct: "31%", color: "bg-cyan-500" },
  ]
  return (
    <CardShell>
      <div className="font-heading text-xs font-bold text-foreground">Steam · Top Games</div>
      <div className="mt-3.5 flex flex-col gap-2.5">
        {games.map((g) => (
          <div key={g.name}>
            <div className="mb-1 text-[10.5px] font-medium text-muted-foreground">{g.name}</div>
            <div className="h-[7px] overflow-hidden rounded-full bg-muted">
              <span className={`block h-full ${g.color}`} style={{ width: g.pct }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-2.5 font-mono text-[10px] text-muted-foreground">1d 11h nas últimas 2 semanas</div>
    </CardShell>
  )
}

function DuolingoCard() {
  const rows = [
    ["Streak", "412"],
    ["Total XP", "38.2K"],
    ["Languages", "3"],
  ]
  return (
    <CardShell terminal>
      <div className="font-mono text-[10.5px] text-emerald-500">❯ weeb duolingo</div>
      <div className="mt-3 font-mono text-[11.5px] leading-loose text-muted-foreground">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span>{k}</span>
            <span className="text-foreground">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto font-mono text-[10px] text-muted-foreground">ja · es · de</div>
    </CardShell>
  )
}

function RepoCard() {
  return (
    <div className="mb-3.5 flex min-h-[186px] flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="h-1.5 bg-gradient-to-r from-[#3178c6] to-[#f1e05a]" />
      <div className="flex flex-1 flex-col p-3.5">
        <div className="font-mono text-[10.5px] text-muted-foreground">LucasHenriqueDiniz /</div>
        <div className="font-heading text-[15px] font-bold text-foreground">weebProfile</div>
        <div className="mt-2 text-[11px] leading-normal text-muted-foreground">
          SVG stat cards for your GitHub profile.
        </div>
        <div className="mt-auto flex gap-3.5 text-[11px] font-medium text-muted-foreground">
          <span>★ 128</span>
          <span>⑂ 24</span>
        </div>
      </div>
    </div>
  )
}

function AnimeCard() {
  return (
    <CardShell>
      <div className="font-heading text-xs font-bold text-foreground">Anime Favorites</div>
      <div className="mt-3 grid grid-cols-4 gap-[7px]">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="block aspect-[2/3] rounded bg-muted" />
        ))}
      </div>
      <div className="mt-auto pt-2.5 font-mono text-[10px] text-muted-foreground">360 títulos · 4.1K episódios</div>
    </CardShell>
  )
}

function CodeHabitsCard() {
  const bars = [
    { h: "40%", accent: false },
    { h: "70%", accent: false },
    { h: "52%", accent: false },
    { h: "96%", accent: true },
    { h: "64%", accent: false },
    { h: "30%", accent: false },
  ]
  return (
    <CardShell>
      <div className="font-heading text-xs font-bold text-foreground">Code Habits</div>
      <div className="mt-4 flex h-[78px] items-end gap-[5px]">
        {bars.map((b, i) => (
          <span
            key={i}
            className={`block flex-1 rounded-[3px] ${b.accent ? "bg-pink-500" : "bg-violet-500"}`}
            style={{ height: b.h }}
          />
        ))}
      </div>
      <div className="mt-auto pt-2.5 font-mono text-[10px] text-muted-foreground">pico às 23h</div>
    </CardShell>
  )
}

function Column({ down = false, children }: { down?: boolean; children: React.ReactNode }) {
  return (
    <div className="h-full w-[270px] overflow-hidden">
      <div className={`flex flex-col ${down ? "animate-hero-marquee-down" : "animate-hero-marquee-up"}`}>
        {/* duplicado para loop contínuo (a animação percorre 50%) */}
        {children}
        {children}
      </div>
    </div>
  )
}

export function HeroMarquee() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(760px,58%)] lg:block"
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex justify-end gap-[18px] pr-[60px] opacity-85">
        <Column>
          <TopArtistsCard />
          <CalendarCard />
          <SteamCard />
          <DuolingoCard />
        </Column>
        <Column down>
          <RepoCard />
          <AnimeCard />
          <CodeHabitsCard />
          <DuolingoCard />
        </Column>
      </div>
      {/* fades para o texto do hero e para o fim da seção */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
    </div>
  )
}
