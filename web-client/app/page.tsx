"use client"
// Find a way to make this not a client component, but something is using document so we need to ssr: false
import dynamic from "next/dynamic"

const GithubBody = dynamic(() => import("components/GithubBody/GithubBody"), { ssr: false })
const GithubHeader = dynamic(() => import("components/GithubHeader/GithubHeader"), { ssr: false })
const GithubFooter = dynamic(() => import("components/GithubFooter/GithubFooter"), { ssr: false })
const ThemeHandler = dynamic(() => import("components/ThemeHandler"), { ssr: false })

export default function Web() {
  return (
    <>
      <ThemeHandler />
      <GithubHeader />
      <GithubBody />
      <GithubFooter />
    </>
  )
}
