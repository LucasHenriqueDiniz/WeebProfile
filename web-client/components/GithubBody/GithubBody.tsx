"use client"
import { useEffect, useState } from "react"
import "styles/default.css"
import "styles/fonts.css"
import "styles/half.css"
import "styles/main.css"
import "styles/terminal.css"
import useStore from "web-client/app/store"
import SidebarContainer from "../Sidebar/SidebarContainer"
import ActionsTab from "./ActionsTab"
import "./githubBody.css"
import MarkdownTab from "./MarkdownTab"
import PreviewTab from "./PreviewTab"

const GithubBody = () => {
  const { githubUser, theme, changeTheme } = useStore()
  const [selectedTab, setSelectedTab] = useState("preview")

  useEffect(() => {
    console.log("theme", theme)
    const htmLTheme = document.querySelector("html")?.getAttribute("data-theme")
    if (!htmLTheme) {
      changeTheme(theme)
    }
  }, [changeTheme, theme])

  return (
    <div className='flex h-full flex-col'>
      <div className='profile-container'>
        <main className='profile-main flex flex-1'>
          <div className='profile-left-side w-1/4 p-4'>
            <SidebarContainer />
          </div>
          <div className='profile-right-side flex-1 p-4'>
            <div className='tab-container flex justify-center space-x-4'>
              <button
                className={`tab ${selectedTab === "preview" ? "selected" : ""}`}
                onClick={() => setSelectedTab("preview")}
              >
                Preview
              </button>
              <button
                className={`tab ${selectedTab === "actions" ? "selected" : ""}`}
                onClick={() => setSelectedTab("actions")}
              >
                Actions Code
              </button>
              <button
                className={`tab ${selectedTab === "markdown" ? "selected" : ""}`}
                onClick={() => setSelectedTab("markdown")}
              >
                Markdown Code
              </button>
            </div>
            <div className='readme-container flex flex-col'>
              <div className='readme-header'>
                {githubUser ?? "Username"}
                <span className='color-fg-muted'>/</span>
                <span className='monospace'>README</span>
                <span className='color-fg-muted'>.md</span>
              </div>
              <div className='size-full flex-1'>
                {selectedTab === "actions" && <ActionsTab />}
                {selectedTab === "preview" && <PreviewTab />}
                {selectedTab === "markdown" && <MarkdownTab />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default GithubBody
