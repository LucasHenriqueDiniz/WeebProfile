import type { AniListData } from "../types"

/**
 * Dados fixos para modo dev/preview e para os testes de altura.
 *
 * As capas ficam como URL do CDN do AniList: em previewMode elas são usadas como
 * estão, e fora dele o fetchData converte para data URI. Manter aqui uma URL real
 * mantém o mock parecido com o retorno de produção.
 *
 * O nome do arquivo no CDN leva um sufixo que não dá para derivar do id. Montada só
 * com o id (`bx5114.jpg`), a URL respondia 404, a capa virava null e os previews de
 * Favorite Anime e Currently Watching saíam com blocos vazios no lugar das capas. As
 * URLs abaixo são o `coverImage.medium` que a API devolveu em 18/11/2026.
 */
const COVER_FILES: Record<number, string> = {
  21: "bx21-ELSYx3yMPcKM.jpg",
  1535: "bx1535-kUgkcrfOrkUM.jpg",
  5114: "bx5114-nSWCgQlmOMtj.jpg",
  9253: "bx9253-tIUXF2gfU8Sg.jpg",
  11061: "bx11061-y5gsT1hoHuHw.png",
  16498: "bx16498-buvcRTBx4NSm.jpg",
  21519: "bx21519-SUo3ZQuCbYhJ.png",
  101922: "bx101922-WBsBl0ClmgYL.jpg",
}

const cover = (id: number) => `https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/${COVER_FILES[id]}`

export function getMockAniListData(): AniListData {
  return {
    username: "weebprofile",
    statistics: {
      animeCount: 412,
      episodesWatched: 7834,
      minutesWatched: 188_016,
      animeMeanScore: 78.4,
      mangaCount: 96,
      chaptersRead: 4210,
      volumesRead: 318,
      mangaMeanScore: 81.2,
    },
    favoritesAnime: [
      { id: 5114, title: "Fullmetal Alchemist: Brotherhood", cover: cover(5114) },
      { id: 9253, title: "Steins;Gate", cover: cover(9253) },
      { id: 11061, title: "Hunter x Hunter (2011)", cover: cover(11061) },
      { id: 1535, title: "Death Note", cover: cover(1535) },
      { id: 21519, title: "Kimi no Na wa.", cover: cover(21519) },
    ],
    currentlyWatching: [
      { id: 21, title: "One Piece", cover: cover(21), progress: 1094, totalEpisodes: null },
      { id: 16498, title: "Shingeki no Kyojin", cover: cover(16498), progress: 18, totalEpisodes: 25 },
      { id: 101922, title: "Kimetsu no Yaiba", cover: cover(101922), progress: 7, totalEpisodes: 26 },
    ],
  }
}
