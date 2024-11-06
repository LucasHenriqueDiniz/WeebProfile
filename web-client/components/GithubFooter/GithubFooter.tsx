import Image from "next/image"
import Link from "next/link"
import { icon } from "web-client/public"
import styles from "./GithubFooter.module.css"

const GithubFooter = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerLine} />
      <div className={styles.footerLinks}>
        <Image src={icon} alt="icon" width={30} height={30} />
        <Link href="#">© {currentYear} WeebProfile</Link>
      </div>
    </footer>
  )
}

export default GithubFooter
