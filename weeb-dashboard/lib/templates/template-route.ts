import { redirect } from "@tanstack/react-router"

/**
 * The wizard a template opens in. A template is a profile layout and only the profile
 * wizard reads `?template=`; the repository wizard has no templates.
 */
export const TEMPLATE_WIZARD_PATH = "/dashboard/new/profile"

/** Where "Use template" goes. */
export function templateWizardHref(templateId: string): string {
  return `${TEMPLATE_WIZARD_PATH}?${new URLSearchParams({ template: templateId })}`
}

/**
 * beforeLoad for /dashboard/new. With a template in the URL there is nothing left to
 * choose, and the chooser's cards link to the wizards without the query, so the
 * template was dropped on the way. Forwards straight to the profile wizard with the
 * whole query, which also covers links and post-login returns that still point here.
 */
export function forwardTemplateToWizard({ search }: { search: Record<string, unknown> }): void {
  if (search.template === undefined || search.template === "") return
  throw redirect({ to: TEMPLATE_WIZARD_PATH, search, replace: true })
}
