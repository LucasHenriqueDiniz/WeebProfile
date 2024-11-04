import Image from "next/image"
import Link from "next/link"
import { icon } from "static"
import "./GithubFooter.css"

const GithubFooter = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="flex h-[100px] w-full flex-col items-center justify-center">
      <div className="footer-line" />
      <div className="footer-links">
        <Image src={icon} alt="icon" width={30} height={30} />
        <Link href="#">© {currentYear} WeebProfile</Link>
      </div>
    </footer>
  )
}

export default GithubFooter
