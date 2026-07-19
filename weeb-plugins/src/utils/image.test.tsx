import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { ImageComponent } from "./image"

describe("ImageComponent", () => {
  it("never renders an empty src for a valid data URI", () => {
    const html = renderToStaticMarkup(
      <ImageComponent url64="data:image/jpeg;base64,AAAA" alt="test" width={75} height={120} />
    )
    expect(html).toContain('src="data:image/jpeg;base64,AAAA"')
    expect(html).not.toMatch(/src=""/)
  })

  it("renders a placeholder (never an empty src) when url64 is null", () => {
    const html = renderToStaticMarkup(<ImageComponent url64={null} alt="test" width={75} height={120} />)
    expect(html).not.toMatch(/src=""/)
    expect(html).not.toMatch(/src="null"/)
    expect(html).not.toMatch(/src="undefined"/)
    expect(html).toContain("data:image/svg+xml;base64,") // the real placeholder, not an empty attribute
  })

  it("renders a placeholder (never an empty src) when url64 is undefined", () => {
    const html = renderToStaticMarkup(<ImageComponent alt="test" width={75} height={120} />)
    expect(html).not.toMatch(/src=""/)
    expect(html).not.toMatch(/src="null"/)
    expect(html).not.toMatch(/src="undefined"/)
    expect(html).toContain("data:image/svg+xml;base64,")
  })

  it("renders a placeholder (never an empty src) when url64 is an empty string", () => {
    const html = renderToStaticMarkup(<ImageComponent url64="" alt="test" width={75} height={120} />)
    expect(html).not.toMatch(/src=""/)
    expect(html).toContain("data:image/svg+xml;base64,")
  })
})
