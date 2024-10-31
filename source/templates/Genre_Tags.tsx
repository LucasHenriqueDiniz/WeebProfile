import React from "react";
import {
  FaRegCompass,
  FaCar,
  FaRegLaugh,
  FaBrain,
  FaRegGrinTongueSquint,
  FaRegQuestionCircle,
  FaRegSadCry,
  FaRegGrinBeamSweat,
  FaGamepad,
  FaRegGrinTears,
  FaLandmark,
  FaRegDizzy,
  FaChild,
  FaHatWizard,
  FaRegHandRock,
  FaRobot,
  FaRegGrinSquint,
  FaRegHandPaper,
  FaCloudMoon,
} from "react-icons/fa";
import { IoIosMusicalNotes } from "react-icons/io";
import { LiaFistRaisedSolid } from "react-icons/lia";
import { IoFilmOutline } from "react-icons/io5";

export interface TagItem {
  icon: JSX.Element;
  colorClass: string;
  emoji: string;
}

export function getTagIcon(genre: string): TagItem {
  const iconProps = { size: 14, color: "inherit" };
  switch (genre) {
    case "Action":
      return { icon: <LiaFistRaisedSolid {...iconProps} />, colorClass: "tags-color-red", emoji: "👊" };
    case "Adventure":
      return { icon: <FaRegCompass {...iconProps} />, colorClass: "tags-color-brown", emoji: "🧭" };
    case "Cars":
      return { icon: <FaCar {...iconProps} />, colorClass: "tags-color-blue", emoji: "🚗" };
    case "Comedy":
      return { icon: <FaRegLaugh {...iconProps} />, colorClass: "tags-color-yellow", emoji: "😂" };
    case "Dementia":
      return { icon: <FaBrain {...iconProps} />, colorClass: "tags-color-purple", emoji: "🧠" };
    case "Demons":
      return { icon: <FaRegGrinTongueSquint {...iconProps} />, colorClass: "tags-color-dark-red", emoji: "😈" };
    case "Mystery":
      return { icon: <FaRegQuestionCircle {...iconProps} />, colorClass: "tags-color-dark-purple", emoji: "❓" };
    case "Drama":
      return { icon: <FaRegSadCry {...iconProps} />, colorClass: "tags-color-dark-blue", emoji: "😢" };
    case "Ecchi":
      return { icon: <FaRegGrinBeamSweat {...iconProps} />, colorClass: "tags-color-pink", emoji: "😅" };
    case "Fantasy":
      return { icon: <FaHatWizard {...iconProps} />, colorClass: "tags-color-light-blue", emoji: "🧙" };
    case "Game":
      return { icon: <FaGamepad {...iconProps} />, colorClass: "tags-color-green", emoji: "🎮" };
    case "Hentai":
      return { icon: <FaRegGrinTears {...iconProps} />, colorClass: "tags-color-hot-pink", emoji: "😂" };
    case "Historical":
      return { icon: <FaLandmark {...iconProps} />, colorClass: "tags-color-gold", emoji: "🏛️" };
    case "Horror":
      return { icon: <FaRegDizzy {...iconProps} />, colorClass: "tags-color-black", emoji: "😱" };
    case "Kids":
      return { icon: <FaChild {...iconProps} />, colorClass: "tags-color-orange", emoji: "🧒" };
    case "Magic":
      return { icon: <FaHatWizard {...iconProps} />, colorClass: "tags-color-light-blue", emoji: "🎩" };
    case "Martial Arts":
      return { icon: <FaRegHandRock {...iconProps} />, colorClass: "tags-color-gray", emoji: "🥋" };
    case "Mecha":
      return { icon: <FaRobot {...iconProps} />, colorClass: "tags-color-silver", emoji: "🤖" };
    case "Music":
      return { icon: <IoIosMusicalNotes {...iconProps} />, colorClass: "tags-color-violet", emoji: "🎵" };
    case "Parody":
      return { icon: <FaRegGrinSquint {...iconProps} />, colorClass: "tags-color-light-green", emoji: "😏" };
    case "Samurai":
      return { icon: <FaRegHandPaper {...iconProps} />, colorClass: "tags-color-dark-gray", emoji: "👋" };
    case "Romance":
      return { icon: <FaRegGrinTongueSquint {...iconProps} />, colorClass: "tags-color-pink", emoji: "😜" };
    case "Supernatural":
      return { icon: <FaCloudMoon {...iconProps} />, colorClass: "tags-color-light-purple", emoji: "🌙" };
    default:
      return { icon: <IoFilmOutline {...iconProps} />, colorClass: "tags-color-white", emoji: "🎥" };
  }
}

export const DefaultTag = ({ text }: { text: string }) => {
  const { icon, colorClass } = getTagIcon(text);
  if (text === "Award Winning") {
    text = "Awarded";
  }
  return (
    <span className={`default-tag flex item-center gap-2 ${colorClass} text-overflow text-nowrap w-auto`}>
      {icon}
      {text}
    </span>
  );
};

export const TerminalTag = ({ text }: { text: string }) => {
  const { emoji, colorClass } = getTagIcon(text);
  if (text === "Award Winning") {
    text = "Awarded";
  }
  return (
    <span className={`flex item-center gap-4 ${colorClass} text-overflow text-nowrap w-auto border-0`}>
      {emoji}
      {text}
    </span>
  );
};
