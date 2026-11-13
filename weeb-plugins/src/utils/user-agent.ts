/**
 * Sent with every upstream API request. Dev.to and the Stack Exchange API answer 403
 * to a request without a User-Agent, and a Worker's fetch sends none: both plugins
 * failed for every user once they ran on the generator.
 */
export const USER_AGENT = "WeebProfile/1.0 (+https://weebprofile-dashboard.pages.dev)"
