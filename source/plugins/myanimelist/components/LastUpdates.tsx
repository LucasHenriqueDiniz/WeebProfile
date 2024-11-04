import React from "react"
import { format } from "date-fns"
import { FaList, FaStar } from "react-icons/fa"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "templates/Terminal/Terminal_Command"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import getPseudoCommands from "core/utils/getPseudoCommands"
import Img64 from "core/src/base/ImageComponent"
import { LastUpdatesAnime, LastUpdatesManga, MalLastUpdatesResponse } from "../types/malLastUpdatesResponse"
import PercentageBar from "./Default_PercentageBar"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import ErrorMessage from "source/templates/Error_Style"
import MAL_ENV_VARIABLES from "../ENV_VARIABLES"
import { emojiStatus } from "source/helpers/emoji"

function DefaultUpdate({ update }: { update: LastUpdatesAnime | LastUpdatesManga }): JSX.Element {
  const isAnime = "episodes_total" in update
  const title = update.entry.title
  const imgSrc = update.entry.images.jpg?.base64
  const total = isAnime ? (update.episodes_total ?? 0) : (update.chapters_total ?? 0)
  const current = isAnime ? (update.episodes_seen ?? 0) : (update.chapters_read ?? 0)
  const status = update.status
  const date = format(new Date(update.date), "MMM d, h:mm a")
  const score = update.score ?? 0

  return (
    <div className="last-update-grid">
      <div className="default-update-image drop-shadow">
        <Img64 url64={imgSrc} alt={title} width={74} className="image-center-full" />
      </div>
      <div className="flex-d w100 justify-evenly">
        <div className="title-grid">
          <h3 className="lg-text-bold text-nowrap text-overflow">{title}</h3>
          <span className="flex items-baseline xl-text color-primary gap-2">
            {score === 0 || !score ? "-" : score} <FaStar size={18} className="color-primary" />
          </span>
        </div>

        <PercentageBar current={current} total={total} status={status} />

        <div className="flex justify-between">
          <div className="md-text gap-4 flex items-baseline">
            <span
              className={`default-${
                status === "Reading"
                  ? "watching"
                  : status === "Plan to Read"
                    ? "plan-to-watch"
                    : status.toLowerCase().split(" ").join("-")
              }`}
            >
              {status}
            </span>
            <span>
              {current === 0 || !current ? "?" : current} / {total === 0 || !total ? "?" : total}
            </span>
          </div>
          <span className="sm-text text-gray flex align-flexend">{date}</span>
        </div>
      </div>
    </div>
  )
}

function TerminalUpdate({ update }: { update: LastUpdatesAnime | LastUpdatesManga }): JSX.Element {
  const isAnime = "episodes_total" in update
  const title = update.entry.title
  const total = isAnime ? (update.episodes_total ?? 0) : update.chapters_total || 0
  const current = isAnime ? (update.episodes_seen ?? 0) : update.chapters_read || 0
  const status = update.status
  const date = format(new Date(update.date), "MMM d, h:mm a")
  const score = update.score ?? 0

  // get percentage and create progress bar
  const percentage = Math.round((current / total) * 100) || 0
  const progressBarLength = 30
  const filledBlocks = Math.round((percentage / 100) * progressBarLength)

  // create progress bar
  const progressBar = "█".repeat(filledBlocks) + "░".repeat(progressBarLength - filledBlocks)

  const statusColor = `default-${status === "Reading" ? "watching" : status === "Plan to Read" ? "plan-to-watch" : status.toLowerCase().split(" ").join("-")}`

  return (
    <div className="sm-text flex-d gap-2">
      <div className="text-warning text-overflow text-nowrap md-2-text">- {title}</div>
      <div className="text-raw">
        {percentage}% [<span className={statusColor}>{progressBar}</span>] ({current}/{total})
      </div>
      <div className="flex justify-between">
        <span className="text-bold">
          <span className={statusColor}>
            {emojiStatus(status)} {status}
          </span>{" "}
          | {score === 0 || !score ? "-" : score} / 10
        </span>
        <span className="text-muted">{date}</span>
      </div>
    </div>
  )
}

export default function Default_LastUpdates({ data }: { data: MalLastUpdatesResponse }): JSX.Element {
  const { myanimelist } = getEnvVariables()
  if (!myanimelist) throw new Error("Mal plugin not found in Default_LastUpdates component")
  if (!data) return <ErrorMessage message="No data found in Default_LastUpdates component" />

  // push anime and manga together and sort by date
  const media = myanimelist?.statistics_media ?? (MAL_ENV_VARIABLES.statistics_media.defaultValue as string)

  const array = media === "both" ? [...data.anime, ...data.manga] : media === "anime" ? data.anime : data.manga
  const allUpdates = array.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const title = myanimelist?.last_activity_title ?? (MAL_ENV_VARIABLES.last_activity_title.defaultValue as string)
  const maxItems = myanimelist?.last_activity_max ?? (MAL_ENV_VARIABLES.last_activity_max.defaultValue as number)

  return (
    <section className="default-last-updates">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            <DefaultTitle title={title ?? "Last Updates"} icon={<FaList />} />
            <div className="flex-d gap-4">
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
            <div className="flex-d gap-4">
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
