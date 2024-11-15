import getPseudoCommands from "core/utils/getPseudoCommands"
import { format } from "date-fns"
import React from "react"
import { FaList, FaStar } from "react-icons/fa"
import { emojiStatus } from "source/helpers/emoji"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import ErrorMessage from "source/templates/Error_Style"
import ImageComponent from "source/templates/ImageComponent"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import { LastUpdatesAnime, LastUpdatesManga, MalLastUpdates } from "../types/malLastUpdates"
import PercentageBar from "./Default_PercentageBar"

function getStatusColor(status: string) {
  // Needed for the tailwind load the color classes
  switch (status) {
    case "Completed":
      return "text-mal-completed"
    case "Plan to Watch":
      return "text-mal-plan-to-watch"
    case "Plan to Read":
      return "text-mal-plan-to-read"
    case "Watching":
      return "text-mal-watching"
    case "Reading":
      return "text-mal-reading"
    case "On Hold":
      return "text-mal-on-hold"
    case "Dropped":
      return "text-mal-dropped"
    default:
      return "text-mal-watching"
  }
}

function DefaultUpdate({ update }: { update: LastUpdatesAnime | LastUpdatesManga }): JSX.Element {
  const isAnime = "episodes_total" in update
  const title = update.title
  const imgSrc = update.image
  const total = isAnime ? (update.episodes_total ?? 0) : (update.chapters_total ?? 0)
  const current = isAnime ? (update.episodes_seen ?? 0) : (update.chapters_read ?? 0)
  const status = update.status
  const date = format(new Date(update.date), "MMM d, h:mm a")
  const score = update.score ?? 0

  return (
    <div className="grid grid-cols-[75px_1fr] gap-4 h-20 min-h-[75px] max-h-[75px]">
      <div className="image-square-container-75">
        <ImageComponent url64={imgSrc} alt={title} className="image-square" width={75} height={75} />
      </div>
      <div className="flex flex-col justify-evenly w-full">
        <div className="grid grid-cols-[auto_1fr] items-center justify-end">
          <h3 className="text-lg font-semibold truncate text-default-muted">{title}</h3>
          <span className="flex items-baseline justify-end text-xl text-default-highlight gap-2">
            {score === 0 || !score ? "-" : score} <FaStar size={18} className="text-default-highlight" />
          </span>
        </div>

        <PercentageBar current={current} total={total} status={status} />

        <div className="flex justify-between">
          <div className="text-md gap-2 flex items-baseline">
            <span className={getStatusColor(status)}>{status}</span>
            <span>
              {current === 0 || !current ? "?" : current} / {total === 0 || !total ? "?" : total}
            </span>
          </div>
          <span className="text-sm text-gray-500 flex justify-end">{date}</span>
        </div>
      </div>
    </div>
  )
}

function TerminalUpdate({ update }: { update: LastUpdatesAnime | LastUpdatesManga }): JSX.Element {
  const isAnime = "episodes_total" in update
  const title = update.title
  const total = isAnime ? (update.episodes_total ?? 0) : update.chapters_total || 0
  const current = isAnime ? (update.episodes_seen ?? 0) : update.chapters_read || 0
  const status = update.status
  const date = format(new Date(update.date), "MMM d, h:mm a")
  const score = update.score ?? 0

  // get percentage and create progress bar
  const percentage = total === 0 ? 0 : Math.round((current / total) * 100) || 0
  const progressBarLength = 36
  const filledBlocks = Math.round((percentage / 100) * progressBarLength)

  // create progress bar
  const progressBar = "█".repeat(filledBlocks) + "░".repeat(progressBarLength - filledBlocks)

  return (
    <div className="flex flex-col gap-1">
      <div className="text-terminal-warning truncate font-bold text-md">* {title}</div>
      <div className="flex items-center">
        <span className="text-terminal-muted font-bold">{percentage}%</span>
        <span
          className={`text-mal-${status.toLowerCase().split(" ").join("-")} tracking-tighter text-center w-full overflow-hidden`}
        >
          {progressBar}
        </span>
        <span className="text-terminal-muted">
          {current}/{total === 0 || !total ? "?" : total}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="font-bold">
          <span className={`text-mal-${status.toLowerCase().split(" ").join("-")}`}>
            {emojiStatus(status)} {status}
          </span>{" "}
          | {score === 0 || !score ? "-" : score}/10
        </span>
        <span className="text-terminal-muted">{date}</span>
      </div>
    </div>
  )
}

export default function LastUpdates({ data }: { data: MalLastUpdates }): JSX.Element {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const myanimelist = env.myanimelist
  if (!myanimelist) throw new Error("Mal plugin not found in Default_LastUpdates component")
  if (!data) return <ErrorMessage message="No data found in Default_LastUpdates component" />

  // push anime and manga together and sort by date
  const media = myanimelist?.statistics_media ?? (MAL_ENV_VARIABLES.statistics_media.defaultValue as string)

  const array = media === "both" ? [...data.anime, ...data.manga] : media === "anime" ? data.anime : data.manga
  let allUpdates = array.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const title = myanimelist?.last_activity_title ?? (MAL_ENV_VARIABLES.last_activity_title.defaultValue as string)
  const maxItems = myanimelist?.last_activity_max ?? (MAL_ENV_VARIABLES.last_activity_max.defaultValue as number)

  if (maxItems && allUpdates.length > maxItems) {
    allUpdates = allUpdates.slice(0, maxItems)
  }

  return (
    <section id="mal-last-updates">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            <DefaultTitle title={title} icon={<FaList />} />
            <div className="flex flex-col gap-1">
              {allUpdates.map((update, index) => (
                <DefaultUpdate key={index} update={update} />
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: "last_updates",
                username: myanimelist.username,
                limit: maxItems,
              })}
            />
            <div className="flex flex-col gap-2">
              {allUpdates.map((update, index) => (
                <TerminalUpdate key={index} update={update} />
              ))}
            </div>
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}
