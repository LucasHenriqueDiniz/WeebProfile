/**
 * The wizard names an SVG after its plugins ("MyAnimeList Stats") and there is no
 * rename, so two cards of the same plugin came out with the same name, and the list
 * could only tell them apart by the end of the slug, which it truncates. A taken name
 * gets the first free number: "MyAnimeList Stats 2".
 *
 * `taken` must not include the SVG being saved: an edit regenerates the same name, and
 * counting the SVG's own name would rename it on every save.
 */
export function uniqueSvgName(name: string, taken: Iterable<string>): string {
  const names = new Set(taken)
  if (!names.has(name)) return name
  for (let n = 2; ; n++) {
    const candidate = `${name} ${n}`
    if (!names.has(candidate)) return candidate
  }
}
