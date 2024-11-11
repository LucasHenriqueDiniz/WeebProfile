"use client"
import dynamic from "next/dynamic"
import { useState } from "react"
import useStore from "web-client/app/store"
import ActionsTab from "./ActionsTab"
import styles from "./GithubBody.module.css"
import MarkdownTab from "./MarkdownTab"

const PreviewTab = dynamic(() => import("./PreviewTab"), { ssr: false })
const SidebarContainer = dynamic(() => import("../Sidebar/SidebarContainer"), { ssr: false })

const GithubBody = () => {
  const { githubUser } = useStore()
  const [selectedTab, setSelectedTab] = useState("preview")

  return (
    <div className="flex h-full flex-col">
      <div className={styles.profileContainer}>
        <main className={styles.profileMain}>
          <div className={styles.profileLeftSide}>
            <SidebarContainer />
          </div>
          <div className={styles.profileRightSide}>
            <div className={styles.tabContainer}>
              <button
                className={`${styles.tab} ${selectedTab === "preview" ? styles.selected : ""}`}
                onClick={() => setSelectedTab("preview")}
              >
                Preview
              </button>
              <button
                className={`${styles.tab} ${selectedTab === "actions" ? styles.selected : ""}`}
                onClick={() => setSelectedTab("actions")}
              >
                Actions Code
              </button>
              <button
                className={`${styles.tab} ${selectedTab === "markdown" ? styles.selected : ""}`}
                onClick={() => setSelectedTab("markdown")}
              >
                Markdown Code
              </button>
            </div>
            <div className={styles.readmeContainer}>
              <div className={styles.readmeHeader}>
                {githubUser ?? "Username"}
                <span className={styles.colorFgMuted}>/</span>
                <span className={styles.monospace}>README</span>
                <span className={styles.colorFgMuted}>.md</span>
              </div>
              <div className="flex flex-col flex-1 w-full">
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
