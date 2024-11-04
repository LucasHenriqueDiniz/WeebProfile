"use client"

import GithubBody from "components/GithubBody/GithubBody"
import GithubFooter from "components/GithubFooter/GithubFooter"
import GithubHeader from "components/GithubHeader/GithubHeader"
import ThemeHandler from "components/ThemeHandler"

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
