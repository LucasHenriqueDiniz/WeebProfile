import React from "react"
import {
  FaBrain,
  FaCar,
  FaChild,
  FaCloudMoon,
  FaGamepad,
  FaHatWizard,
  FaLandmark,
  FaRegCompass,
  FaRegDizzy,
  FaRegGrinBeamSweat,
  FaRegGrinSquint,
  FaRegGrinTears,
  FaRegGrinTongueSquint,
  FaRegHandPaper,
  FaRegHandRock,
  FaRegLaugh,
  FaRegQuestionCircle,
  FaRegSadCry,
  FaRobot,
  FaTrophy,
} from "react-icons/fa"
import { IoIosMusicalNotes } from "react-icons/io"
import { IoFilmOutline } from "react-icons/io5"
import { LiaFistRaisedSolid } from "react-icons/lia"

export interface TagItem {
  icon: JSX.Element
  colorClass: string
  emoji: string
}

export function getTagIcon(genre: string): TagItem {
  const iconProps = { size: 14, color: "inherit" }
  switch (genre) {
    case "Action":
      return {
        icon: <LiaFistRaisedSolid {...iconProps} />,
        colorClass: "text-red-500 border-red-500 bg-red-500/15",
        emoji: "👊",
      }
    case "Adventure":
      return {
        icon: <FaRegCompass {...iconProps} />,
        colorClass: "text-yellow-600 border-yellow-600 bg-yellow-600/15",
        emoji: "🧭",
      }
    case "Cars":
      return {
        icon: <FaCar {...iconProps} />,
        colorClass: "text-blue-500 border-blue-500 bg-blue-500/15",
        emoji: "🚗",
      }
    case "Comedy":
      return {
        icon: <FaRegLaugh {...iconProps} />,
        colorClass: "text-yellow-400 border-yellow-400 bg-yellow-400/15",
        emoji: "😂",
      }
    case "Dementia":
      return {
        icon: <FaBrain {...iconProps} />,
        colorClass: "text-purple-700 border-purple-700 bg-purple-700/15",
        emoji: "🧠",
      }
    case "Demons":
      return {
        icon: <FaRegGrinTongueSquint {...iconProps} />,
        colorClass: "text-red-700 border-red-700 bg-red-700/15",
        emoji: "😈",
      }
    case "Mystery":
      return {
        icon: <FaRegQuestionCircle {...iconProps} />,
        colorClass: "text-purple-800 border-purple-800 bg-purple-800/15",
        emoji: "❓",
      }
    case "Drama":
      return {
        icon: <FaRegSadCry {...iconProps} />,
        colorClass: "text-blue-800 border-blue-800 bg-blue-800/15",
        emoji: "😢",
      }
    case "Ecchi":
      return {
        icon: <FaRegGrinBeamSweat {...iconProps} />,
        colorClass: "text-pink-500 border-pink-500 bg-pink-500/15",
        emoji: "😅",
      }
    case "Fantasy":
      return {
        icon: <FaHatWizard {...iconProps} />,
        colorClass: "text-blue-300 border-blue-300 bg-blue-300/15",
        emoji: "🧙",
      }
    case "Game":
      return {
        icon: <FaGamepad {...iconProps} />,
        colorClass: "text-green-500 border-green-500 bg-green-500/15",
        emoji: "🎮",
      }
    case "Hentai":
      return {
        icon: <FaRegGrinTears {...iconProps} />,
        colorClass: "text-pink-600 border-pink-600 bg-pink-600/15",
        emoji: "😂",
      }
    case "Historical":
      return {
        icon: <FaLandmark {...iconProps} />,
        colorClass: "text-amber-500 border-amber-500 bg-amber-500/15",
        emoji: "🏛️",
      }
    case "Horror":
      return {
        icon: <FaRegDizzy {...iconProps} />,
        colorClass: "text-gray-900 border-gray-900 bg-gray-900/15",
        emoji: "😱",
      }
    case "Kids":
      return {
        icon: <FaChild {...iconProps} />,
        colorClass: "text-orange-500 border-orange-500 bg-orange-500/15",
        emoji: "🧒",
      }
    case "Magic":
      return {
        icon: <FaHatWizard {...iconProps} />,
        colorClass: "text-blue-300 border-blue-300 bg-blue-300/15",
        emoji: "🎩",
      }
    case "Martial Arts":
      return {
        icon: <FaRegHandRock {...iconProps} />,
        colorClass: "text-gray-500 border-gray-500 bg-gray-500/15",
        emoji: "🥋",
      }
    case "Mecha":
      return {
        icon: <FaRobot {...iconProps} />,
        colorClass: "text-gray-400 border-gray-400 bg-gray-400/15",
        emoji: "🤖",
      }
    case "Music":
      return {
        icon: <IoIosMusicalNotes {...iconProps} />,
        colorClass: "text-violet-500 border-violet-500 bg-violet-500/15",
        emoji: "🎵",
      }
    case "Parody":
      return {
        icon: <FaRegGrinSquint {...iconProps} />,
        colorClass: "text-green-300 border-green-300 bg-green-300/15",
        emoji: "😏",
      }
    case "Samurai":
      return {
        icon: <FaRegHandPaper {...iconProps} />,
        colorClass: "text-gray-700 border-gray-700 bg-gray-700/15",
        emoji: "👋",
      }
    case "Romance":
      return {
        icon: <FaRegGrinTongueSquint {...iconProps} />,
        colorClass: "text-pink-500 border-pink-500 bg-pink-500/15",
        emoji: "😜",
      }
    case "Supernatural":
      return {
        icon: <FaCloudMoon {...iconProps} />,
        colorClass: "text-purple-400 border-purple-400 bg-purple-400/15",
        emoji: "🌙",
      }
    case "Award Winning":
      return {
        icon: <FaTrophy {...iconProps} />,
        colorClass: "text-yellow-500 border-yellow-500 bg-yellow-500/15",
        emoji: "🏆",
      }
    case "Slice of Life":
      return {
        icon: <FaRegGrinBeamSweat {...iconProps} />,
        colorClass: "text-green-500 border-green-500 bg-green-500/15",
        emoji: "😅",
      }
    case "Vampire":
      return {
        icon: <FaRegGrinTongueSquint {...iconProps} />,
        colorClass: "text-red-800 border-red-800 bg-red-800/15",
        emoji: "🧛",
      }
    case "Sci-Fi":
      return {
        icon: <FaRobot {...iconProps} />,
        colorClass: "text-cyan-500 border-cyan-500 bg-cyan-500/15",
        emoji: "🚀",
      }
    case "Suspense":
      return {
        icon: <FaRegQuestionCircle {...iconProps} />,
        colorClass: "text-yellow-700 border-yellow-700 bg-yellow-700/15",
        emoji: "😰",
      }
    case "Psychological":
      return {
        icon: <FaBrain {...iconProps} />,
        colorClass: "text-purple-600 border-purple-600 bg-purple-600/15",
        emoji: "🧠",
      }
    case "Love Polygon":
      return {
        icon: <FaRegGrinTongueSquint {...iconProps} />,
        colorClass: "text-pink-400 border-pink-400 bg-pink-400/15",
        emoji: "💕",
      }
    case "School":
      return {
        icon: <FaLandmark {...iconProps} />,
        colorClass: "text-blue-600 border-blue-600 bg-blue-600/15",
        emoji: "🏫",
      }
    case "Adult Cast":
      return {
        icon: <FaRegGrinBeamSweat {...iconProps} />,
        colorClass: "text-gray-600 border-gray-600 bg-gray-600/15",
        emoji: "🧑",
      }
    case "Gag Humor":
      return {
        icon: <FaRegLaugh {...iconProps} />,
        colorClass: "text-yellow-500 border-yellow-500 bg-yellow-500/15",
        emoji: "😆",
      }
    case "Showbiz":
      return {
        icon: <IoIosMusicalNotes {...iconProps} />,
        colorClass: "text-pink-300 border-pink-300 bg-pink-300/15",
        emoji: "🎬",
      }
    case "Avant Garde":
      return {
        icon: <FaRegDizzy {...iconProps} />,
        colorClass: "text-purple-500 border-purple-500 bg-purple-500/15",
        emoji: "🎨",
      }
    case "Gore":
      return {
        icon: <FaRegDizzy {...iconProps} />,
        colorClass: "text-red-900 border-red-900 bg-red-900/15",
        emoji: "🔪",
      }
    default:
      return {
        icon: <IoFilmOutline {...iconProps} />,
        colorClass: "text-rose-500 border-rose-500 bg-rose-500/15",
        emoji: "🎥",
      }
  }
}

export const DefaultTag = ({ text }: { text: string }) => {
  const { icon, colorClass } = getTagIcon(text)
  if (text === "Award Winning") {
    text = "Awarded"
  }
  return (
    <span className={`genre-tag ${colorClass} border border-solid rounded-md px-1 py-0.5`}>
      {icon}
      {text}
    </span>
  )
}

export const TerminalTag = ({ text }: { text: string }) => {
  const { emoji, colorClass } = getTagIcon(text)
  if (text === "Award Winning") {
    text = "Awarded"
  }
  return (
    <span className={`genre-tag text-${colorClass} truncate px-0.5 py-[0.25rem]`}>
      {emoji} {text}
    </span>
  )
}
