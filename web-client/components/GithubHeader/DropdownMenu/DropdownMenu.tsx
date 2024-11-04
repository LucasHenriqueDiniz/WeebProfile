import {
  Arrow,
  Content,
  Item,
  Portal,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
} from "@radix-ui/react-dropdown-menu"
import useStore from "app/store"
import Link from "next/link"
import { FaCheck, FaChevronRight, FaLink } from "react-icons/fa"
import { LuMenu } from "react-icons/lu"
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md"
import getFullLanguage from "utils/getFullLanguage"
import { Language, languageArray } from "web-client/app/storeTypes"
import Button from "web-client/components/Button/Button"
import "./DropdownMenu.css"

const DropdownMenuDemo = () => {
  const { theme, language, changeTheme, setLanguage } = useStore()

  const languageMark = (lang: string) => {
    if (lang === language) return <FaCheck className="dropdown-menu-right-slot" />
    return null
  }

  return (
    <Root>
      <Trigger asChild>
        <div>
          <Button style={{ padding: "10px" }} aria-label="Open Menu" asDiv={true} variant="secondary">
            <LuMenu size={20} color="inherit" />
          </Button>
        </div>
      </Trigger>

      <Portal>
        <Content className="dropdown-menu-content" sideOffset={5}>
          <Arrow className="dropdown-menu-arrow" />
          <Sub>
            <SubTrigger className="dropdown-menu-subtrigger">
              Change Language: {language.toUpperCase()}
              <div className="dropdown-menu-right-slot">
                <FaChevronRight />
              </div>
            </SubTrigger>
            <Portal>
              <SubContent className="dropdown-menu-subcontent" sideOffset={2} alignOffset={-5}>
                {languageArray.map((lang) => (
                  <Item
                    key={lang}
                    onClick={() => {
                      try {
                        if (lang === language) return
                        setLanguage(lang as Language)
                      } catch (error) {
                        throw new Error("Error changing language " + error)
                      }
                    }}
                    className="dropdown-menu-item"
                  >
                    {getFullLanguage(lang)}
                    {languageMark(lang)}
                  </Item>
                ))}
              </SubContent>
            </Portal>
          </Sub>

          <Item onClick={() => changeTheme(theme === "light" ? "dark" : "light")} className="dropdown-menu-item">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
            <div className="dropdown-menu-right-slot">
              {theme === "light" ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
            </div>
          </Item>

          <Separator className="dropdown-menu-separator" />

          {/* FAQ */}
          <Item className="dropdown-menu-item">
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-full items-center justify-between"
            >
              FAQ
              <FaLink className="dropdown-menu-right-slot" />
            </Link>
          </Item>

          {/* Open github project link */}
          <Item className="dropdown-menu-item">
            <Link
              href="https://github.com/LucasHenriqueDiniz/WeebProfile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-full items-center justify-between"
            >
              Open Github Project
              <FaLink className="dropdown-menu-right-slot" />
            </Link>
          </Item>

          {/* Sponsor */}
          <Item className="dropdown-menu-item">
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-full items-center justify-between"
            >
              Sponsor
              <FaLink className="dropdown-menu-right-slot" />
            </Link>
          </Item>
        </Content>
      </Portal>
    </Root>
  )
}

export default DropdownMenuDemo
