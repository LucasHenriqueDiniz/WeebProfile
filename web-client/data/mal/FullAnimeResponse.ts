interface FullAnimeResponse {
  mal_id: number
  url: string
  images: {
    jpg: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
    webp: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  trailer: {
    youtube_id: string
    url: string
    embed_url: string
    images: {
      image_url: string
      small_image_url: string
      medium_image_url: string
      large_image_url: string
      maximum_image_url: string
    }
  }
  approved: boolean
  titles: {
    type: string
    title: string
  }[]
  title: string
  title_english: string
  title_japanese: string
  title_synonyms: string[]
  type: string
  source: string
  episodes: number
  status: string
  airing: boolean
  aired: {
    from: string
    to: string
    prop: {
      from: {
        day: number
        month: number
        year: number
      }
      to: {
        day: number
        month: number
        year: number
      }
    }
    string: string
  }
  duration: string
  rating: string
  score: number
  scored_by: number
  rank: number
  popularity: number
  members: number
  favorites: number
  synopsis: string
  background: string
  season: string
  year: number
  broadcast: {
    day: string
    time: string
    timezone: string
    string: string
  }
  producers: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  licensors: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  studios: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  genres: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  explicit_genres: any[]
  themes: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  demographics: any[]
  relations: {
    relation: string
    entry: {
      mal_id: number
      type: string
      name: string
      url: string
    }[]
  }[]
  theme: {
    openings: string[]
    endings: string[]
  }
  external: {
    name: string
    url: string
  }[]
  streaming: {
    name: string
    url: string
  }[]
}

export const exampleCharacterResponse: FullAnimeResponse = {
  mal_id: 5081,
  url: "https://myanimelist.net/anime/5081/Bakemonogatari",
  images: {
    jpg: {
      image_url: "https://cdn.myanimelist.net/images/anime/11/75274.jpg",
      small_image_url: "https://cdn.myanimelist.net/images/anime/11/75274t.jpg",
      large_image_url: "https://cdn.myanimelist.net/images/anime/11/75274l.jpg",
    },
    webp: {
      image_url: "https://cdn.myanimelist.net/images/anime/11/75274.webp",
      small_image_url: "https://cdn.myanimelist.net/images/anime/11/75274t.webp",
      large_image_url: "https://cdn.myanimelist.net/images/anime/11/75274l.webp",
    },
  },
  trailer: {
    youtube_id: "PugZi9QKL64",
    url: "https://www.youtube.com/watch?v=PugZi9QKL64",
    embed_url: "https://www.youtube.com/embed/PugZi9QKL64?enablejsapi=1&wmode=opaque&autoplay=1",
    images: {
      image_url: "https://img.youtube.com/vi/PugZi9QKL64/default.jpg",
      small_image_url: "https://img.youtube.com/vi/PugZi9QKL64/sddefault.jpg",
      medium_image_url: "https://img.youtube.com/vi/PugZi9QKL64/mqdefault.jpg",
      large_image_url: "https://img.youtube.com/vi/PugZi9QKL64/hqdefault.jpg",
      maximum_image_url: "https://img.youtube.com/vi/PugZi9QKL64/maxresdefault.jpg",
    },
  },
  approved: true,
  titles: [
    {
      type: "Default",
      title: "Bakemonogatari",
    },
    {
      type: "Synonym",
      title: "Ghostory",
    },
    {
      type: "Synonym",
      title: "Monstory",
    },
    {
      type: "Japanese",
      title: "化物語",
    },
    {
      type: "English",
      title: "Bakemonogatari",
    },
  ],
  title: "Bakemonogatari",
  title_english: "Bakemonogatari",
  title_japanese: "化物語",
  title_synonyms: ["Ghostory", "Monstory"],
  type: "TV",
  source: "Light novel",
  episodes: 15,
  status: "Finished Airing",
  airing: false,
  aired: {
    from: "2009-07-03T00:00:00+00:00",
    to: "2010-06-25T00:00:00+00:00",
    prop: {
      from: {
        day: 3,
        month: 7,
        year: 2009,
      },
      to: {
        day: 25,
        month: 6,
        year: 2010,
      },
    },
    string: "Jul 3, 2009 to Jun 25, 2010",
  },
  duration: "25 min per ep",
  rating: "R - 17+ (violence & profanity)",
  score: 8.32,
  scored_by: 739592,
  rank: 249,
  popularity: 93,
  members: 1420772,
  favorites: 49351,
  synopsis:
    "Koyomi Araragi, a third-year high school student, manages to survive a vampire attack with the help of Meme Oshino, a strange man residing in an abandoned building. Though being saved from vampirism and now a human again, several side effects such as superhuman healing abilities and enhanced vision still remain. Regardless, Araragi tries to live the life of a normal student, with the help of his friend and the class president, Tsubasa Hanekawa.\n\nWhen fellow classmate Hitagi Senjougahara falls down the stairs and is caught by Araragi, the boy realizes that the girl is unnaturally weightless. Despite Senjougahara's protests, Araragi insists he help her, deciding to enlist the aid of Oshino, the very man who had once helped him with his own predicament.\n\nThrough several tales involving demons and gods, Bakemonogatari follows Araragi as he attempts to help those who suffer from supernatural maladies.\n\n[Written by MAL Rewrite]",
  background: "Bakemonogatari adapts the first two volumes of NisiOisiN's Monogatari Series: First Season.",
  season: "summer",
  year: 2009,
  broadcast: {
    day: "Fridays",
    time: "23:00",
    timezone: "Asia/Tokyo",
    string: "Fridays at 23:00 (JST)",
  },
  producers: [
    {
      mal_id: 17,
      type: "anime",
      name: "Aniplex",
      url: "https://myanimelist.net/anime/producer/17/Aniplex",
    },
    {
      mal_id: 159,
      type: "anime",
      name: "Kodansha",
      url: "https://myanimelist.net/anime/producer/159/Kodansha",
    },
  ],
  licensors: [
    {
      mal_id: 493,
      type: "anime",
      name: "Aniplex of America",
      url: "https://myanimelist.net/anime/producer/493/Aniplex_of_America",
    },
  ],
  studios: [
    {
      mal_id: 44,
      type: "anime",
      name: "Shaft",
      url: "https://myanimelist.net/anime/producer/44/Shaft",
    },
  ],
  genres: [
    {
      mal_id: 7,
      type: "anime",
      name: "Mystery",
      url: "https://myanimelist.net/anime/genre/7/Mystery",
    },
    {
      mal_id: 22,
      type: "anime",
      name: "Romance",
      url: "https://myanimelist.net/anime/genre/22/Romance",
    },
    {
      mal_id: 37,
      type: "anime",
      name: "Supernatural",
      url: "https://myanimelist.net/anime/genre/37/Supernatural",
    },
  ],
  explicit_genres: [],
  themes: [
    {
      mal_id: 32,
      type: "anime",
      name: "Vampire",
      url: "https://myanimelist.net/anime/genre/32/Vampire",
    },
  ],
  demographics: [],
  relations: [
    {
      relation: "Adaptation",
      entry: [
        {
          mal_id: 14893,
          type: "manga",
          name: "Monogatari Series: First Season",
          url: "https://myanimelist.net/manga/14893/Monogatari_Series__First_Season",
        },
      ],
    },
    {
      relation: "Prequel",
      entry: [
        {
          mal_id: 15689,
          type: "anime",
          name: "Nekomonogatari: Kuro",
          url: "https://myanimelist.net/anime/15689/Nekomonogatari__Kuro",
        },
      ],
    },
    {
      relation: "Sequel",
      entry: [
        {
          mal_id: 11597,
          type: "anime",
          name: "Nisemonogatari",
          url: "https://myanimelist.net/anime/11597/Nisemonogatari",
        },
      ],
    },
    {
      relation: "Side Story",
      entry: [
        {
          mal_id: 32268,
          type: "anime",
          name: "Koyomimonogatari",
          url: "https://myanimelist.net/anime/32268/Koyomimonogatari",
        },
      ],
    },
    {
      relation: "Summary",
      entry: [
        {
          mal_id: 6948,
          type: "anime",
          name: "Bakemonogatari Recap",
          url: "https://myanimelist.net/anime/6948/Bakemonogatari_Recap",
        },
      ],
    },
    {
      relation: "Alternative Version",
      entry: [
        {
          mal_id: 51068,
          type: "anime",
          name: 'Manga "Bakemonogatari" Shaft Seisaku Tokubetsu PV',
          url: "https://myanimelist.net/anime/51068/Manga_Bakemonogatari_Shaft_Seisaku_Tokubetsu_PV",
        },
      ],
    },
    {
      relation: "Other",
      entry: [
        {
          mal_id: 30514,
          type: "anime",
          name: "Nisekoimonogatari",
          url: "https://myanimelist.net/anime/30514/Nisekoimonogatari",
        },
        {
          mal_id: 54209,
          type: "anime",
          name: "Minna to Manner wo Manabou",
          url: "https://myanimelist.net/anime/54209/Minna_to_Manner_wo_Manabou",
        },
      ],
    },
  ],
  theme: {
    openings: [
      '1: "staple stable" by Chiwa Saito (eps TV Broadcast: 2, 6-7, 11-12, BD/DVD: 1-2, 12)',
      '2: "Kaerimichi (帰り道)" by Emiri Katou (eps TV Broadcast: 4, BD/DVD: 3-5)',
      '3: "ambivalent world" by Miyuki Sawashiro (eps TV Broadcast: 8, BD/DVD: 6-8)',
      '4: "Ren\'ai Circulation (恋愛サーキュレーション)" by Kana Hanazawa (eps TV Broadcast: 10, BD/DVD: 9-10)',
      '5: "Sugar Sweet Nightmare" by Yui Horie (eps TV Broadcast: 14-15, BD/DVD: 11, 13-15)',
    ],
    endings: ['"Kimi no Shiranai Monogatari (君の知らない物語)" by supercell; performed by nagi (Gazelle)'],
  },
  external: [
    {
      name: "Official Site",
      url: "http://www.bakemonogatari.com/",
    },
    {
      name: "@nisioisin_anime",
      url: "https://twitter.com/nisioisin_anime",
    },
    {
      name: "AniDB",
      url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=6327",
    },
    {
      name: "ANN",
      url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=10196",
    },
    {
      name: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Bakemonogatari",
    },
    {
      name: "Wikipedia",
      url: "https://ja.wikipedia.org/wiki/%E5%8C%96%E7%89%A9%E8%AA%9E#%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1",
    },
    {
      name: "Syoboi",
      url: "https://cal.syoboi.jp/tid/1685",
    },
  ],
  streaming: [
    {
      name: "Crunchyroll",
      url: "http://www.crunchyroll.com/series-248954",
    },
    {
      name: "Netflix",
      url: "https://www.netflix.com/",
    },
  ],
}
