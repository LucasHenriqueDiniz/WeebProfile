import { Metadata } from "next"
import React from "react"

import GithubBody from "components/GithubBody/GithubBody"
import GithubFooter from "components/GithubFooter/GithubFooter"
import GithubHeader from "components/GithubHeader/GithubHeader"

export const metadata: Metadata = {
  title: "Weeb Profile",
  description: "Create a beautiful profile README for your GitHub profile using the Weeb Profile generator.",
  keywords: ["weeb", "profile", "github", "readme", "generator", "anime", "manga", "japanese", "culture", "otaku"],
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://github.com/LucasHenriqueDiniz/WeebProfile",
    type: "website",
    title: "Weeb Profile",
    description: "Create a beautiful profile README for your GitHub profile using the Weeb Profile generator.",
    siteName: "Weeb Profile",
    images: [
      {
        width: 959,
        height: 890,
        url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-banner.png",
      },
    ],
  },
  authors: [{ name: "Lucas Henrique Diniz Ostroski", url: "https://github.com/LucasHenriqueDiniz" }],
}

export default function Web() {
  return (
    <>
      <GithubHeader />
      <GithubBody />
      <GithubFooter />
    </>
  )
}
