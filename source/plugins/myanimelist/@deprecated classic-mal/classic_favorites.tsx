import React from "react";
import { ClassicFavoritesProps } from "../types/malTypes";
import { AnyMalFavorite, AnyMalFavoriteUnique } from "../../../../types/malFavoritesResponse";
import { ProfileHeader } from "./classic_components";
import Img64 from "../../../base/ImageComponent";

function FavoriteImage({ favorite }: { favorite: AnyMalFavoriteUnique }): JSX.Element {
  const imageUrl = favorite.images.jpg?.base64;
  const title = "name" in favorite ? favorite.name : favorite.title;
  const type = "type" in favorite ? favorite.type : null;
  const start_year = "start_year" in favorite ? favorite.start_year : null;
  const urlSrc = "url" in favorite ? favorite.url : "#";
  // @TODO // implement a way to not shown this ugly type and name
  return (
    <a href={urlSrc} className="image-link-container">
      <Img64 url64={imageUrl} alt={title} className="fav-image" />
      <div className="fav-overlay">
        <span className="fav-title">{title}</span>
        {type && (
          <span className="fav-type">
            {type}
            {start_year ? `•${start_year}` : ""}
          </span>
        )}
      </div>
    </a>
  );
}

function RenderFavorites(favoritesData: AnyMalFavorite) {
  return (
    <div className="favorites-slide">
      {favoritesData.map((data) => (
        <FavoriteImage favorite={data} key={data.mal_id} />
      ))}
    </div>
  );
}

function ClassicFavorites({ favoritesData, username, media }: ClassicFavoritesProps): JSX.Element {
  if (!favoritesData) {
    throw new Error(`No favorites data found  ${favoritesData} + ${username} + ${media}`);
  }

  // media = characters, people, manga, or anime
  const title = `${media.charAt(0).toUpperCase() + media.slice(1)} (${favoritesData.length})`;
  const secondTitle = `All ${media.charAt(0).toUpperCase() + media.slice(1)} Favorites`;
  const secondTitleHref = `https://myanimelist.net/profile/${username}/favorites`;

  const favoritesHtml = RenderFavorites(favoritesData);

  return (
    <div className="profile-stats half:flex-d">
      <ProfileHeader title={title} secondTitle={secondTitle} secondTitleHref={secondTitleHref} children={favoritesHtml} />
    </div>
  );
}

export default ClassicFavorites;
