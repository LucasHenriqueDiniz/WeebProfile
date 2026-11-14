/**
 * The wizard names an SVG after its plugins ("MyAnimeList Stats") and there is no
 * rename, so two cards of the same plugin came out with the same name, and the list
 * could only tell them apart by the end of the slug, which it truncates. A taken name
 * gets the first free number: "MyAnimeList Stats 2".
 *
 * Compared ignoring case: names generated before the display-name fix read
 * "Myanimelist Stats", and next to "MyAnimeList Stats" that is still the same name.
 *
 * `taken` must not include the SVG being saved: an edit regenerates the same name, and
 * counting the SVG's own name would rename it on every save.
 */
export function uniqueSvgName(name: string, taken: Iterable<string>): string {
  const names = new Set(Array.from(taken, (n) => n.toLowerCase()))
  if (!names.has(name.toLowerCase())) return name
  for (let n = 2; ; n++) {
    const candidate = `${name} ${n}`
    if (!names.has(candidate.toLowerCase())) return candidate
  }
}
