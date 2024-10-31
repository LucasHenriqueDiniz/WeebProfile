import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import useStore from "app/store"
import Link from "next/link"
import { FaCheck, FaChevronRight, FaLink } from "react-icons/fa"
import { LuMenu } from "react-icons/lu"
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md"
import getFullLanguage from "utils/getFullLanguage"
import { Language, languageArray } from "web-client/app/storeTypes"
import Button from "web-client/components/Button/Button"

const DropdownMenuDemo = () => {
  const { theme, language, changeTheme, setLanguage } = useStore()

  const languageMark = (lang: string) => {
    if (lang === language) return <FaCheck className='ml-auto size-[10px] text-violet11' />
    return null
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button style={{ padding: "10px" }} aria-label='Open Menu' asDiv={true} variant='secondary'>
          <LuMenu size={20} color='inherit' />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade'
          sideOffset={5}
        >
          {/* Language */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className='group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:data-[state=open]:bg-violet9 data-[state=open]:bg-violet4 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:text-violet1 data-[highlighted]:text-violet1 data-[state=open]:text-violet11'>
              Change Language: {language.toUpperCase()}
              <div className='ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white'>
                <FaChevronRight className='size-[10px] text-violet11' />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className='min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade'
                sideOffset={2}
                alignOffset={-5}
              >
                {languageArray.map((lang) => (
                  <DropdownMenu.Item
                    key={lang}
                    onClick={() => {
                      try {
                        if (lang === language) return
                        setLanguage(lang as Language)
                      } catch (error) {
                        throw new Error("Error changing language " + error)
                      }
                    }}
                    className='group relative flex h-[25px] cursor-pointer select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1'
                  >
                    {getFullLanguage(lang)}
                    {languageMark(lang)}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          {/* Theme */}
          <DropdownMenu.Item
            onClick={() => changeTheme(theme === "light" ? "dark" : "light")}
            className='group relative flex h-[25px] cursor-pointer select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1'
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
            <div className='ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white'>
              {theme === "light" ? (
                <MdOutlineDarkMode className='size-[10px] text-violet11' />
              ) : (
                <MdOutlineLightMode className='size-[10px] text-violet11' />
              )}
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className='m-[5px] h-px bg-violet6' />

          {/* FAQ */}
          <DropdownMenu.Item className='group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1'>
            <Link
              href='#'
              target='_blank'
              rel='noopener noreferrer'
              className='flex size-full items-center justify-between'
            >
              FAQ
              <FaLink className='size-[10px] text-violet11' />
            </Link>
          </DropdownMenu.Item>

          {/* Open github project link */}
          <DropdownMenu.Item className='group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1'>
            <Link
              href='https://github.com/LucasHenriqueDiniz/WeebProfile'
              target='_blank'
              rel='noopener noreferrer'
              className='flex size-full items-center justify-between'
            >
              Open Github Project
              <FaLink className='size-[10px] text-violet11' />
            </Link>
          </DropdownMenu.Item>

          {/* Sponsor */}
          <DropdownMenu.Item className='group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1'>
            <Link
              href='#'
              target='_blank'
              rel='noopener noreferrer'
              className='flex size-full items-center justify-between'
            >
              Sponsor
              <FaLink className='size-[10px] text-violet11' />
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default DropdownMenuDemo
