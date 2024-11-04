"use client"
import useStore from "app/store"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { FaDev, FaLanguage } from "react-icons/fa"
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md"
import { icon, weebProfile } from "web-client/public"
import { useToast } from "web-client/app/ToastProvider"
import Button from "../Button/Button"
import JsonCodeBlock from "../CodeBlock/JsonCodeBlock"
import DialogBox from "../DialogBox/DialogBox"
import DropdownMenuComp from "./DropdownMenu/DropdownMenu"
import "./GithubHeader.css"

const DevtoolsHeader = ({ open }: { open: boolean }) => {
  const { changeTheme, theme, resetConfig, resetData, pluginsData, pluginsConfig } = useStore()
  const invertedTheme = theme === "light" ? "dark" : "light"
  const { sendToast } = useToast()
  const DEV_HEADER_ITEMS = [
    {
      title: "Reset Data",
      description: "This will reset the data",
      onClick: () => {
        resetData()
        sendToast({ title: "Data Reset", description: "The data has been reset" })
      },
      type: "button",
    },
    {
      title: "Reset Config",
      description: "This will reset the config",
      onClick: () => {
        resetConfig()
        sendToast({ title: "Config Reset", description: "The config has been reset" })
      },
      type: "button",
    },
    {
      title: "Change Theme",
      description: "This will change the theme",
      onClick: () => {
        changeTheme(invertedTheme)
        sendToast({ title: "Theme Changed", description: `The theme has been changed to ${invertedTheme}` })
      },
      type: "button",
    },
    {
      title: "See Data",
      description: "This will show the data",
      onClick: () => {
        sendToast({ title: "Data Reset", description: "The data has been reset" })
        resetData()
      },
      dialogTitle: "Plugins Data",
      json: pluginsData,
      type: "dialog",
    },
    {
      title: "See Config",
      description: "This will show the config",
      onClick: () => {
        sendToast({ title: "Config Reset", description: "The config has been reset" })
        resetConfig()
      },
      json: pluginsConfig,
      dialogTitle: "Plugins Config",
      type: "dialog",
    },
  ]

  return (
    <div className="second-header-container" data-open={open}>
      <ul className="flex justify-start gap-4">
        {DEV_HEADER_ITEMS.map((item) => (
          <li key={item.title} className="flex items-center gap-2">
            {item.type === "dialog" ? (
              <DialogBox
                trigger={
                  <Button variant="secondary" size="sm">
                    {item.title}
                  </Button>
                }
                title={item.dialogTitle}
                description={item.description}
              >
                <JsonCodeBlock json={item.json} showCopyToClipboard={true} name={item.title} />
              </DialogBox>
            ) : (
              <Button key={item.title} onClick={item.onClick} variant="secondary" size="sm">
                {item.title}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function MainHeader() {
  const { changeTheme, theme } = useStore()
  const [open, setOpen] = useState<boolean>(false)
  const invertedTheme = theme === "light" ? "dark" : "light"
  const { sendToast } = useToast()

  return (
    <>
      <header className="header-container">
        <div className="header-content">
          <div className="flex items-center gap-2">
            <DropdownMenuComp />
            <Link
              href="/"
              className="group flex w-[225px] items-center justify-center gap-2 px-2 transition-all hover:gap-3"
            >
              <Image
                src={icon}
                alt="icon"
                width={30}
                height={30}
                priority
                className="transition-all group-hover:scale-110"
              />
              <Image
                src={weebProfile}
                alt="weebProfile"
                height={25}
                priority
                className="transition-all group-hover:scale-110"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button style={{ padding: "10px" }} onClick={() => setOpen(!open)} variant="secondary">
              <FaDev size={20} color="inherit" />
            </Button>
            <Button
              style={{ padding: "10px" }}
              variant="secondary"
              onClick={() => {
                sendToast({
                  title: "Change language not implemented",
                  description: "This feature is not implemented yet",
                  error: true,
                })
              }}
            >
              <FaLanguage size={20} color="inherit" />
            </Button>
            <Button
              style={{ padding: "10px" }}
              variant="secondary"
              onClick={() => {
                changeTheme(invertedTheme)
                sendToast({ title: "Theme Changed", description: `The theme has been changed to ${invertedTheme}` })
              }}
            >
              {theme === "light" ? (
                <MdOutlineDarkMode size={20} color="inherit" />
              ) : (
                <MdOutlineLightMode size={20} color="inherit" />
              )}
            </Button>
          </div>
        </div>
      </header>
      <DevtoolsHeader open={open} />
    </>
  )
}

export default MainHeader
