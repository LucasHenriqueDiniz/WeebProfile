import Image from "next/image"
import Link from "next/link"
import React from "react"

import { icon } from "static"
import "./githubFooter.css"

const GithubFooter = () => {
  const currentYear = new Date().getFullYear()
  return (
    <div className='flex h-[100px] w-full flex-col items-center justify-center'>
      <div className='footer-line' />
      <div className='footer-links'>
        <Image src={icon} alt='icon' width={30} height={30} />
        <Link href='#'>© {currentYear} WeebProfile</Link>
      </div>
    </div>
  )
}

export default GithubFooter
