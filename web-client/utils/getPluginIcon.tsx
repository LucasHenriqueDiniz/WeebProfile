import { IconBaseProps } from "react-icons"
import {
  FaGithub,
  FaInstagram,
  FaLastfm,
  FaQuestion,
  FaReddit,
  FaSpotify,
  FaSteam,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa"
import { SiMyanimelist } from "react-icons/si"

function getPluginIcon(plugin: any, props?: IconBaseProps) {
  switch (plugin.name) {
    case "lastfm":
      return <FaLastfm {...props} />
    case "myanimelist":
      return <SiMyanimelist {...props} />
    case "github":
      return <FaGithub {...props} />
    case "twitter":
      return <FaTwitter {...props} />
    case "spotify":
      return <FaSpotify {...props} />
    case "steam":
      return <FaSteam {...props} />
    case "youtube":
      return <FaYoutube {...props} />
    case "twitch":
      return <FaTwitch {...props} />
    case "reddit":
      return <FaReddit {...props} />
    case "instagram":
      return <FaInstagram {...props} />
    default:
      return <FaQuestion {...props} />
  }
}

export default getPluginIcon
