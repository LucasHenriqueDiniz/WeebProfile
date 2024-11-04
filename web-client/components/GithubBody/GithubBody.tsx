"use client"
import dynamic from "next/dynamic"
import { useState } from "react"
import "styles/default.css"
import "styles/fonts.css"
import "styles/half.css"
import "styles/main.css"
import "styles/terminal.css"
import useStore from "web-client/app/store"
import ActionsTab from "./ActionsTab"
import "./GithubBody.css"
import MarkdownTab from "./MarkdownTab"

const PreviewTab = dynamic(() => import("./PreviewTab"), { ssr: false })
const SidebarContainer = dynamic(() => import("../Sidebar/SidebarContainer"), { ssr: false })

const GithubBody = () => {
  const { githubUser } = useStore()
  const [selectedTab, setSelectedTab] = useState("preview")

  return (
    <div className="flex h-full flex-col">
      <div className="profile-container">
        <main className="profile-main flex flex-1">
          <div className="profile-left-side w-1/4 p-4">
            <SidebarContainer />
          </div>
          <div className="profile-right-side flex-1 p-4">
            <div className="tab-container flex justify-center space-x-4">
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
            <div className="readme-container flex flex-col">
              <div className="readme-header">
                {githubUser ?? "Username"}
                <span className="color-fg-muted">/</span>
                <span className="monospace">README</span>
                <span className="color-fg-muted">.md</span>
              </div>
              <div className="size-full flex-1">
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
