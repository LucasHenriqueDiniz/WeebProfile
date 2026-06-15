import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import SimpleLoading from "@/components/loading/SimpleLoading"
import ErrorScreen from "@/components/loading/ErrorScreen"

function Lazy(factory: () => Promise<{ default: React.ComponentType<any> }>) {
  const Comp = lazy(factory)
  return function LazyRoute() {
    return (
      <Suspense fallback={<SimpleLoading />}>
        <Comp />
      </Suspense>
    )
  }
}

// Pages
const HomePage = Lazy(() => import("./routes/home"))
const LoginPage = Lazy(() => import("./routes/login"))
const DashboardPage = Lazy(() => import("./routes/dashboard"))
const NewSvgPage = Lazy(() => import("./routes/dashboard.new"))
const SvgViewPage = Lazy(() => import("./routes/dashboard.$id"))
const EditSvgPage = Lazy(() => import("./routes/dashboard.$id.edit"))
const SettingsPage = Lazy(() => import("./routes/dashboard.settings"))
const TemplatesPage = Lazy(() => import("./routes/templates"))
const TemplateDetailPage = Lazy(() => import("./routes/templates.$id"))

// Root layout
const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <ErrorScreen title="404" message="A página que você está procurando não foi encontrada." showHomeButton />
  ),
  errorComponent: () => (
    <ErrorScreen title="ERRO" message="Algo deu errado. Tente novamente mais tarde." showHomeButton />
  ),
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
})

const newSvgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/new",
  component: NewSvgPage,
})

const svgViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/$id",
  component: SvgViewPage,
})

const editSvgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/$id/edit",
  component: EditSvgPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/settings",
  component: SettingsPage,
})

const templatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/templates",
  component: TemplatesPage,
})

const templateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/templates/$id",
  component: TemplateDetailPage,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  dashboardRoute,
  newSvgRoute,
  svgViewRoute,
  editSvgRoute,
  settingsRoute,
  templatesRoute,
  templateDetailRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
