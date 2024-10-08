import { FaCalendar, FaHashtag, FaHeart, FaStar, FaVideo } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import DefaultTitle from "../../!templates/Default/Default_Title";
import { DefaultTag, TerminalTag } from "../../!templates/Genre_Tags";
import RenderBasedOnStyle from "../../!templates/RenderBasedOnStyle";
import TerminalCommand from "../../!templates/Terminal/Terminal_Command";
import TerminalLineBreak from "../../!templates/Terminal/Terminal_LineBreak";
import getEnvVariables from "../../../../utils/getEnvVariables";
import getPseudoCommands from "../../../../utils/getPseudoCommands";
import Img64 from "../../../base/ImageComponent";
import { FullMalAnimeResponse } from "../types/malFavoritesResponse";

function DefaultFavoriteImage({ favorite, isHalf }: { favorite: FullMalAnimeResponse; isHalf: boolean }): JSX.Element {
  const imageUrl = favorite.images.jpg?.base64;
  const title = favorite.title;
  const mean_score = favorite.score;
  const release_year = favorite.year || favorite.aired.prop.from.year;
  const synopsis = favorite.synopsis;
  const num_episodes = favorite.episodes;
  const genres = favorite.genres.map((genre) => genre.name);
  const status = favorite.status;
  const popularity = favorite.popularity;
  if (isHalf) {
    genres.splice(4);
  }

  return (
    <div className="flex h-120 overflow-hidden gap-8">
      <div className="full-favorite-image-container min-w-80 min-h-120">
        <Img64 url64={imageUrl} alt={title} className="fav-image" />
      </div>
      <div className="w100 flex-d justify-between overflow-hidden">
        <span className="favorite-title">{title}</span>
        <div className="flex gap-8 items-baseline">
          {mean_score && (
            <span className="color-primary md-text-bold flex items-center gap-2">
              <FaStar className="color-primary" size={14} /> {mean_score}
            </span>
          )}
          {popularity && (
            <span className="md-text-bold flex items-center gap-2">
              <FaHashtag size={14} color="inherit" />
              {popularity}
            </span>
          )}
          {num_episodes && (
            <span className="md-text-bold flex items-center gap-2">
              <FaVideo size={14} />
              {num_episodes}
            </span>
          )}
          {release_year && (
            <span className="md-text-bold flex items-center gap-2">
              <FaCalendar size={14} />
              {release_year}
            </span>
          )}
          {status && (
            <span className={`${status.toLowerCase().split(" ").join("-")} md-text-bold flex items-center gap-2 half:hidden`}>
              <GoDotFill size={14} color="inherit" />
              {status}
            </span>
          )}
        </div>
        <div className="flex mt-4 gap-4">
          {genres.map((genre) => (
            <DefaultTag key={genre} text={genre} />
          ))}
        </div>
        <div className="w100 overflow-hidden mt-4">
          <span className="synopsis line-clamp-2">{synopsis}</span>
        </div>
      </div>
    </div>
  );
}

function TerminalFavoriteImage({ favorite }: { favorite: FullMalAnimeResponse }): JSX.Element {
  const title = favorite.title;
  const mean_score = favorite.score;
  const release_year = favorite.year || favorite.aired.prop.from.year;
  const synopsis = favorite.synopsis;
  const num_episodes = favorite.episodes;
  const genres = favorite.genres.map((genre) => genre.name);
  const status = favorite.status;
  const popularity = favorite.popularity;

  return (
    <div className="sm-text">
      <div className="text-warning text-overflow text-nowrap">• {title}</div>
      <div className="flex gap-4 items-baseline">
        {mean_score && <span className="text-bold">⭐{mean_score}</span>}
        {popularity && <span className="text-bold">#{popularity}</span>}
        {num_episodes && <span className="text-bold">🎞️{num_episodes} eps</span>}
        {release_year && <span className="text-bold">📅{release_year}</span>}
        {status && <span className={`${status.toLowerCase().split(" ").join("-")} text-bold`}>●{status}</span>}
      </div>
      <div className="flex mt-2 gap-2">
        {genres.map((genre) => (
          <TerminalTag text={genre} />
        ))}
      </div>
      <div className="w100 overflow-hidden mt-2">
        <span className="synopsis line-clamp-2">{synopsis}</span>
      </div>
    </div>
  );
}
function AnimeFavorites({ favoritesData }: { favoritesData: FullMalAnimeResponse[] }): JSX.Element {
  const { pluginMal, size } = getEnvVariables();
  if (!pluginMal) throw new Error("pluginMal not found in env variables");

  const title = pluginMal.anime_favorites_title;
  const maxItems = pluginMal.anime_favorites_max;
  const hideTitle = pluginMal.anime_favorites_hide_title;
  const isHalf = size === "half";

  return (
    <section className="default-favorites">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaHeart />} />}
            <div className="flex-d gap-4">
              {favoritesData.map((data) => (
                <DefaultFavoriteImage favorite={data} key={data.mal_id} isHalf={isHalf} />
              ))}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "mal", section: "anime_favorites", username: pluginMal.username, limit: maxItems })} />
            {favoritesData.map((data) => (
              <TerminalFavoriteImage favorite={data} key={data.mal_id} />
            ))}
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  );
}

export default AnimeFavorites;
