import { createMemoryHistory, createRootRoute, createRoute, createRouter } from "@tanstack/react-router"
import { describe, expect, it } from "vitest"
import { forwardTemplateToWizard, templateWizardHref } from "./template-route"

/** The two routes involved, wired the way src/router.tsx wires them, on a memory history. */
async function load(url: string) {
  const root = createRootRoute()
  const chooser = createRoute({
    getParentRoute: () => root,
    path: "/dashboard/new",
    beforeLoad: forwardTemplateToWizard,
  })
  const profileWizard = createRoute({ getParentRoute: () => root, path: "/dashboard/new/profile" })
  const router = createRouter({
    routeTree: root.addChildren([chooser, profileWizard]),
    history: createMemoryHistory({ initialEntries: [url] }),
  })
  await router.load()
  return router
}

/**
 * Where the browser ends up. In the browser the router follows a beforeLoad redirect
 * by itself; under Node, router-core resolves as a server and only records it, so
 * follow the recorded one here.
 */
async function land(url: string) {
  let router = await load(url)
  for (let hops = 0; router.state.redirect && hops < 3; hops++) {
    router = await load(router.state.redirect.options.href!)
  }
  return router.state.location
}

describe("?template= on the way to the wizard", () => {
  it("/dashboard/new with a template lands in the profile wizard with the template", async () => {
    const location = await land("/dashboard/new?template=24631805e9b581180f00b670638a0fe3")
    expect(location.pathname).toBe("/dashboard/new/profile")
    expect(new URLSearchParams(location.searchStr).get("template")).toBe("24631805e9b581180f00b670638a0fe3")
  })

  it("keeps the rest of the query", async () => {
    const location = await land("/dashboard/new?template=abc&ref=gallery")
    expect(location.pathname).toBe("/dashboard/new/profile")
    expect(location.search).toEqual({ template: "abc", ref: "gallery" })
  })

  it("/dashboard/new without a template stays on the chooser", async () => {
    expect((await land("/dashboard/new")).pathname).toBe("/dashboard/new")
    expect((await land("/dashboard/new?template=")).pathname).toBe("/dashboard/new")
  })

  it("the Use template link goes straight to the profile wizard", async () => {
    const location = await land(templateWizardHref("24631805e9b581180f00b670638a0fe3"))
    expect(location.pathname).toBe("/dashboard/new/profile")
    expect(location.search).toEqual({ template: "24631805e9b581180f00b670638a0fe3" })
  })
})
