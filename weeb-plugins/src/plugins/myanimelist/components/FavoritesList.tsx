import React from "react"
import {
  FaBan,
  FaBook,
  FaBrain,
  FaCalendar,
  FaDumbbell,
  FaExclamationTriangle,
  FaFire,
  FaFutbol,
  FaGem,
  FaGhost,
  FaHashtag,
  FaHatCowboy,
  FaHeart,
  FaHeart as FaHeartTag,
  FaKiss,
  FaLaugh,
  FaLeaf,
  FaMagic,
  FaMap,
  FaMask,
  FaMusic,
  FaRobot,
  FaRocket,
  FaSearch,
  FaStar,
  FaTrophy,
  FaUtensilSpoon,
  FaVideo,
} from "react-icons/fa"
import { GoDotFill } from "react-icons/go"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle.js"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle.js"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand.js"
import { ImageComponent } from "../../../utils/image.js"
import { getPseudoCommands } from "../../../utils/pseudo-commands.js"
import { treatJapaneseName } from "../../../utils/string.js"
import type {
  BasicCharacterFavorite,
  BasicPeopleFavorite,
  FullAnimeFavorite,
  FullMangaFavorite,
  MyAnimeListConfig,
} from "../types.js"

type FavoriteType = "anime" | "manga" | "people" | "characters"
type ListStyle = "simple" | "compact" | "detailed" | "minimal"
type FavoriteData = FullAnimeFavorite[] | FullMangaFavorite[] | BasicCharacterFavorite[] | BasicPeopleFavorite[]

// Genre icon and color mapping
const GENRE_STYLES: Record<string, { icon: React.ReactElement; color: string }> = {
  Action: { icon: <FaDumbbell size={10} />, color: "#ef4444" },
  Adventure: { icon: <FaMap size={10} />, color: "#f59e0b" },
  Comedy: { icon: <FaLaugh size={10} />, color: "#eab308" },
  Drama: { icon: <FaMask size={10} />, color: "#8b5cf6" },
  Ecchi: { icon: <FaKiss size={10} />, color: "#ec4899" },
  Fantasy: { icon: <FaHatCowboy size={10} />, color: "#06b6d4" },
  Horror: { icon: <FaGhost size={10} />, color: "#7c3aed" },
  "Mahou Shoujo": { icon: <FaMagic size={10} />, color: "#a855f7" },
  Mecha: { icon: <FaRobot size={10} />, color: "#64748b" },
  Music: { icon: <FaMusic size={10} />, color: "#3b82f6" },
  Mystery: { icon: <FaSearch size={10} />, color: "#6366f1" },
  Psychological: { icon: <FaBrain size={10} />, color: "#8b5cf6" },
  Romance: { icon: <FaHeartTag size={10} />, color: "#f472b6" },
  "Sci-Fi": { icon: <FaRocket size={10} />, color: "#0ea5e9" },
  "Slice of Life": { icon: <FaLeaf size={10} />, color: "#10b981" },
  Sports: { icon: <FaFutbol size={10} />, color: "#22c55e" },
  Supernatural: { icon: <FaGem size={10} />, color: "#a855f7" },
  Thriller: { icon: <FaExclamationTriangle size={10} />, color: "#dc2626" },
  "Award Winning": { icon: <FaTrophy size={10} />, color: "#fbbf24" },
  Gourmet: { icon: <FaUtensilSpoon size={10} />, color: "#f97316" },
  "Boys Love": { icon: <FaHeartTag size={10} />, color: "#3b82f6" },
  "Girls Love": { icon: <FaHeartTag size={10} />, color: "#a855f7" },
  Erotica: { icon: <FaFire size={10} />, color: "#dc2626" },
  Hentai: { icon: <FaBan size={10} />, color: "#991b1b" },
  Suspense: { icon: <FaGhost size={10} />, color: "#7c2d12" },
}

// Helper function to get genre style
function getGenreStyle(genreName: string): { icon: React.ReactElement; color: string } {
  return GENRE_STYLES[genreName] || { icon: <FaStar size={10} />, color: "var(--default-color-muted)" }
}

// Enhanced genre tag component with icon and color
function EnhancedGenreTag({ genre }: { genre: string }): React.ReactElement {
  const style = getGenreStyle(genre)
  return (
    <span
      className="genre-tag text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 border-default-highlight/30 border-solid"
      style={{ backgroundColor: `${style.color}15`, color: style.color }}
    >
      <span className="flex" style={{ color: style.color }}>
        {style.icon}
      </span>
      <span className="truncate">{genre}</span>
    </span>
  )
}

function TerminalTag({ genre }: { genre: string }): React.ReactElement {
  return (
    <span className="genre-tag text-xs px-1 py-0.5 rounded bg-terminal-muted-light text-terminal-muted border border-terminal-muted truncate">
      {genre}
    </span>
  )
}

interface FavoritesListProps {
  data: FavoriteData
  type: FavoriteType
  config: MyAnimeListConfig
  style: "default" | "terminal"
  size: "half" | "full"
  listStyle?: ListStyle
}

// ============================================================================
// SIMPLE STYLE - Grid de imagens
// ============================================================================

function SimpleFavoriteImage({
  favorite,
  hideOverlay,
}: {
  favorite: FullAnimeFavorite | FullMangaFavorite | BasicCharacterFavorite | BasicPeopleFavorite
  hideOverlay: boolean
}): React.ReactElement {
  const imageUrl = favorite.image
  const title = "name" in favorite ? treatJapaneseName(favorite.name) : favorite.title

  return (
    <div className="favorite-container relative">
      <ImageComponent
        url64={imageUrl}
        alt={title ?? "Name not found"}
        className="image-portrait"
        width={75}
        height={120}
      />
      {!hideOverlay && (
        <div className="favorite-overlay-simple">
          <span className="truncate whitespace-nowrap">{title}</span>
        </div>
      )}
    </div>
  )
}

function RenderSimpleFavorites({
  data,
  hideOverlay,
  size,
}: {
  data: FavoriteData
  hideOverlay: boolean
  size: "half" | "full"
}): React.ReactElement {
  return (
    <div className="grid grid-cols-10 half:grid-cols-5 gap-2">
      {data.map((item, index) => (
        <SimpleFavoriteImage favorite={item} key={`simple-${item.mal_id}-${index}`} hideOverlay={hideOverlay} />
      ))}
    </div>
  )
}

// ============================================================================
// COMPACT STYLE - Lista compacta (50px altura)
// ============================================================================

function DefaultCompactFavorite({
  favorite,
  index,
}: {
  favorite: FullAnimeFavorite | FullMangaFavorite | BasicCharacterFavorite | BasicPeopleFavorite
  index: number
}): React.ReactElement {
  const img = favorite.image
  const name = "name" in favorite ? treatJapaneseName(favorite.name) : favorite.title

  return (
    <div className="h-[50px] flex rounded-lg overflow-hidden border border-default-highlight/30 border-solid bg-default-surface/50 hover:bg-default-surface/80 transition-colors">
      <div className="w-10 bg-default-highlight text-base font-bold flex items-center justify-center text-default-surface flex-shrink-0">
        {index + 1}
      </div>
      <div className="flex items-center pl-3 pr-2 text-sm font-semibold truncate w-full text-default-text leading-none min-w-0">
        {name}
      </div>
      <div className="w-16 h-full overflow-hidden flex-shrink-0 rounded-r-lg">
        <ImageComponent url64={img} alt={name} className="image-square" width={64} height={64} />
      </div>
    </div>
  )
}

function TerminalCompactFavorite({
  favorite,
  index,
}: {
  favorite: FullAnimeFavorite | FullMangaFavorite | BasicCharacterFavorite | BasicPeopleFavorite
  index: number
}): React.ReactElement {
  const name = "name" in favorite ? treatJapaneseName(favorite.name) : favorite.title

  return (
    <div className="flex align-center sm-text gap-1">
      <span className="text-terminal-raw">[{index + 1}]</span>
      <span className="text-terminal-warning md-2-text text-bold truncate no-underline">- {name}</span>
    </div>
  )
}

// ============================================================================
// DETAILED STYLE - Lista completa com summary (120px altura)
// ============================================================================

function DefaultDetailedFavorite({
  favorite,
  isHalf,
  type,
}: {
  favorite: FullAnimeFavorite | FullMangaFavorite
  isHalf: boolean
  type: "anime" | "manga"
}): React.ReactElement {
  const imageUrl = favorite.image
  const title = favorite.title
  const mean_score = favorite.score
  const release_year =
    type === "anime" ? (favorite as FullAnimeFavorite).year : (favorite as FullMangaFavorite).start_year
  const synopsis = favorite.synopsis
  const allGenres = favorite.genres?.map((genre) => genre.name) ?? []

  const genres = isHalf ? allGenres.slice(0, 4) : allGenres
  const status = favorite.status
  const popularity = favorite.popularity

  return (
    <div className="flex h-[120px] overflow-hidden gap-4">
      <div className="favorite-container">
        <ImageComponent url64={imageUrl} alt={title} className="image-portrait" width={75} height={120} />
      </div>
      <div className="w-full flex flex-col justify-between overflow-hidden">
        <span className="text-lg font-semibold truncate text-default-muted leading-tight">{title}</span>
        <div className="flex gap-2 items-center">
          {mean_score && (
            <span className="text-default-highlight font-semibold flex items-center gap-1 text-[12px]">
              <FaStar className="text-default-highlight" size={14} /> {mean_score}
            </span>
          )}
          {popularity && (
            <span className="font-semibold flex items-center gap-1 text-[12px] text-default-muted">
              <FaHashtag size={14} className="text-default-highlight" />
              {popularity}
            </span>
          )}
          {type === "anime" && (favorite as FullAnimeFavorite).episodes && (
            <span className="font-semibold flex items-center gap-1 text-[12px] text-default-muted">
              <FaVideo size={14} className="text-default-highlight" />
              {(favorite as FullAnimeFavorite).episodes}
            </span>
          )}
          {type === "manga" && (favorite as FullMangaFavorite).chapters && (
            <span className="font-semibold flex items-center gap-1 text-[12px] text-default-muted">
              <FaBook size={14} className="text-default-highlight" />
              {(favorite as FullMangaFavorite).chapters}
            </span>
          )}
          {release_year && (
            <span className="font-semibold flex items-center gap-1 text-[12px] text-default-muted">
              <FaCalendar size={14} className="text-default-highlight" />
              {release_year}
            </span>
          )}
          {status && (
            <span className={`font-semibold flex items-center gap-1 text-[12px] half:hidden`}>
              <GoDotFill
                size={14}
                className={`text-mal-${status === "Finished Airing" || status === "Finished" ? "completed" : "watching"}`}
              />
              {status}
            </span>
          )}
        </div>
        <div className="flex mt-0.5 gap-1 overflow-x-auto overflow-y-hidden">
          {genres.map((genre) => (
            <EnhancedGenreTag key={genre} genre={genre} />
          ))}
        </div>
        <div className="w-full overflow-hidden mt-1">
          <span className="synopsis-text line-clamp-2 text-default-muted leading-tight">{synopsis}</span>
        </div>
      </div>
    </div>
  )
}

function TerminalDetailedFavorite({
  favorite,
  isHalf,
  type,
}: {
  favorite: FullAnimeFavorite | FullMangaFavorite
  isHalf: boolean
  type: "anime" | "manga"
}): React.ReactElement {
  const title = favorite.title
  const mean_score = favorite.score
  const release_year =
    type === "anime" ? (favorite as FullAnimeFavorite).year : (favorite as FullMangaFavorite).start_year
  const synopsis = favorite.synopsis
  const genres = favorite.genres?.map((genre) => genre.name) || []
  const status = favorite.status
  const popularity = favorite.popularity

  return (
    <div className="mt-[0.5rem]">
      <div className="text-terminal-warning truncate">* {title}</div>
      <div className="flex gap-4 items-baseline">
        {mean_score && <span className="text-default-muted font-bold truncate">⭐{mean_score}</span>}
        {popularity && <span className="text-default-muted font-bold truncate"># {popularity}</span>}
        {type === "anime" && (favorite as FullAnimeFavorite).episodes && (
          <span className="text-default-muted font-bold truncate">
            🎞️ {(favorite as FullAnimeFavorite).episodes} EP&apos;s
          </span>
        )}
        {type === "manga" && (favorite as FullMangaFavorite).chapters && (
          <span className="text-default-muted font-bold truncate">
            📚 {(favorite as FullMangaFavorite).chapters} ch&apos;s
          </span>
        )}
        {release_year && <span className="text-default-muted font-bold truncate">📅 {release_year}</span>}
        {status && !isHalf && (
          <span
            className={`text-mal-${status === "Finished Airing" || status === "Finished" ? "completed" : "watching"} font-bold half:hidden truncate`}
          >
            ● {status}
          </span>
        )}
      </div>
      <div className="flex mt-1 gap-1">
        {genres.map((genre) => (
          <TerminalTag genre={genre} key={genre} />
        ))}
      </div>
      <div className="w-full overflow-hidden mt-2">
        <span className="synopsis-text line-clamp-2 truncate">{synopsis}</span>
      </div>
    </div>
  )
}

// ============================================================================
// MINIMAL STYLE - Lista sem summary (75px altura)
// ============================================================================

function DefaultMinimalFavorite({
  favorite,
  isHalf,
  type,
}: {
  favorite: FullAnimeFavorite | FullMangaFavorite
  isHalf: boolean
  type: "anime" | "manga"
}): React.ReactElement {
  const imageUrl = favorite.image
  const title = favorite.title
  const mean_score = favorite.score
  const release_year =
    type === "anime" ? (favorite as FullAnimeFavorite).year : (favorite as FullMangaFavorite).start_year
  const allGenres = favorite.genres?.map((genre) => genre.name) ?? []
  // Não mutar diretamente - criar novo array
  const genres = isHalf ? allGenres.slice(0, 4) : allGenres
  const status = favorite.status
  const popularity = favorite.popularity

  return (
    <div className="flex h-[75px] overflow-hidden gap-2">
      <div className="image-square-container-75 h-full flex-shrink-0">
        <ImageComponent url64={imageUrl} alt={title} className="image-square" width={75} height={75} />
      </div>
      <div className="w-full flex flex-col justify-between overflow-hidden min-w-0">
        <span className="text-base font-semibold truncate text-default-muted leading-tight">{title}</span>
        <div className="flex gap-1.5 items-baseline flex-wrap">
          {mean_score && (
            <span className="text-default-highlight font-semibold flex items-center gap-1 text-[12px]">
              <FaStar className="text-default-highlight" size={10} /> {mean_score}
            </span>
          )}
          {popularity && (
            <span className="font-semibold flex items-center gap-1 text-[12px] text-default-muted">
              <FaHashtag size={10} className="text-default-highlight" />
              {popularity}
            </span>
          )}
          {type === "anime" && (favorite as FullAnimeFavorite).episodes && (
            <span className="font-semibold flex items-center gap-1 text-[12px] text-default-muted">
              <FaVideo size={10} className="text-default-highlight" />
              {(favorite as FullAnimeFavorite).episodes}
            </span>
          )}
          {type === "manga" && (favorite as FullMangaFavorite).chapters && (
            <span className="font-semibold flex items-center gap-1 text-[12px] text-default-muted">
              <FaBook size={10} className="text-default-highlight" />
              {(favorite as FullMangaFavorite).chapters}
            </span>
          )}
          {release_year && (
            <span className="font-semibold flex items-center gap-1 text-[12px] text-default-muted">
              <FaCalendar size={10} className="text-default-highlight" />
              {release_year}
            </span>
          )}
          {status && (
            <span className={`font-semibold flex items-center gap-1 text-[12px] half:hidden`}>
              <GoDotFill
                size={10}
                className={`text-mal-${status === "Finished Airing" || status === "Finished" ? "completed" : "watching"}`}
              />
              {status}
            </span>
          )}
        </div>
        <div className="flex mt-0.5 gap-1 flex-nowrap">
          {genres.map((genre) => (
            <EnhancedGenreTag key={genre} genre={genre} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TerminalMinimalFavorite({
  favorite,
  isHalf,
  type,
}: {
  favorite: FullAnimeFavorite | FullMangaFavorite
  isHalf: boolean
  type: "anime" | "manga"
}): React.ReactElement {
  const title = favorite.title
  const mean_score = favorite.score
  const release_year =
    type === "anime" ? (favorite as FullAnimeFavorite).year : (favorite as FullMangaFavorite).start_year
  const genres = favorite.genres?.map((genre) => genre.name) || []
  const status = favorite.status
  const popularity = favorite.popularity

  return (
    <div className="mt-[0.5rem]">
      <div className="text-terminal-warning truncate">* {title}</div>
      <div className="flex gap-4 items-baseline">
        {mean_score && <span className="text-default-muted font-bold truncate">⭐{mean_score}</span>}
        {popularity && <span className="text-default-muted font-bold truncate"># {popularity}</span>}
        {type === "anime" && (favorite as FullAnimeFavorite).episodes && (
          <span className="text-default-muted font-bold truncate">
            🎞️ {(favorite as FullAnimeFavorite).episodes} EP&apos;s
          </span>
        )}
        {type === "manga" && (favorite as FullMangaFavorite).chapters && (
          <span className="text-default-muted font-bold truncate">
            📚 {(favorite as FullMangaFavorite).chapters} ch&apos;s
          </span>
        )}
        {release_year && <span className="text-default-muted font-bold truncate">📅 {release_year}</span>}
        {status && !isHalf && (
          <span
            className={`text-mal-${status === "Finished Airing" || status === "Finished" ? "completed" : "watching"} font-bold half:hidden truncate`}
          >
            ● {status}
          </span>
        )}
      </div>
      <div className="flex mt-1 gap-1">
        {genres.map((genre) => (
          <TerminalTag genre={genre} key={genre} />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FavoritesList({
  data,
  type,
  config,
  style,
  size,
  listStyle = "detailed",
}: FavoritesListProps): React.ReactElement {
  // Tratamento seguro de dados vazios
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <></>
  }

  // Limitar baseado na configuração (padrão 20)
  // Usar max específico da seção ou fallback para favorites_max global ou padrão 20
  let MAX_ITEMS = 20
  if (type === "anime" && config.anime_favorites_max !== undefined) {
    MAX_ITEMS = config.anime_favorites_max
  } else if (type === "manga" && config.manga_favorites_max !== undefined) {
    MAX_ITEMS = config.manga_favorites_max
  } else if (type === "people" && config.people_favorites_max !== undefined) {
    MAX_ITEMS = config.people_favorites_max
  } else if (type === "characters" && config.character_favorites_max !== undefined) {
    MAX_ITEMS = config.character_favorites_max
  } else {
    MAX_ITEMS = config.favorites_max ?? 20
  }
  const displayData = data.slice(0, MAX_ITEMS)

  // Obter configurações baseadas no tipo
  const getConfig = () => {
    switch (type) {
      case "anime":
        return {
          title: config.anime_favorites_title || "Anime Favorites",
          hideTitle: config.anime_favorites_hide_title ?? false,
          section: "anime_favorites",
        }
      case "manga":
        return {
          title: config.manga_favorites_title || "Manga Favorites",
          hideTitle: config.manga_favorites_hide_title ?? false,
          section: "manga_favorites",
        }
      case "people":
        return {
          title: config.people_favorites_title || "People Favorites",
          hideTitle: config.people_favorites_hide_title ?? false,
          section: "people_favorites",
        }
      case "characters":
        return {
          title: config.character_favorites_title || "Character Favorites",
          hideTitle: config.character_favorites_hide_title ?? false,
          section: "character_favorites",
        }
    }
  }

  const { title, hideTitle, section } = getConfig()
  const isHalf = size === "half"
  const hideOverlay = config.favorites_hide_overlay ?? false

  // Renderizar baseado no estilo de lista
  const renderContent = () => {
    switch (listStyle) {
      case "simple":
        return (
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <RenderSimpleFavorites data={displayData} hideOverlay={hideOverlay} size={size} />
          </>
        )

      case "compact":
        return (
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <div className="flex flex-col gap-1">
              {displayData.map((item, index) => (
                <DefaultCompactFavorite favorite={item} index={index} key={`${type}-${item.mal_id}-${index}`} />
              ))}
            </div>
          </>
        )

      case "detailed":
        // Apenas anime e manga suportam detailed
        if (type !== "anime" && type !== "manga") {
          return (
            <>
              {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
              <div className="flex flex-col gap-2">
                {displayData.map((item, index) => (
                  <DefaultCompactFavorite
                    favorite={item}
                    index={index}
                    key={`${type}-compact-fallback-${item.mal_id}-${index}`}
                  />
                ))}
              </div>
            </>
          )
        }
        return (
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <div className="flex flex-col gap-1">
              {displayData.map((item, index) => (
                <DefaultDetailedFavorite
                  favorite={item as FullAnimeFavorite | FullMangaFavorite}
                  isHalf={isHalf}
                  type={type}
                  key={`${type}-detailed-${item.mal_id}-${index}`}
                />
              ))}
            </div>
          </>
        )

      case "minimal":
        // Apenas anime e manga suportam minimal
        if (type !== "anime" && type !== "manga") {
          return (
            <>
              {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
              <div className="flex flex-col gap-2">
                {displayData.map((item, index) => (
                  <DefaultCompactFavorite
                    favorite={item}
                    index={index}
                    key={`${type}-compact-${item.mal_id}-${index}`}
                  />
                ))}
              </div>
            </>
          )
        }
        return (
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <div className="flex flex-col gap-2">
              {displayData.map((item, index) => (
                <DefaultMinimalFavorite
                  favorite={item as FullAnimeFavorite | FullMangaFavorite}
                  isHalf={isHalf}
                  type={type}
                  key={`${type}-minimal-${item.mal_id}-${index}`}
                />
              ))}
            </div>
          </>
        )
    }
  }

  const renderTerminalContent = () => {
    switch (listStyle) {
      case "simple":
        return (
          <>
            {!hideTitle && (
              <TerminalCommand
                command={getPseudoCommands({
                  plugin: "mal",
                  section: "favorites",
                  type,
                  limit: MAX_ITEMS,
                })}
              />
            )}
            {displayData.map((item, index) => (
              <div className="truncate" key={`${type}-simple-${item.mal_id}-${index}`}>
                <p className="sm-text font-semibold text-terminal-warning">
                  * {"name" in item ? treatJapaneseName(item.name) : item.title}
                </p>
                {"type" in item && "start_year" in item && (
                  <p className="sm-text font-semibold text-overflow text-terminal-muted">
                    ({item.type}, {item.start_year})
                  </p>
                )}
              </div>
            ))}
          </>
        )

      case "compact":
        return (
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: section,
                limit: MAX_ITEMS,
              })}
            />
            <div className="flex flex-col gap-1">
              {displayData.map((item, index) => (
                <TerminalCompactFavorite
                  favorite={item}
                  index={index}
                  key={`${type}-terminal-compact-${item.mal_id}-${index}`}
                />
              ))}
            </div>
          </>
        )

      case "detailed":
        // Apenas anime e manga suportam detailed
        if (type !== "anime" && type !== "manga") {
          return (
            <>
              <TerminalCommand
                command={getPseudoCommands({
                  plugin: "mal",
                  section: section,
                  limit: MAX_ITEMS,
                })}
              />
              <div className="flex flex-col gap-1">
                {displayData.map((item, index) => (
                  <TerminalCompactFavorite
                    favorite={item}
                    index={index}
                    key={`${type}-terminal-compact-${item.mal_id}-${index}`}
                  />
                ))}
              </div>
            </>
          )
        }
        return (
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: section,
                limit: MAX_ITEMS,
              })}
            />
            {displayData.map((item, index) => (
              <TerminalDetailedFavorite
                favorite={item as FullAnimeFavorite | FullMangaFavorite}
                isHalf={isHalf}
                type={type}
                key={`${type}-terminal-detailed-${item.mal_id}-${index}`}
              />
            ))}
          </>
        )

      case "minimal":
        // Apenas anime e manga suportam minimal
        if (type !== "anime" && type !== "manga") {
          return (
            <>
              <TerminalCommand
                command={getPseudoCommands({
                  plugin: "mal",
                  section: section,
                  limit: MAX_ITEMS,
                })}
              />
              <div className="flex flex-col gap-1">
                {displayData.map((item, index) => (
                  <TerminalCompactFavorite
                    favorite={item}
                    index={index}
                    key={`${type}-terminal-compact-${item.mal_id}-${index}`}
                  />
                ))}
              </div>
            </>
          )
        }
        return (
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "mal",
                section: section,
                limit: MAX_ITEMS,
              })}
            />
            {displayData.map((item, index) => (
              <TerminalMinimalFavorite
                favorite={item as FullAnimeFavorite | FullMangaFavorite}
                isHalf={isHalf}
                type={type}
                key={`${type}-terminal-minimal-${item.mal_id}-${index}`}
              />
            ))}
          </>
        )
    }
  }

  return (
    <section
      id={`mal-${type === "anime" ? "default-favorites-anime" : type === "manga" ? "default-favorites-manga" : type === "people" ? "people-favorites" : "characters-favorites"}`}
    >
      <RenderBasedOnStyle
        defaultComponent={renderContent()}
        terminalComponent={renderTerminalContent()}
        style={style}
      />
    </section>
  )
}
