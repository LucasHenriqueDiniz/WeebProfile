"use client"

import GithubFooter from "components/GithubFooter/GithubFooter"
import GithubHeader from "components/GithubHeader/GithubHeader"
import ThemeHandler from "components/ThemeHandler"

export default function Web({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeHandler />
      <GithubHeader pluginSecton />
      <div className="flex-grow flex items-center justify-center overflow-y-auto w-full h-full">{children}</div>
      <GithubFooter />
    </>
  )
}
