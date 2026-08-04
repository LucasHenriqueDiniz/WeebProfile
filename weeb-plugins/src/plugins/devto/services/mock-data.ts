import type { DevToData } from "../types"

export function getMockDevToData(): DevToData {
  return {
    profile: {
      username: "weebprofile",
      name: "Weeb Profile",
      summary: "Building SVG cards for GitHub profiles. TypeScript, Cloudflare Workers, too much anime.",
      location: "Brazil",
      joinedAt: "Mar 4, 2021",
      avatar:
        "https://media2.dev.to/dynamic/image/width=90,height=90,fit=cover/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/0/avatar.png",
    },
    recentArticles: [
      {
        id: 1,
        title: "Rendering React to SVG inside a Cloudflare Worker",
        url: "https://dev.to/weebprofile/rendering-react-to-svg",
        reactions: 184,
        comments: 23,
        readingTimeMinutes: 7,
        publishedAt: "2026-07-28T10:00:00Z",
        readablePublishDate: "Jul 28",
        tags: ["typescript", "cloudflare", "react"],
      },
      {
        id: 2,
        title: "Why your D1 migrations are lying to you",
        url: "https://dev.to/weebprofile/d1-migrations",
        reactions: 97,
        comments: 11,
        readingTimeMinutes: 5,
        publishedAt: "2026-07-14T10:00:00Z",
        readablePublishDate: "Jul 14",
        tags: ["database", "typescript"],
      },
      {
        id: 3,
        title: "Static height calculation, or: how to render SVG without a browser",
        url: "https://dev.to/weebprofile/static-height",
        reactions: 61,
        comments: 4,
        readingTimeMinutes: 9,
        publishedAt: "2026-06-30T10:00:00Z",
        readablePublishDate: "Jun 30",
        tags: ["react", "svg"],
      },
    ],
    topTags: [
      { name: "typescript", count: 2 },
      { name: "react", count: 2 },
      { name: "cloudflare", count: 1 },
      { name: "database", count: 1 },
      { name: "svg", count: 1 },
    ],
  }
}
