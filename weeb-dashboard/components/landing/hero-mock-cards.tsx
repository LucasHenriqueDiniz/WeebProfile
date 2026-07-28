/**
 * Decorative miniature plugin cards for the landing hero marquee.
 * Purely visual (fake data) — always rendered with aria-hidden by the hero.
 */

const CALENDAR_CELLS = [
  1, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 2,
  4, 1, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1,
]

const CELL_COLORS = ["bg-muted", "bg-emerald-800/70", "bg-card", "bg-emerald-950", "bg-emerald-500"]

function MiniCard({ children, terminal = false }: { children: React.ReactNode; terminal?: boolean }) {
  return (
    <div
      className={`mb-3.5 flex min-h-[186px] flex-col rounded-xl border border-border p-3.5 ${
        terminal ? "bg-[#010409]" : "bg-card"
      }`}
    >
      {children}
    </div>
  )
}

export function MockTopArtists() {
  const artists = [
    { name: "Seycara", plays: "208 plays" },
    { name: "Peppsen", plays: "75 plays" },
    { name: "Sabaton", plays: "41 plays" },
  ]
  return (
    <MiniCard>
      <div className="font-heading text-xs font-bold text-foreground">Top Artists</div>
      <div className="mt-3 flex flex-col gap-2.5">
        {artists.map((a) => (
          <div key={a.name} className="flex items-center gap-2">
            <span className="block h-[30px] w-[30px] rounded bg-muted" />
            <div>
              <div className="text-[11.5px] font-semibold text-foreground">{a.name}</div>
              <div className="text-[10px] text-muted-foreground">{a.plays}</div>
            </div>
          </div>
        ))}
      </div>
    </MiniCard>
  )
}

export function MockTerminalCalendar() {
  return (
    <MiniCard terminal>
      <div className="font-mono text-[10.5px] text-emerald-400">❯ weeb calendar</div>
      <div className="mt-3 grid grid-cols-[repeat(14,1fr)] gap-[3px]">
        {CALENDAR_CELLS.map((c, i) => (
          <span key={i} className={`aspect-square rounded-[2px] ${CELL_COLORS[c]}`} />
        ))}
      </div>
      <div className="mt-auto pt-2.5 font-mono text-[10px] text-muted-foreground/70">1,284 commits · 12 mo</div>
    </MiniCard>
  )
}

export function MockSteamGames() {
  const games = [
    { name: "Dota 2", width: "82%", color: "bg-violet-500" },
    { name: "Elden Ring", width: "54%", color: "bg-pink-500" },
    { name: "Hades", width: "31%", color: "bg-cyan-500" },
  ]
  return (
    <MiniCard>
      <div className="font-heading text-xs font-bold text-foreground">Steam · Top Games</div>
      <div className="mt-3.5 flex flex-col gap-2.5">
        {games.map((g) => (
          <div key={g.name}>
            <div className="mb-1 text-[10.5px] font-medium text-muted-foreground">{g.name}</div>
            <div className="h-[7px] overflow-hidden rounded-full bg-muted">
              <span className={`block h-full ${g.color}`} style={{ width: g.width }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-2.5 font-mono text-[10px] text-muted-foreground/70">1d 11h · last 2 weeks</div>
    </MiniCard>
  )
}

export function MockTerminalStats({
  command,
  rows,
  footer,
}: {
  command: string
  rows: Array<[string, string]>
  footer: string
}) {
  return (
    <MiniCard terminal>
      <div className="font-mono text-[10.5px] text-emerald-400">❯ {command}</div>
      <div className="mt-3 font-mono text-[11.5px] leading-loose text-[#c9d1d9]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span>{k}</span>
            <span className="text-white">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto font-mono text-[10px] text-muted-foreground/70">{footer}</div>
    </MiniCard>
  )
}

export function MockRepoCard() {
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

export function MockAnimeFavorites() {
  return (
    <MiniCard>
      <div className="font-heading text-xs font-bold text-foreground">Anime Favorites</div>
      <div className="mt-3 grid grid-cols-4 gap-[7px]">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="block aspect-[2/3] rounded bg-muted" />
        ))}
      </div>
      <div className="mt-auto pt-2.5 font-mono text-[10px] text-muted-foreground/70">360 titles · 4.1K episodes</div>
    </MiniCard>
  )
}

export function MockCodeHabits() {
  const bars = [
    { h: "40%", hot: false },
    { h: "70%", hot: false },
    { h: "52%", hot: false },
    { h: "96%", hot: true },
    { h: "64%", hot: false },
    { h: "30%", hot: false },
  ]
  return (
    <MiniCard>
      <div className="font-heading text-xs font-bold text-foreground">Code Habits</div>
      <div className="mt-4 flex h-[78px] items-end gap-[5px]">
        {bars.map((b, i) => (
          <span
            key={i}
            className={`block flex-1 rounded-[3px] ${b.hot ? "bg-pink-500" : "bg-violet-500"}`}
            style={{ height: b.h }}
          />
        ))}
      </div>
      <div className="mt-auto pt-2.5 font-mono text-[10px] text-muted-foreground/70">peak at 11pm</div>
    </MiniCard>
  )
}
