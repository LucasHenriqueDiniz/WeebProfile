import {
  CharacterFavorites,
  FullMalAnimeResponse,
  MalFullMangaResponse,
  PeopleFavorites,
} from "../types/malFavoritesResponse"
import { MalLastUpdatesResponse } from "../types/malLastUpdatesResponse"
import { shuffleArray } from "helpers/array"

const baseData: {
  animes: FullMalAnimeResponse[]
  characters: CharacterFavorites[]
  mangas: MalFullMangaResponse[]
  people: PeopleFavorites[]
  updates: MalLastUpdatesResponse
} = {
  animes: [
    {
      mal_id: 5081,
      url: "https://myanimelist.net/anime/5081/Bakemonogatari",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/11/75274.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/11/75274.jpg",
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
      scored_by: 742718,
      rank: 253,
      popularity: 94,
      members: 1427351,
      favorites: 49575,
      synopsis:
        "Koyomi Araragi, a third-year high school student, manages to survive a vampire attack with the help of Meme Oshino, a strange man residing in an abandoned building. Though being saved from vampirism and now a human again, several side effects such as superhuman healing abilities and enhanced vision still remain. Regardless, Araragi tries to live the life of a normal student, with the help of his friend and the class president, Tsubasa Hanekawa.\n\nWhen fellow classmate Hitagi Senjougahara falls down the stairs and is caught by Araragi, the boy realizes that the girl is unnaturally weightless. Despite Senjougahara's protests, Araragi insists he help her, deciding to enlist the aid of Oshino, the very man who had once helped him with his own predicament.\n\nThrough several tales involving demons and gods, Bakemonogatari follows Araragi as he attempts to help those who suffer from supernatural maladies.\n\n[Written by MAL Rewrite],",
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
      themes: [
        {
          mal_id: 32,
          type: "anime",
          name: "Vampire",
          url: "https://myanimelist.net/anime/genre/32/Vampire",
        },
      ],
      demographics: [],
      theme: {
        openings: [],
        endings: [],
      },
    },
    {
      mal_id: 1698,
      url: "https://myanimelist.net/anime/1698/Nodame_Cantabile",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/anime/9/11986.jpg",
          image_url: "https://cdn.myanimelist.net/images/anime/9/11986.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/9/11986t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/9/11986l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/9/11986.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/9/11986t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/9/11986l.webp",
        },
      },
      trailer: {
        youtube_id: null,
        url: null,
        embed_url: null,
        images: {
          image_url: null,
          small_image_url: null,
          medium_image_url: null,
          large_image_url: null,
          maximum_image_url: null,
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Nodame Cantabile",
        },
        {
          type: "Japanese",
          title: "のだめカンタービレ",
        },
        {
          type: "English",
          title: "Nodame Cantabile",
        },
      ],
      title: "Nodame Cantabile",
      title_english: "Nodame Cantabile",
      title_japanese: "のだめカンタービレ",
      title_synonyms: [],
      type: "TV",
      source: "Manga",
      episodes: 23,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2007-01-12T00:00:00+00:00",
        to: "2007-06-15T00:00:00+00:00",
        prop: {
          from: {
            day: 12,
            month: 1,
            year: 2007,
          },
          to: {
            day: 15,
            month: 6,
            year: 2007,
          },
        },
        string: "Jan 12, 2007 to Jun 15, 2007",
      },
      duration: "22 min per ep",
      rating: "PG-13 - Teens 13 or older",
      score: 8.26,
      scored_by: 131130,
      rank: 322,
      popularity: 783,
      members: 319763,
      favorites: 4916,
      synopsis:
        "Shinichi Chiaki is a first class musician whose dream is to play among the elites in Europe. Coming from a distinguished family, he is an infamous perfectionist—not only is he highly critical of himself, but of others as well. The only thing stopping Shinichi from leaving for Europe is his fear of flying. As a result, he's grounded in Japan.\n\nDuring his fourth year at Japan's top music university, Shinichi happens to meet Megumi Noda or, as she refers to herself, Nodame. On the surface, she seems to be an unkempt girl with no direction in life. However, when Shinichi hears Nodame play the piano for the first time, he is in awe of the kind of music she creates. Nevertheless, Shinichi is dismayed to discover that Nodame is his neighbor, and worse, she ends up falling head over heels in love with him.\n\n[Written by MAL Rewrite]",
      background: "",
      season: "winter",
      year: 2007,
      broadcast: {
        day: "Thursdays",
        time: "21:00",
        timezone: "Asia/Tokyo",
        string: "Thursdays at 21:00 (JST)",
      },
      producers: [
        {
          mal_id: 53,
          type: "anime",
          name: "Dentsu",
          url: "https://myanimelist.net/anime/producer/53/Dentsu",
        },
        {
          mal_id: 79,
          type: "anime",
          name: "Genco",
          url: "https://myanimelist.net/anime/producer/79/Genco",
        },
        {
          mal_id: 147,
          type: "anime",
          name: "SKY Perfect Well Think",
          url: "https://myanimelist.net/anime/producer/147/SKY_Perfect_Well_Think",
        },
        {
          mal_id: 159,
          type: "anime",
          name: "Kodansha",
          url: "https://myanimelist.net/anime/producer/159/Kodansha",
        },
        {
          mal_id: 169,
          type: "anime",
          name: "Fuji TV",
          url: "https://myanimelist.net/anime/producer/169/Fuji_TV",
        },
        {
          mal_id: 306,
          type: "anime",
          name: "Magic Capsule",
          url: "https://myanimelist.net/anime/producer/306/Magic_Capsule",
        },
        {
          mal_id: 517,
          type: "anime",
          name: "Asmik Ace",
          url: "https://myanimelist.net/anime/producer/517/Asmik_Ace",
        },
        {
          mal_id: 757,
          type: "anime",
          name: "Sony Music Entertainment",
          url: "https://myanimelist.net/anime/producer/757/Sony_Music_Entertainment",
        },
        {
          mal_id: 769,
          type: "anime",
          name: "Fujipacific Music",
          url: "https://myanimelist.net/anime/producer/769/Fujipacific_Music",
        },
      ],
      licensors: [],
      studios: [
        {
          mal_id: 7,
          type: "anime",
          name: "J.C.Staff",
          url: "https://myanimelist.net/anime/producer/7/JCStaff",
        },
      ],
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 50,
          type: "anime",
          name: "Adult Cast",
          url: "https://myanimelist.net/anime/genre/50/Adult_Cast",
        },
        {
          mal_id: 19,
          type: "anime",
          name: "Music",
          url: "https://myanimelist.net/anime/genre/19/Music",
        },
      ],
      demographics: [
        {
          mal_id: 43,
          type: "anime",
          name: "Josei",
          url: "https://myanimelist.net/anime/genre/43/Josei",
        },
      ],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 419,
              type: "manga",
              name: "Nodame Cantabile",
              url: "https://myanimelist.net/manga/419/Nodame_Cantabile",
            },
          ],
        },
        {
          relation: "Sequel",
          entry: [
            {
              mal_id: 4477,
              type: "anime",
              name: "Nodame Cantabile: Paris-hen",
              url: "https://myanimelist.net/anime/4477/Nodame_Cantabile__Paris-hen",
            },
          ],
        },
        {
          relation: "Side Story",
          entry: [
            {
              mal_id: 3965,
              type: "anime",
              name: "Nodame Cantabile: Nodame to Chiaki no Umi Monogatari",
              url: "https://myanimelist.net/anime/3965/Nodame_Cantabile__Nodame_to_Chiaki_no_Umi_Monogatari",
            },
          ],
        },
        {
          relation: "Other",
          entry: [
            {
              mal_id: 5656,
              type: "anime",
              name: "PuriGorota: Uchuu no Yuujou Daibouken",
              url: "https://myanimelist.net/anime/5656/PuriGorota__Uchuu_no_Yuujou_Daibouken",
            },
            {
              mal_id: 29823,
              type: "anime",
              name: "Channel 5.5 3rd Season",
              url: "https://myanimelist.net/anime/29823/Channel_55_3rd_Season",
            },
          ],
        },
      ],
      theme: {
        openings: ['"Allegro Cantabile Sound" by SUEMITSU & THE SUEMITH'],
        endings: [
          '1: "Konna ni Chikaku de..." by Crystal Kay (eps 1-12)',
          '2: "Sagittarius" by SUEMITSU & THE NODAME ORCHESTRA (eps 13-23)',
        ],
      },
      external: [
        {
          name: "Official Site",
          url: "http://nodame-anime.com/season1/",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=4691",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=7010",
        },
        {
          name: "Wikipedia",
          url: "https://en.wikipedia.org/wiki/Nodame_Cantabile#Anime",
        },
        {
          name: "Wikipedia",
          url: "https://ja.wikipedia.org/wiki/%E3%81%AE%E3%81%A0%E3%82%81%E3%82%AB%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%93%E3%83%AC#%E3%82%A2%E3%83%8B%E3%83%A1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3",
        },
        {
          name: "Syoboi",
          url: "https://cal.syoboi.jp/tid/1025",
        },
      ],
      streaming: [],
    },
    {
      mal_id: 1535,
      url: "https://myanimelist.net/anime/1535/Death_Note",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/anime/1079/138100.jpg",
          image_url: "https://cdn.myanimelist.net/images/anime/1079/138100.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1079/138100t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1079/138100l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1079/138100.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1079/138100t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1079/138100l.webp",
        },
      },
      trailer: {
        youtube_id: "Vt_3c8BgxV4",
        url: "https://www.youtube.com/watch?v=Vt_3c8BgxV4",
        embed_url: "https://www.youtube.com/embed/Vt_3c8BgxV4?enablejsapi=1&wmode=opaque&autoplay=1",
        images: {
          image_url: "https://img.youtube.com/vi/Vt_3c8BgxV4/default.jpg",
          small_image_url: "https://img.youtube.com/vi/Vt_3c8BgxV4/sddefault.jpg",
          medium_image_url: "https://img.youtube.com/vi/Vt_3c8BgxV4/mqdefault.jpg",
          large_image_url: "https://img.youtube.com/vi/Vt_3c8BgxV4/hqdefault.jpg",
          maximum_image_url: "https://img.youtube.com/vi/Vt_3c8BgxV4/maxresdefault.jpg",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Death Note",
        },
        {
          type: "Synonym",
          title: "DN",
        },
        {
          type: "Japanese",
          title: "デスノート",
        },
        {
          type: "English",
          title: "Death Note",
        },
      ],
      title: "Death Note",
      title_english: "Death Note",
      title_japanese: "デスノート",
      title_synonyms: ["DN"],
      type: "TV",
      source: "Manga",
      episodes: 37,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2006-10-04T00:00:00+00:00",
        to: "2007-06-27T00:00:00+00:00",
        prop: {
          from: {
            day: 4,
            month: 10,
            year: 2006,
          },
          to: {
            day: 27,
            month: 6,
            year: 2007,
          },
        },
        string: "Oct 4, 2006 to Jun 27, 2007",
      },
      duration: "23 min per ep",
      rating: "R - 17+ (violence & profanity)",
      score: 8.62,
      scored_by: 2806412,
      rank: 89,
      popularity: 2,
      members: 3999773,
      favorites: 176086,
      synopsis:
        "Brutal murders, petty thefts, and senseless violence pollute the human world. In contrast, the realm of death gods is a humdrum, unchanging gambling den. The ingenious 17-year-old Japanese student Light Yagami and sadistic god of death Ryuk share one belief: their worlds are rotten.\n\nFor his own amusement, Ryuk drops his Death Note into the human world. Light stumbles upon it, deeming the first of its rules ridiculous: the human whose name is written in this note shall die. However, the temptation is too great, and Light experiments by writing a felon's name, which disturbingly enacts his first murder.\n\nAware of the terrifying godlike power that has fallen into his hands, Light—under the alias Kira—follows his wicked sense of justice with the ultimate goal of cleansing the world of all evil-doers. The meticulous mastermind detective L is already on his trail, but as Light's brilliance rivals L's, the grand chase for Kira turns into an intense battle of wits that can only end when one of them is dead.\n\n[Written by MAL Rewrite]",
      background: "",
      season: "fall",
      year: 2006,
      broadcast: {
        day: "Wednesdays",
        time: "00:56",
        timezone: "Asia/Tokyo",
        string: "Wednesdays at 00:56 (JST)",
      },
      producers: [
        {
          mal_id: 29,
          type: "anime",
          name: "VAP",
          url: "https://myanimelist.net/anime/producer/29/VAP",
        },
        {
          mal_id: 1003,
          type: "anime",
          name: "Nippon Television Network",
          url: "https://myanimelist.net/anime/producer/1003/Nippon_Television_Network",
        },
        {
          mal_id: 1365,
          type: "anime",
          name: "Shueisha",
          url: "https://myanimelist.net/anime/producer/1365/Shueisha",
        },
        {
          mal_id: 1791,
          type: "anime",
          name: "D.N. Dream Partners",
          url: "https://myanimelist.net/anime/producer/1791/DN_Dream_Partners",
        },
      ],
      licensors: [
        {
          mal_id: 119,
          type: "anime",
          name: "VIZ Media",
          url: "https://myanimelist.net/anime/producer/119/VIZ_Media",
        },
      ],
      studios: [
        {
          mal_id: 11,
          type: "anime",
          name: "Madhouse",
          url: "https://myanimelist.net/anime/producer/11/Madhouse",
        },
      ],
      genres: [
        {
          mal_id: 37,
          type: "anime",
          name: "Supernatural",
          url: "https://myanimelist.net/anime/genre/37/Supernatural",
        },
        {
          mal_id: 41,
          type: "anime",
          name: "Suspense",
          url: "https://myanimelist.net/anime/genre/41/Suspense",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 40,
          type: "anime",
          name: "Psychological",
          url: "https://myanimelist.net/anime/genre/40/Psychological",
        },
      ],
      demographics: [
        {
          mal_id: 27,
          type: "anime",
          name: "Shounen",
          url: "https://myanimelist.net/anime/genre/27/Shounen",
        },
      ],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 21,
              type: "manga",
              name: "Death Note",
              url: "https://myanimelist.net/manga/21/Death_Note",
            },
          ],
        },
        {
          relation: "Summary",
          entry: [
            {
              mal_id: 2994,
              type: "anime",
              name: "Death Note: Rewrite",
              url: "https://myanimelist.net/anime/2994/Death_Note__Rewrite",
            },
          ],
        },
      ],
      theme: {
        openings: [
          '1: "the WORLD" by Nightmare (eps 1-19)',
          '2: "What\'s up, people?!" by Maximum the Hormone (eps 30-37)',
        ],
        endings: [
          '1: "Alumina" by Nightmare (eps 1-19)',
          '2: "Zetsubō Billy" by Maximum the Hormone (eps 20-36)',
          '3: "Coda ~ Death Note" by Yoshihisa Hirano (eps 37)',
        ],
      },
      external: [
        {
          name: "Official Site",
          url: "http://www.ntv.co.jp/deathnote/",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=4563",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=6592",
        },
        {
          name: "Wikipedia",
          url: "https://en.wikipedia.org/wiki/Death_Note",
        },
        {
          name: "Wikipedia",
          url: "https://ja.wikipedia.org/wiki/DEATH_NOTE_%28%E3%82%A2%E3%83%8B%E3%83%A1%29",
        },
        {
          name: "Syoboi",
          url: "https://cal.syoboi.jp/tid/945",
        },
        {
          name: "Bangumi",
          url: "https://bgm.tv/subject/1773",
        },
      ],
      streaming: [
        {
          name: "Crunchyroll",
          url: "http://www.crunchyroll.com/series-278866",
        },
        {
          name: "Netflix",
          url: "https://www.netflix.com/title/70204970",
        },
        {
          name: "Shahid",
          url: "https://shahid.mbc.net/en/series/Death-Note/series-913256",
        },
      ],
    },
    {
      mal_id: 20785,
      url: "https://myanimelist.net/anime/20785/Mahouka_Koukou_no_Rettousei",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/11/61039.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/11/61039.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/11/61039t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/11/61039l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/11/61039.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/11/61039t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/11/61039l.webp",
        },
      },
      trailer: {
        youtube_id: "v5AOTuxt2XY",
        url: "https://www.youtube.com/watch?v=v5AOTuxt2XY",
        embed_url: "https://www.youtube.com/embed/v5AOTuxt2XY?enablejsapi=1&wmode=opaque&autoplay=1",
        images: {
          image_url: "https://img.youtube.com/vi/v5AOTuxt2XY/default.jpg",
          small_image_url: "https://img.youtube.com/vi/v5AOTuxt2XY/sddefault.jpg",
          medium_image_url: "https://img.youtube.com/vi/v5AOTuxt2XY/mqdefault.jpg",
          large_image_url: "https://img.youtube.com/vi/v5AOTuxt2XY/hqdefault.jpg",
          maximum_image_url: "https://img.youtube.com/vi/v5AOTuxt2XY/maxresdefault.jpg",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Mahouka Koukou no Rettousei",
        },
        {
          type: "Japanese",
          title: "魔法科高校の劣等生",
        },
        {
          type: "English",
          title: "The Irregular at Magic High School",
        },
        {
          type: "German",
          title: "The Irregular at Magic High School",
        },
        {
          type: "French",
          title: "The Irregular at Magic High School",
        },
      ],
      title: "Mahouka Koukou no Rettousei",
      title_english: "The Irregular at Magic High School",
      title_japanese: "魔法科高校の劣等生",
      title_synonyms: [],
      type: "TV",
      source: "Light novel",
      episodes: 26,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2014-04-06T00:00:00+00:00",
        to: "2014-09-28T00:00:00+00:00",
        prop: {
          from: {
            day: 6,
            month: 4,
            year: 2014,
          },
          to: {
            day: 28,
            month: 9,
            year: 2014,
          },
        },
        string: "Apr 6, 2014 to Sep 28, 2014",
      },
      duration: "23 min per ep",
      rating: "PG-13 - Teens 13 or older",
      score: 7.38,
      scored_by: 600642,
      rank: 2406,
      popularity: 139,
      members: 1096672,
      favorites: 11038,
      synopsis:
        'In the dawn of the 21st century, magic, long thought to be folklore and fairy tales, has become a systematized technology and is taught as a technical skill. In First High School, the institution for magicians, students are segregated into two groups based on their entrance exam scores: "Blooms," those who receive high scores, are assigned to the First Course, while "Weeds" are reserve students assigned to the Second Course.\n\nMahouka Koukou no Rettousei follows the siblings, Tatsuya and Miyuki Shiba, who are enrolled in First High School. Upon taking the exam, the prodigious Miyuki is placed in the First Course, while Tatsuya is relegated to the Second Course. Though his practical test scores and status as a "Weed" show him to be magically inept, he possesses extraordinary technical knowledge, physical combat capabilities, and unique magic techniques—making Tatsuya the irregular at a magical high school.\n\n[Written by MAL Rewrite]',
      background:
        "The anime closely follows the events of the first seven light novels (excluding the fifth novel: Summer Holiday Arc + 1). There are three video game adaptations of the series.",
      season: "spring",
      year: 2014,
      broadcast: {
        day: "Sundays",
        time: "00:30",
        timezone: "Asia/Tokyo",
        string: "Sundays at 00:30 (JST)",
      },
      producers: [
        {
          mal_id: 17,
          type: "anime",
          name: "Aniplex",
          url: "https://myanimelist.net/anime/producer/17/Aniplex",
        },
        {
          mal_id: 58,
          type: "anime",
          name: "Square Enix",
          url: "https://myanimelist.net/anime/producer/58/Square_Enix",
        },
        {
          mal_id: 166,
          type: "anime",
          name: "Movic",
          url: "https://myanimelist.net/anime/producer/166/Movic",
        },
        {
          mal_id: 681,
          type: "anime",
          name: "ASCII Media Works",
          url: "https://myanimelist.net/anime/producer/681/ASCII_Media_Works",
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
          mal_id: 11,
          type: "anime",
          name: "Madhouse",
          url: "https://myanimelist.net/anime/producer/11/Madhouse",
        },
      ],
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
        {
          mal_id: 82,
          type: "anime",
          name: "Urban Fantasy",
          url: "https://myanimelist.net/anime/genre/82/Urban_Fantasy",
        },
      ],
      demographics: [],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 34127,
              type: "manga",
              name: "Mahouka Koukou no Rettousei",
              url: "https://myanimelist.net/manga/34127/Mahouka_Koukou_no_Rettousei",
            },
          ],
        },
        {
          relation: "Prequel",
          entry: [
            {
              mal_id: 48375,
              type: "anime",
              name: "Mahouka Koukou no Rettousei: Tsuioku-hen",
              url: "https://myanimelist.net/anime/48375/Mahouka_Koukou_no_Rettousei__Tsuioku-hen",
            },
          ],
        },
        {
          relation: "Sequel",
          entry: [
            {
              mal_id: 40497,
              type: "anime",
              name: "Mahouka Koukou no Rettousei: Raihousha-hen",
              url: "https://myanimelist.net/anime/40497/Mahouka_Koukou_no_Rettousei__Raihousha-hen",
            },
          ],
        },
        {
          relation: "Spin-Off",
          entry: [
            {
              mal_id: 45572,
              type: "anime",
              name: "Mahouka Koukou no Yuutousei",
              url: "https://myanimelist.net/anime/45572/Mahouka_Koukou_no_Yuutousei",
            },
          ],
        },
        {
          relation: "Other",
          entry: [
            {
              mal_id: 23341,
              type: "anime",
              name: "Yoku Wakaru Mahouka!",
              url: "https://myanimelist.net/anime/23341/Yoku_Wakaru_Mahouka",
            },
            {
              mal_id: 50097,
              type: "anime",
              name: "Mahouka Koukou no Rettousei 10-shuunen Kinen PV",
              url: "https://myanimelist.net/anime/50097/Mahouka_Koukou_no_Rettousei_10-shuunen_Kinen_PV",
            },
          ],
        },
      ],
      theme: {
        openings: ['1: "Rising Hope" by LiSA (eps 2-3, 5-13)', '2: "grilletto" by GARNiDELiA (eps 14-26)'],
        endings: [
          '1: "Rising Hope" by LiSA (eps 1)',
          '2: "Millenario (ミレナリオ)" by ELISA (eps 2-13, 18)',
          '3: "Mirror" by Rei Yasuda (eps 14-17, 19-26)',
        ],
      },
      external: [
        {
          name: "Official Site",
          url: "https://mahouka.jp/1st/",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=10182",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=15763",
        },
        {
          name: "Wikipedia",
          url: "https://en.wikipedia.org/wiki/The_Irregular_at_Magic_High_School",
        },
      ],
      streaming: [
        {
          name: "Crunchyroll",
          url: "http://www.crunchyroll.com/series-260315",
        },
        {
          name: "Netflix",
          url: "https://www.netflix.com/",
        },
      ],
    },
    {
      mal_id: 30831,
      url: "https://myanimelist.net/anime/30831/Kono_Subarashii_Sekai_ni_Shukufuku_wo",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/1895/142748.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/1895/142748.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1895/142748t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1895/142748l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1895/142748.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1895/142748t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1895/142748l.webp",
        },
      },
      trailer: {
        youtube_id: "NU87y-38glA",
        url: "https://www.youtube.com/watch?v=NU87y-38glA",
        embed_url: "https://www.youtube.com/embed/NU87y-38glA?enablejsapi=1&wmode=opaque&autoplay=1",
        images: {
          image_url: "https://img.youtube.com/vi/NU87y-38glA/default.jpg",
          small_image_url: "https://img.youtube.com/vi/NU87y-38glA/sddefault.jpg",
          medium_image_url: "https://img.youtube.com/vi/NU87y-38glA/mqdefault.jpg",
          large_image_url: "https://img.youtube.com/vi/NU87y-38glA/hqdefault.jpg",
          maximum_image_url: "https://img.youtube.com/vi/NU87y-38glA/maxresdefault.jpg",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Kono Subarashii Sekai ni Shukufuku wo!",
        },
        {
          type: "Synonym",
          title: "Give Blessings to This Wonderful World!",
        },
        {
          type: "Japanese",
          title: "この素晴らしい世界に祝福を！",
        },
        {
          type: "English",
          title: "KonoSuba: God's Blessing on This Wonderful World!",
        },
        {
          type: "German",
          title: "KonoSuba: God's Blessing on This Wonderful World!",
        },
        {
          type: "Spanish",
          title: "KonoSuba: God's blessing on this wonderful world!",
        },
        {
          type: "French",
          title: "KonoSuba: God's Blessing on This Wonderful World!",
        },
      ],
      title: "Kono Subarashii Sekai ni Shukufuku wo!",
      title_english: "KonoSuba: God's Blessing on This Wonderful World!",
      title_japanese: "この素晴らしい世界に祝福を！",
      title_synonyms: ["Give Blessings to This Wonderful World!"],
      type: "TV",
      source: "Light novel",
      episodes: 10,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2016-01-14T00:00:00+00:00",
        to: "2016-03-17T00:00:00+00:00",
        prop: {
          from: {
            day: 14,
            month: 1,
            year: 2016,
          },
          to: {
            day: 17,
            month: 3,
            year: 2016,
          },
        },
        string: "Jan 14, 2016 to Mar 17, 2016",
      },
      duration: "23 min per ep",
      rating: "PG-13 - Teens 13 or older",
      score: 8.1,
      scored_by: 1306437,
      rank: 510,
      popularity: 38,
      members: 2020193,
      favorites: 45949,
      synopsis:
        "After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named Aqua. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer's dream—a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake—Aqua is completely useless!\n\nUnfortunately, their troubles don't end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!\n\n[Written by MAL Rewrite]",
      background:
        "Kono Subarashii Sekai ni Shukufuku wo! adapts the first 2 volumes of Natsume Akatsuki's light novel series of the same name.",
      season: "winter",
      year: 2016,
      broadcast: {
        day: "Thursdays",
        time: "01:05",
        timezone: "Asia/Tokyo",
        string: "Thursdays at 01:05 (JST)",
      },
      producers: [
        {
          mal_id: 213,
          type: "anime",
          name: "Half H.P Studio",
          url: "https://myanimelist.net/anime/producer/213/Half_HP_Studio",
        },
        {
          mal_id: 323,
          type: "anime",
          name: "Nippon Columbia",
          url: "https://myanimelist.net/anime/producer/323/Nippon_Columbia",
        },
        {
          mal_id: 460,
          type: "anime",
          name: "KlockWorx",
          url: "https://myanimelist.net/anime/producer/460/KlockWorx",
        },
        {
          mal_id: 737,
          type: "anime",
          name: "Sony Music Communications",
          url: "https://myanimelist.net/anime/producer/737/Sony_Music_Communications",
        },
        {
          mal_id: 882,
          type: "anime",
          name: "Toranoana",
          url: "https://myanimelist.net/anime/producer/882/Toranoana",
        },
        {
          mal_id: 1185,
          type: "anime",
          name: "81 Produce",
          url: "https://myanimelist.net/anime/producer/1185/81_Produce",
        },
        {
          mal_id: 1551,
          type: "anime",
          name: "Kadokawa Media House",
          url: "https://myanimelist.net/anime/producer/1551/Kadokawa_Media_House",
        },
        {
          mal_id: 1696,
          type: "anime",
          name: "Kadokawa",
          url: "https://myanimelist.net/anime/producer/1696/Kadokawa",
        },
      ],
      licensors: [
        {
          mal_id: 467,
          type: "anime",
          name: "Discotek Media",
          url: "https://myanimelist.net/anime/producer/467/Discotek_Media",
        },
        {
          mal_id: 1468,
          type: "anime",
          name: "Crunchyroll",
          url: "https://myanimelist.net/anime/producer/1468/Crunchyroll",
        },
      ],
      studios: [
        {
          mal_id: 37,
          type: "anime",
          name: "Studio Deen",
          url: "https://myanimelist.net/anime/producer/37/Studio_Deen",
        },
      ],
      genres: [
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 62,
          type: "anime",
          name: "Isekai",
          url: "https://myanimelist.net/anime/genre/62/Isekai",
        },
        {
          mal_id: 20,
          type: "anime",
          name: "Parody",
          url: "https://myanimelist.net/anime/genre/20/Parody",
        },
      ],
      demographics: [],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 60553,
              type: "manga",
              name: "Kono Subarashii Sekai ni Shukufuku wo!",
              url: "https://myanimelist.net/manga/60553/Kono_Subarashii_Sekai_ni_Shukufuku_wo",
            },
          ],
        },
        {
          relation: "Sequel",
          entry: [
            {
              mal_id: 32937,
              type: "anime",
              name: "Kono Subarashii Sekai ni Shukufuku wo! 2",
              url: "https://myanimelist.net/anime/32937/Kono_Subarashii_Sekai_ni_Shukufuku_wo_2",
            },
          ],
        },
        {
          relation: "Side Story",
          entry: [
            {
              mal_id: 32380,
              type: "anime",
              name: "Kono Subarashii Sekai ni Shukufuku wo!: Kono Subarashii Choker ni Shukufuku wo!",
              url: "https://myanimelist.net/anime/32380/Kono_Subarashii_Sekai_ni_Shukufuku_wo__Kono_Subarashii_Choker_ni_Shukufuku_wo",
            },
          ],
        },
        {
          relation: "Spin-Off",
          entry: [
            {
              mal_id: 51958,
              type: "anime",
              name: "Kono Subarashii Sekai ni Bakuen wo!",
              url: "https://myanimelist.net/anime/51958/Kono_Subarashii_Sekai_ni_Bakuen_wo",
            },
          ],
        },
        {
          relation: "Character",
          entry: [
            {
              mal_id: 38472,
              type: "anime",
              name: "Isekai Quartet",
              url: "https://myanimelist.net/anime/38472/Isekai_Quartet",
            },
            {
              mal_id: 39988,
              type: "anime",
              name: "Isekai Quartet 2",
              url: "https://myanimelist.net/anime/39988/Isekai_Quartet_2",
            },
            {
              mal_id: 41567,
              type: "anime",
              name: "Isekai Quartet Movie: Another World",
              url: "https://myanimelist.net/anime/41567/Isekai_Quartet_Movie__Another_World",
            },
          ],
        },
      ],
      theme: {
        openings: ['"fantastic dreamer" by Machico (eps 2-10)'],
        endings: [
          '1: "fantastic dreamer" by Machico (eps 1)',
          '2: "Chiisana Boukensha (ちいさな冒険者)" by Aqua (Sora Amamiya), Megumin (Rie Takahashi), Darkness (Ai Kayano) (eps 2-10)',
        ],
      },
      external: [
        {
          name: "Official Site",
          url: "https://web.archive.org/web/20211129084255/https://www.konosuba.com/",
        },
        {
          name: "@konosubaanime",
          url: "https://twitter.com/konosubaanime",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=11261",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=17123",
        },
        {
          name: "Wikipedia",
          url: "https://en.wikipedia.org/wiki/KonoSuba",
        },
        {
          name: "Wikipedia",
          url: "https://ja.wikipedia.org/wiki/%E3%81%93%E3%81%AE%E7%B4%A0%E6%99%B4%E3%82%89%E3%81%97%E3%81%84%E4%B8%96%E7%95%8C%E3%81%AB%E7%A5%9D%E7%A6%8F%E3%82%92%21",
        },
        {
          name: "Syoboi",
          url: "https://cal.syoboi.jp/tid/4016",
        },
      ],
      streaming: [
        {
          name: "Crunchyroll",
          url: "http://www.crunchyroll.com/series-269071",
        },
        {
          name: "Netflix",
          url: "https://www.netflix.com/",
        },
      ],
    },
    {
      mal_id: 3702,
      url: "https://myanimelist.net/anime/3702/Detroit_Metal_City",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/3/9853.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/3/9853.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/3/9853t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/3/9853l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/3/9853.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/3/9853t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/3/9853l.webp",
        },
      },
      trailer: {
        youtube_id: "4I76lDIPotQ",
        url: "https://www.youtube.com/watch?v=4I76lDIPotQ",
        embed_url: "https://www.youtube.com/embed/4I76lDIPotQ?enablejsapi=1&wmode=opaque&autoplay=1",
        images: {
          image_url: "https://img.youtube.com/vi/4I76lDIPotQ/default.jpg",
          small_image_url: "https://img.youtube.com/vi/4I76lDIPotQ/sddefault.jpg",
          medium_image_url: "https://img.youtube.com/vi/4I76lDIPotQ/mqdefault.jpg",
          large_image_url: "https://img.youtube.com/vi/4I76lDIPotQ/hqdefault.jpg",
          maximum_image_url: "https://img.youtube.com/vi/4I76lDIPotQ/maxresdefault.jpg",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Detroit Metal City",
        },
        {
          type: "Synonym",
          title: "DMC",
        },
        {
          type: "Japanese",
          title: "デトロイト・メタル・シティ",
        },
        {
          type: "English",
          title: "Detroit Metal City",
        },
      ],
      title: "Detroit Metal City",
      title_english: "Detroit Metal City",
      title_japanese: "デトロイト・メタル・シティ",
      title_synonyms: ["DMC"],
      type: "OVA",
      source: "Manga",
      episodes: 12,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2008-08-08T00:00:00+00:00",
        to: "2008-10-28T00:00:00+00:00",
        prop: {
          from: {
            day: 8,
            month: 8,
            year: 2008,
          },
          to: {
            day: 28,
            month: 10,
            year: 2008,
          },
        },
        string: "Aug 8, 2008 to Oct 28, 2008",
      },
      duration: "14 min per ep",
      rating: "R - 17+ (violence & profanity)",
      score: 8.09,
      scored_by: 110527,
      rank: 521,
      popularity: 1174,
      members: 215966,
      favorites: 3271,
      synopsis:
        "Dominating the world of indie music, Detroit Metal City (DMC) is a popular death metal band known for its captivatingly dark and crude style. Its extravagant lead singer, Johannes Krauser II, is especially infamous as a demonic being who has risen from the fiery pits of hell itself in order to bring the world to its knees and lord over all mortals—or at least that's what he's publicized to be.\n\nUnbeknownst to his many worshippers, Krauser II is just the alter ego of an average college graduate named Souichi Negishi. Although he is soft-spoken, peace-loving, and would rather listen to Swedish pop all day, he must participate in DMC's garish concerts in order to make ends meet. Detroit Metal City chronicles Negishi's hilarious misadventures as he attempts to juggle his hectic band life, a seemingly budding romance, and dealing with his incredibly obsessive and dedicated fans.\n\n[Written by MAL Rewrite]",
      background: "Detroit Metal City's name originated from the song Detroit Rock City by the band KISS.",
      season: null,
      year: null,
      broadcast: {
        day: null,
        time: null,
        timezone: null,
        string: null,
      },
      producers: [
        {
          mal_id: 757,
          type: "anime",
          name: "Sony Music Entertainment",
          url: "https://myanimelist.net/anime/producer/757/Sony_Music_Entertainment",
        },
        {
          mal_id: 1584,
          type: "anime",
          name: "Beyond C.",
          url: "https://myanimelist.net/anime/producer/1584/Beyond_C",
        },
      ],
      licensors: [
        {
          mal_id: 376,
          type: "anime",
          name: "Sentai Filmworks",
          url: "https://myanimelist.net/anime/producer/376/Sentai_Filmworks",
        },
      ],
      studios: [
        {
          mal_id: 13,
          type: "anime",
          name: "Studio 4°C",
          url: "https://myanimelist.net/anime/producer/13/Studio_4%C2%B0C",
        },
      ],
      genres: [
        {
          mal_id: 4,
          type: "anime",
          name: "Comedy",
          url: "https://myanimelist.net/anime/genre/4/Comedy",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 50,
          type: "anime",
          name: "Adult Cast",
          url: "https://myanimelist.net/anime/genre/50/Adult_Cast",
        },
        {
          mal_id: 57,
          type: "anime",
          name: "Gag Humor",
          url: "https://myanimelist.net/anime/genre/57/Gag_Humor",
        },
        {
          mal_id: 19,
          type: "anime",
          name: "Music",
          url: "https://myanimelist.net/anime/genre/19/Music",
        },
        {
          mal_id: 20,
          type: "anime",
          name: "Parody",
          url: "https://myanimelist.net/anime/genre/20/Parody",
        },
        {
          mal_id: 75,
          type: "anime",
          name: "Showbiz",
          url: "https://myanimelist.net/anime/genre/75/Showbiz",
        },
      ],
      demographics: [
        {
          mal_id: 42,
          type: "anime",
          name: "Seinen",
          url: "https://myanimelist.net/anime/genre/42/Seinen",
        },
      ],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 1735,
              type: "manga",
              name: "Detroit Metal City",
              url: "https://myanimelist.net/manga/1735/Detroit_Metal_City",
            },
          ],
        },
        {
          relation: "Summary",
          entry: [
            {
              mal_id: 5065,
              type: "anime",
              name: "Detroit Metal City: Birth of the Metal Devil",
              url: "https://myanimelist.net/anime/5065/Detroit_Metal_City__Birth_of_the_Metal_Devil",
            },
          ],
        },
      ],
      theme: {
        openings: ['"Satsugai" by Detroit Metal City / Soichi Negishi (Yuuji Ueda)'],
        endings: ['"Amai Koibito (甘い恋人)" by Hideki Kaji'],
      },
      external: [
        {
          name: "Official Site",
          url: "http://www.younganimal.com/dmc_movie/dmc_moviedetail.html",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=5587",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=10172",
        },
        {
          name: "Wikipedia",
          url: "http://en.wikipedia.org/wiki/Detroit_Metal_City",
        },
        {
          name: "Wikipedia",
          url: "https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%88%E3%83%AD%E3%82%A4%E3%83%88%E3%83%BB%E3%83%A1%E3%82%BF%E3%83%AB%E3%83%BB%E3%82%B7%E3%83%86%E3%82%A3",
        },
        {
          name: "Syoboi",
          url: "https://cal.syoboi.jp/tid/1572",
        },
      ],
      streaming: [
        {
          name: "HIDIVE",
          url: "https://www.hidive.com/tv/detroit-metal-city",
        },
      ],
    },
    {
      mal_id: 4224,
      url: "https://myanimelist.net/anime/4224/Toradora",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/13/22128.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/13/22128.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/13/22128t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/13/22128l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/13/22128.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/13/22128t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/13/22128l.webp",
        },
      },
      trailer: {
        youtube_id: "ya570uUgQNc",
        url: "https://www.youtube.com/watch?v=ya570uUgQNc",
        embed_url: "https://www.youtube.com/embed/ya570uUgQNc?enablejsapi=1&wmode=opaque&autoplay=1",
        images: {
          image_url: "https://img.youtube.com/vi/ya570uUgQNc/default.jpg",
          small_image_url: "https://img.youtube.com/vi/ya570uUgQNc/sddefault.jpg",
          medium_image_url: "https://img.youtube.com/vi/ya570uUgQNc/mqdefault.jpg",
          large_image_url: "https://img.youtube.com/vi/ya570uUgQNc/hqdefault.jpg",
          maximum_image_url: "https://img.youtube.com/vi/ya570uUgQNc/maxresdefault.jpg",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Toradora!",
        },
        {
          type: "Synonym",
          title: "Tiger X Dragon",
        },
        {
          type: "Japanese",
          title: "とらドラ！",
        },
        {
          type: "English",
          title: "Toradora!",
        },
      ],
      title: "Toradora!",
      title_english: "Toradora!",
      title_japanese: "とらドラ！",
      title_synonyms: ["Tiger X Dragon"],
      type: "TV",
      source: "Light novel",
      episodes: 25,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2008-10-02T00:00:00+00:00",
        to: "2009-03-26T00:00:00+00:00",
        prop: {
          from: {
            day: 2,
            month: 10,
            year: 2008,
          },
          to: {
            day: 26,
            month: 3,
            year: 2009,
          },
        },
        string: "Oct 2, 2008 to Mar 26, 2009",
      },
      duration: "23 min per ep",
      rating: "PG-13 - Teens 13 or older",
      score: 8.06,
      scored_by: 1405547,
      rank: 563,
      popularity: 25,
      members: 2249605,
      favorites: 57054,
      synopsis:
        'Ryuuji Takasu is a gentle high school student with a love for housework; but in contrast to his kind nature, he has an intimidating face that often gets him labeled as a delinquent. On the other hand is Taiga Aisaka, a small, doll-like student, who is anything but a cute and fragile girl. Equipped with a wooden katana and feisty personality, Taiga is known throughout the school as the "Palmtop Tiger."\n\nOne day, an embarrassing mistake causes the two students to cross paths. Ryuuji discovers that Taiga actually has a sweet side: she has a crush on the popular vice president, Yuusaku Kitamura, who happens to be his best friend. But things only get crazier when Ryuuji reveals that he has a crush on Minori Kushieda—Taiga\'s best friend!\n\nToradora! is a romantic comedy that follows this odd duo as they embark on a quest to help each other with their respective crushes, forming an unlikely alliance in the process.\n\n[Written by MAL Rewrite]',
      background:
        "Toradora! was selected as a recommended work by the awards jury of the 13th Japan Media Arts Festival in 2009. The light novel was also adapted into a video game for PlayStation Portable, released only in Japan and published by Namco Bandai Games in 2009.",
      season: "fall",
      year: 2008,
      broadcast: {
        day: "Thursdays",
        time: "01:20",
        timezone: "Asia/Tokyo",
        string: "Thursdays at 01:20 (JST)",
      },
      producers: [
        {
          mal_id: 79,
          type: "anime",
          name: "Genco",
          url: "https://myanimelist.net/anime/producer/79/Genco",
        },
        {
          mal_id: 92,
          type: "anime",
          name: "Starchild Records",
          url: "https://myanimelist.net/anime/producer/92/Starchild_Records",
        },
        {
          mal_id: 127,
          type: "anime",
          name: "Yomiko Advertising",
          url: "https://myanimelist.net/anime/producer/127/Yomiko_Advertising",
        },
        {
          mal_id: 306,
          type: "anime",
          name: "Magic Capsule",
          url: "https://myanimelist.net/anime/producer/306/Magic_Capsule",
        },
        {
          mal_id: 717,
          type: "anime",
          name: "TV Tokyo Music",
          url: "https://myanimelist.net/anime/producer/717/TV_Tokyo_Music",
        },
      ],
      licensors: [
        {
          mal_id: 372,
          type: "anime",
          name: "NIS America, Inc.",
          url: "https://myanimelist.net/anime/producer/372/NIS_America_Inc",
        },
      ],
      studios: [
        {
          mal_id: 7,
          type: "anime",
          name: "J.C.Staff",
          url: "https://myanimelist.net/anime/producer/7/JCStaff",
        },
      ],
      genres: [
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 64,
          type: "anime",
          name: "Love Polygon",
          url: "https://myanimelist.net/anime/genre/64/Love_Polygon",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
      ],
      demographics: [],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 7149,
              type: "manga",
              name: "Toradora!",
              url: "https://myanimelist.net/manga/7149/Toradora",
            },
          ],
        },
        {
          relation: "Side Story",
          entry: [
            {
              mal_id: 6127,
              type: "anime",
              name: "Toradora!: SOS! Kuishinbou Banbanzai",
              url: "https://myanimelist.net/anime/6127/Toradora__SOS_Kuishinbou_Banbanzai",
            },
            {
              mal_id: 51200,
              type: "anime",
              name: "Ami no Monomane 150 Renpatsu",
              url: "https://myanimelist.net/anime/51200/Ami_no_Monomane_150_Renpatsu",
            },
            {
              mal_id: 11553,
              type: "anime",
              name: "Toradora!: Bentou no Gokui",
              url: "https://myanimelist.net/anime/11553/Toradora__Bentou_no_Gokui",
            },
          ],
        },
        {
          relation: "Summary",
          entry: [
            {
              mal_id: 23701,
              type: "anime",
              name: "Toradora! Recap",
              url: "https://myanimelist.net/anime/23701/Toradora_Recap",
            },
          ],
        },
      ],
      theme: {
        openings: [
          '1: "Pre-Parade (プレパレード)" by Rie Kugimiya, Yui Horie, and Eri Kitamura (eps 1-16)',
          '2: "silky heart" by Yui Horie (eps 17-24)',
        ],
        endings: [
          '1: "Vanilla Salt (バニラソルト)" by Yui Horie (eps 1-16)',
          '2: "Orange (オレンジ)" by Rie Kugimiya, Yui Horie, and Eri Kitamura (eps 17-18, 20-25)',
          '3: "Holy Night (ホーリーナイト)" by Rie Kugimiya and Eri Kitamura (eps 19)',
        ],
      },
      external: [
        {
          name: "Official Site",
          url: "https://www.tv-tokyo.co.jp/anime/toradora/",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=5909",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=10050",
        },
        {
          name: "Wikipedia",
          url: "https://en.wikipedia.org/wiki/Toradora!",
        },
      ],
      streaming: [
        {
          name: "Crunchyroll",
          url: "http://www.crunchyroll.com/series-249364",
        },
        {
          name: "Netflix",
          url: "https://www.netflix.com/title/80049275",
        },
      ],
    },
    {
      mal_id: 39535,
      url: "https://myanimelist.net/anime/39535/Mushoku_Tensei__Isekai_Ittara_Honki_Dasu",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/1530/117776.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/1530/117776.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1530/117776t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1530/117776l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1530/117776.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1530/117776t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1530/117776l.webp",
        },
      },
      trailer: {
        youtube_id: "Qx01pn9l-6g",
        url: "https://www.youtube.com/watch?v=Qx01pn9l-6g",
        embed_url: "https://www.youtube.com/embed/Qx01pn9l-6g?enablejsapi=1&wmode=opaque&autoplay=1",
        images: {
          image_url: "https://img.youtube.com/vi/Qx01pn9l-6g/default.jpg",
          small_image_url: "https://img.youtube.com/vi/Qx01pn9l-6g/sddefault.jpg",
          medium_image_url: "https://img.youtube.com/vi/Qx01pn9l-6g/mqdefault.jpg",
          large_image_url: "https://img.youtube.com/vi/Qx01pn9l-6g/hqdefault.jpg",
          maximum_image_url: "https://img.youtube.com/vi/Qx01pn9l-6g/maxresdefault.jpg",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Mushoku Tensei: Isekai Ittara Honki Dasu",
        },
        {
          type: "Synonym",
          title: "Jobless Reincarnation: I Will Seriously Try If I Go To Another World",
        },
        {
          type: "Japanese",
          title: "無職転生 ～異世界行ったら本気だす～",
        },
        {
          type: "English",
          title: "Mushoku Tensei: Jobless Reincarnation",
        },
        {
          type: "German",
          title: "Mushoku Tensei: Jobless Reincarnation",
        },
        {
          type: "French",
          title: "Mushoku Tensei: Jobless Reincarnation",
        },
      ],
      title: "Mushoku Tensei: Isekai Ittara Honki Dasu",
      title_english: "Mushoku Tensei: Jobless Reincarnation",
      title_japanese: "無職転生 ～異世界行ったら本気だす～",
      title_synonyms: ["Jobless Reincarnation: I Will Seriously Try If I Go To Another World"],
      type: "TV",
      source: "Light novel",
      episodes: 11,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2021-01-11T00:00:00+00:00",
        to: "2021-03-22T00:00:00+00:00",
        prop: {
          from: {
            day: 11,
            month: 1,
            year: 2021,
          },
          to: {
            day: 22,
            month: 3,
            year: 2021,
          },
        },
        string: "Jan 11, 2021 to Mar 22, 2021",
      },
      duration: "23 min per ep",
      rating: "R - 17+ (violence & profanity)",
      score: 8.36,
      scored_by: 861434,
      rank: 224,
      popularity: 96,
      members: 1399269,
      favorites: 35804,
      synopsis:
        "Despite being bullied, scorned, and oppressed all of his life, a 34-year-old shut-in still found the resolve to attempt something heroic—only for it to end in a tragic accident. But in a twist of fate, he awakens in another world as Rudeus Greyrat, starting life again as a baby born to two loving parents.\n\nPreserving his memories and knowledge from his previous life, Rudeus quickly adapts to his new environment. With the mind of a grown adult, he starts to display magical talent that exceeds all expectations, honing his skill with the help of a mage named Roxy Migurdia. Rudeus learns swordplay from his father, Paul, and meets Sylphiette, a girl his age who quickly becomes his closest friend.\n\nAs Rudeus' second chance at life begins, he tries to make the most of his new opportunity while conquering his traumatic past. And perhaps, one day, he may find the one thing he could not find in his old world—love.\n\n[Written by MAL Rewrite]",
      background:
        "Mushoku Tensei: Isekai Ittara Honki Dasu adapts chapters 1-26 of Yuka Fujikawa's manga series and volumes 1-3 of Rifujin na Magonote's light novel series of the same title.",
      season: "winter",
      year: 2021,
      broadcast: {
        day: "Mondays",
        time: "00:00",
        timezone: "Asia/Tokyo",
        string: "Mondays at 00:00 (JST)",
      },
      producers: [
        {
          mal_id: 61,
          type: "anime",
          name: "Frontier Works",
          url: "https://myanimelist.net/anime/producer/61/Frontier_Works",
        },
        {
          mal_id: 245,
          type: "anime",
          name: "TOHO",
          url: "https://myanimelist.net/anime/producer/245/TOHO",
        },
        {
          mal_id: 1143,
          type: "anime",
          name: "TOHO animation",
          url: "https://myanimelist.net/anime/producer/1143/TOHO_animation",
        },
        {
          mal_id: 1333,
          type: "anime",
          name: "Hakuhodo DY Music & Pictures",
          url: "https://myanimelist.net/anime/producer/1333/Hakuhodo_DY_Music___Pictures",
        },
        {
          mal_id: 1416,
          type: "anime",
          name: "BS11",
          url: "https://myanimelist.net/anime/producer/1416/BS11",
        },
        {
          mal_id: 1444,
          type: "anime",
          name: "Egg Firm",
          url: "https://myanimelist.net/anime/producer/1444/Egg_Firm",
        },
        {
          mal_id: 1696,
          type: "anime",
          name: "Kadokawa",
          url: "https://myanimelist.net/anime/producer/1696/Kadokawa",
        },
        {
          mal_id: 1815,
          type: "anime",
          name: "GREE",
          url: "https://myanimelist.net/anime/producer/1815/GREE",
        },
        {
          mal_id: 2229,
          type: "anime",
          name: "Toho Music",
          url: "https://myanimelist.net/anime/producer/2229/Toho_Music",
        },
      ],
      licensors: [
        {
          mal_id: 102,
          type: "anime",
          name: "Funimation",
          url: "https://myanimelist.net/anime/producer/102/Funimation",
        },
      ],
      studios: [
        {
          mal_id: 1993,
          type: "anime",
          name: "Studio Bind",
          url: "https://myanimelist.net/anime/producer/1993/Studio_Bind",
        },
      ],
      genres: [
        {
          mal_id: 2,
          type: "anime",
          name: "Adventure",
          url: "https://myanimelist.net/anime/genre/2/Adventure",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 10,
          type: "anime",
          name: "Fantasy",
          url: "https://myanimelist.net/anime/genre/10/Fantasy",
        },
        {
          mal_id: 9,
          type: "anime",
          name: "Ecchi",
          url: "https://myanimelist.net/anime/genre/9/Ecchi",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 62,
          type: "anime",
          name: "Isekai",
          url: "https://myanimelist.net/anime/genre/62/Isekai",
        },
        {
          mal_id: 72,
          type: "anime",
          name: "Reincarnation",
          url: "https://myanimelist.net/anime/genre/72/Reincarnation",
        },
      ],
      demographics: [],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 70261,
              type: "manga",
              name: "Mushoku Tensei: Isekai Ittara Honki Dasu",
              url: "https://myanimelist.net/manga/70261/Mushoku_Tensei__Isekai_Ittara_Honki_Dasu",
            },
          ],
        },
        {
          relation: "Sequel",
          entry: [
            {
              mal_id: 45576,
              type: "anime",
              name: "Mushoku Tensei: Isekai Ittara Honki Dasu Part 2",
              url: "https://myanimelist.net/anime/45576/Mushoku_Tensei__Isekai_Ittara_Honki_Dasu_Part_2",
            },
          ],
        },
      ],
      theme: {
        openings: [
          '1: "Tabibito no Uta (旅人の唄)" by Yuiko Oohara (eps 3-4, 6-8)',
          '2: "Mezame no uta (目覚めの唄)" by Yuiko Oohara (eps 10)',
        ],
        endings: ['"Only (オンリー)" by Yuiko Oohara'],
      },
      external: [
        {
          name: "Official Site",
          url: "https://mushokutensei.jp/",
        },
        {
          name: "@mushokutensei_A",
          url: "https://twitter.com/mushokutensei_A",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=14758",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=22589",
        },
        {
          name: "Wikipedia",
          url: "https://en.wikipedia.org/wiki/Mushoku_Tensei#Anime",
        },
        {
          name: "Wikipedia",
          url: "https://ja.wikipedia.org/wiki/%E7%84%A1%E8%81%B7%E8%BB%A2%E7%94%9F_-_%E7%95%B0%E4%B8%96%E7%95%8C%E8%A1%8C%E3%81%A3%E3%81%9F%E3%82%89%E6%9C%AC%E6%B0%97%E3%81%A0%E3%81%99_-",
        },
        {
          name: "Syoboi",
          url: "https://cal.syoboi.jp/tid/5851",
        },
        {
          name: "Bangumi",
          url: "https://bangumi.tv/subject/277554",
        },
      ],
      streaming: [
        {
          name: "Crunchyroll",
          url: "http://www.crunchyroll.com/series-282332",
        },
        {
          name: "Bilibili",
          url: "https://www.bilibili.com/",
        },
        {
          name: "Viu",
          url: "https://www.hq.viu.com/",
        },
        {
          name: "iQIYI",
          url: "https://www.iq.com/",
        },
      ],
    },
    {
      mal_id: 11577,
      url: "https://myanimelist.net/anime/11577/Steins_Gate_Movie__Fuka_Ryouiki_no_Déjà_vu",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/1611/112806.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/1611/112806.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1611/112806t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1611/112806l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1611/112806.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1611/112806t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1611/112806l.webp",
        },
      },
      trailer: {
        youtube_id: "rDsCNz3pWUg",
        url: "https://www.youtube.com/watch?v=rDsCNz3pWUg",
        embed_url: "https://www.youtube.com/embed/rDsCNz3pWUg?enablejsapi=1&wmode=opaque&autoplay=1",
        images: {
          image_url: "https://img.youtube.com/vi/rDsCNz3pWUg/default.jpg",
          small_image_url: "https://img.youtube.com/vi/rDsCNz3pWUg/sddefault.jpg",
          medium_image_url: "https://img.youtube.com/vi/rDsCNz3pWUg/mqdefault.jpg",
          large_image_url: "https://img.youtube.com/vi/rDsCNz3pWUg/hqdefault.jpg",
          maximum_image_url: "https://img.youtube.com/vi/rDsCNz3pWUg/maxresdefault.jpg",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Steins;Gate Movie: Fuka Ryouiki no Déjà vu",
        },
        {
          type: "Synonym",
          title: "Steins Gate Movie",
        },
        {
          type: "Japanese",
          title: "劇場版 シュタインズゲート 負荷領域のデジャヴ",
        },
        {
          type: "English",
          title: "Steins;Gate: The Movie - Load Region of Déjà Vu",
        },
        {
          type: "German",
          title: "Steins; Gate: The Movie",
        },
        {
          type: "Spanish",
          title: "Steins;Gate: The Movie. Load Region Of Déjà Vu",
        },
        {
          type: "French",
          title: "Steins; Gate: Le Film - Déjà Vu in the Load Area",
        },
      ],
      title: "Steins;Gate Movie: Fuka Ryouiki no Déjà vu",
      title_english: "Steins;Gate: The Movie - Load Region of Déjà Vu",
      title_japanese: "劇場版 シュタインズゲート 負荷領域のデジャヴ",
      title_synonyms: ["Steins Gate Movie"],
      type: "Movie",
      source: "Visual novel",
      episodes: 1,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2013-04-20T00:00:00+00:00",
        to: null,
        prop: {
          from: {
            day: 20,
            month: 4,
            year: 2013,
          },
          to: {
            day: null,
            month: null,
            year: null,
          },
        },
        string: "Apr 20, 2013",
      },
      duration: "1 hr 30 min",
      rating: "PG-13 - Teens 13 or older",
      score: 8.45,
      scored_by: 362779,
      rank: 166,
      popularity: 374,
      members: 607227,
      favorites: 2694,
      synopsis:
        "After a year in America, Kurisu Makise returns to Akihabara and reunites with Rintarou Okabe. However, their reunion is cut short when Okabe begins to experience recurring flashes of other timelines as the consequences of his time traveling start to manifest. These side effects eventually culminate in Okabe suddenly vanishing from the world, and only the startled Kurisu has any memory of his existence.\n\nIn the midst of despair, Kurisu is faced with a truly arduous choice that will test both her duty as a scientist and her loyalty as a friend: follow Okabe's advice and stay away from traveling through time to avoid the potential consequences it may have on the world lines, or ignore it to rescue the person that she cherishes most. Regardless of her decision, the path she chooses is one that will affect the past, the present, and the future.\n\n[Written by MAL Rewrite]",
      background: "The series won the 2013 Newtype Anime Awards for Best Anime Film.",
      season: null,
      year: null,
      broadcast: {
        day: null,
        time: null,
        timezone: null,
        string: null,
      },
      producers: [
        {
          mal_id: 61,
          type: "anime",
          name: "Frontier Works",
          url: "https://myanimelist.net/anime/producer/61/Frontier_Works",
        },
        {
          mal_id: 108,
          type: "anime",
          name: "Media Factory",
          url: "https://myanimelist.net/anime/producer/108/Media_Factory",
        },
        {
          mal_id: 166,
          type: "anime",
          name: "Movic",
          url: "https://myanimelist.net/anime/producer/166/Movic",
        },
        {
          mal_id: 238,
          type: "anime",
          name: "AT-X",
          url: "https://myanimelist.net/anime/producer/238/AT-X",
        },
        {
          mal_id: 352,
          type: "anime",
          name: "Kadokawa Pictures Japan",
          url: "https://myanimelist.net/anime/producer/352/Kadokawa_Pictures_Japan",
        },
        {
          mal_id: 963,
          type: "anime",
          name: "MAGES.",
          url: "https://myanimelist.net/anime/producer/963/MAGES",
        },
        {
          mal_id: 2896,
          type: "anime",
          name: "Cinema Sunshine",
          url: "https://myanimelist.net/anime/producer/2896/Cinema_Sunshine",
        },
      ],
      licensors: [
        {
          mal_id: 102,
          type: "anime",
          name: "Funimation",
          url: "https://myanimelist.net/anime/producer/102/Funimation",
        },
      ],
      studios: [
        {
          mal_id: 314,
          type: "anime",
          name: "White Fox",
          url: "https://myanimelist.net/anime/producer/314/White_Fox",
        },
      ],
      genres: [
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
      ],
      explicit_genres: [],
      themes: [],
      demographics: [],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 62951,
              type: "manga",
              name: "Gekijouban Steins;Gate: Fuka Ryouiki no Déjà vu",
              url: "https://myanimelist.net/manga/62951/Gekijouban_Steins_Gate__Fuka_Ryouiki_no_Déjà_vu",
            },
          ],
        },
        {
          relation: "Prequel",
          entry: [
            {
              mal_id: 10863,
              type: "anime",
              name: "Steins;Gate: Oukoubakko no Poriomania",
              url: "https://myanimelist.net/anime/10863/Steins_Gate__Oukoubakko_no_Poriomania",
            },
          ],
        },
      ],
      theme: {
        openings: ['"Anata no Eranda Kono Toki wo (あなたの選んだこの時を)" by Kanako Ito'],
        endings: ['"Itsumo Kono Basho de (いつもこの場所で)" by Ayane'],
      },
      external: [
        {
          name: "Official Site",
          url: "http://steinsgate-movie.jp/",
        },
        {
          name: "@sg_anime",
          url: "https://twitter.com/sg_anime",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=8655",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=13542",
        },
        {
          name: "Wikipedia",
          url: "http://en.wikipedia.org/wiki/Steins%3BGate%3A_Fuka_Ry%C5%8Diki_no_D%C3%A9j%C3%A0_vu",
        },
        {
          name: "Wikipedia",
          url: "https://ja.wikipedia.org/wiki/STEINS%3BGATE_%28%E3%82%A2%E3%83%8B%E3%83%A1%29",
        },
        {
          name: "Syoboi",
          url: "https://cal.syoboi.jp/tid/3494",
        },
      ],
      streaming: [
        {
          name: "Netflix",
          url: "https://www.netflix.com/",
        },
      ],
    },
    {
      mal_id: 10162,
      url: "https://myanimelist.net/anime/10162/Usagi_Drop",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/1460/98853.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/1460/98853.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1460/98853t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1460/98853l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1460/98853.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1460/98853t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1460/98853l.webp",
        },
      },
      trailer: {
        youtube_id: "PlWk-96JHz4",
        url: "https://www.youtube.com/watch?v=PlWk-96JHz4",
        embed_url: "https://www.youtube.com/embed/PlWk-96JHz4?enablejsapi=1&wmode=opaque&autoplay=1",
        images: {
          image_url: "https://img.youtube.com/vi/PlWk-96JHz4/default.jpg",
          small_image_url: "https://img.youtube.com/vi/PlWk-96JHz4/sddefault.jpg",
          medium_image_url: "https://img.youtube.com/vi/PlWk-96JHz4/mqdefault.jpg",
          large_image_url: "https://img.youtube.com/vi/PlWk-96JHz4/hqdefault.jpg",
          maximum_image_url: "https://img.youtube.com/vi/PlWk-96JHz4/maxresdefault.jpg",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Usagi Drop",
        },
        {
          type: "Synonym",
          title: "Usagi Drop",
        },
        {
          type: "Japanese",
          title: "うさぎドロップ",
        },
        {
          type: "English",
          title: "Bunny Drop",
        },
      ],
      title: "Usagi Drop",
      title_english: "Bunny Drop",
      title_japanese: "うさぎドロップ",
      title_synonyms: ["Usagi Drop"],
      type: "TV",
      source: "Manga",
      episodes: 11,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2011-07-08T00:00:00+00:00",
        to: "2011-09-16T00:00:00+00:00",
        prop: {
          from: {
            day: 8,
            month: 7,
            year: 2011,
          },
          to: {
            day: 16,
            month: 9,
            year: 2011,
          },
        },
        string: "Jul 8, 2011 to Sep 16, 2011",
      },
      duration: "22 min per ep",
      rating: "PG-13 - Teens 13 or older",
      score: 8.33,
      scored_by: 247456,
      rank: 242,
      popularity: 462,
      members: 504299,
      favorites: 5937,
      synopsis:
        "Daikichi Kawachi is a 30-year-old bachelor working a respectable job but otherwise wandering aimlessly through life. When his grandfather suddenly passes away, he returns to the family home to pay his respects. Upon arriving at the house, he meets a mysterious young girl named Rin who, to Daikichi’s astonishment, is his grandfather's illegitimate daughter!\n \nThe shy and unapproachable girl is deemed an embarrassment to the family, and finds herself ostracized by her father's relatives, all of them refusing to take care of her in the wake of his death. Daikichi, angered by their coldness toward Rin, announces that he will take her in—despite the fact that he is a young, single man with no prior childcare experience.\n\nUsagi Drop is the story of Daikichi's journey through fatherhood as he raises Rin with his gentle and affectionate nature, as well as an exploration of the warmth and interdependence that are at the heart of a happy, close-knit family.\n\n[Written by MAL Rewrite]",
      background: "",
      season: "summer",
      year: 2011,
      broadcast: {
        day: "Fridays",
        time: "00:45",
        timezone: "Asia/Tokyo",
        string: "Fridays at 00:45 (JST)",
      },
      producers: [
        {
          mal_id: 53,
          type: "anime",
          name: "Dentsu",
          url: "https://myanimelist.net/anime/producer/53/Dentsu",
        },
        {
          mal_id: 169,
          type: "anime",
          name: "Fuji TV",
          url: "https://myanimelist.net/anime/producer/169/Fuji_TV",
        },
        {
          mal_id: 245,
          type: "anime",
          name: "TOHO",
          url: "https://myanimelist.net/anime/producer/245/TOHO",
        },
        {
          mal_id: 577,
          type: "anime",
          name: "Tohokushinsha Film Corporation",
          url: "https://myanimelist.net/anime/producer/577/Tohokushinsha_Film_Corporation",
        },
        {
          mal_id: 757,
          type: "anime",
          name: "Sony Music Entertainment",
          url: "https://myanimelist.net/anime/producer/757/Sony_Music_Entertainment",
        },
        {
          mal_id: 765,
          type: "anime",
          name: "Sakura Create",
          url: "https://myanimelist.net/anime/producer/765/Sakura_Create",
        },
        {
          mal_id: 769,
          type: "anime",
          name: "Fujipacific Music",
          url: "https://myanimelist.net/anime/producer/769/Fujipacific_Music",
        },
        {
          mal_id: 1765,
          type: "anime",
          name: "Shodensha",
          url: "https://myanimelist.net/anime/producer/1765/Shodensha",
        },
        {
          mal_id: 3024,
          type: "anime",
          name: "Fonishia",
          url: "https://myanimelist.net/anime/producer/3024/Fonishia",
        },
      ],
      licensors: [
        {
          mal_id: 372,
          type: "anime",
          name: "NIS America, Inc.",
          url: "https://myanimelist.net/anime/producer/372/NIS_America_Inc",
        },
      ],
      studios: [
        {
          mal_id: 10,
          type: "anime",
          name: "Production I.G",
          url: "https://myanimelist.net/anime/producer/10/Production_IG",
        },
      ],
      genres: [
        {
          mal_id: 36,
          type: "anime",
          name: "Slice of Life",
          url: "https://myanimelist.net/anime/genre/36/Slice_of_Life",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 53,
          type: "anime",
          name: "Childcare",
          url: "https://myanimelist.net/anime/genre/53/Childcare",
        },
        {
          mal_id: 63,
          type: "anime",
          name: "Iyashikei",
          url: "https://myanimelist.net/anime/genre/63/Iyashikei",
        },
      ],
      demographics: [
        {
          mal_id: 43,
          type: "anime",
          name: "Josei",
          url: "https://myanimelist.net/anime/genre/43/Josei",
        },
      ],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 3468,
              type: "manga",
              name: "Usagi Drop",
              url: "https://myanimelist.net/manga/3468/Usagi_Drop",
            },
          ],
        },
        {
          relation: "Side Story",
          entry: [
            {
              mal_id: 11113,
              type: "anime",
              name: "Usagi Drop Specials",
              url: "https://myanimelist.net/anime/11113/Usagi_Drop_Specials",
            },
          ],
        },
      ],
      theme: {
        openings: ['"Sweet Drops" by Puffy'],
        endings: ['"High High High" by Kasarinchu'],
      },
      external: [
        {
          name: "Official Site",
          url: "http://www.usagi-drop.tv/",
        },
        {
          name: "Official Site",
          url: "https://www.production-ig.co.jp/works/usagi-drop/",
        },
        {
          name: "@usadro_info",
          url: "https://twitter.com/usadro_info",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=8211",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=12398",
        },
        {
          name: "Wikipedia",
          url: "http://en.wikipedia.org/wiki/Bunny_Drop",
        },
        {
          name: "Wikipedia",
          url: "https://ja.wikipedia.org/wiki/%E3%81%86%E3%81%95%E3%81%8E%E3%83%89%E3%83%AD%E3%83%83%E3%83%97#%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1",
        },
        {
          name: "Syoboi",
          url: "https://cal.syoboi.jp/tid/2220",
        },
      ],
      streaming: [
        {
          name: "Crunchyroll",
          url: "http://www.crunchyroll.com/series-234151",
        },
      ],
    },
    {
      mal_id: 11111,
      url: "https://myanimelist.net/anime/11111/Another",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/4/75509.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/4/75509.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/4/75509t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/4/75509l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/4/75509.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/4/75509t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/4/75509l.webp",
        },
      },
      trailer: {
        youtube_id: "UGoAl3L13bc",
        url: "https://www.youtube.com/watch?v=UGoAl3L13bc",
        embed_url: "https://www.youtube.com/embed/UGoAl3L13bc?enablejsapi=1&wmode=opaque&autoplay=1",
        images: {
          image_url: "https://img.youtube.com/vi/UGoAl3L13bc/default.jpg",
          small_image_url: "https://img.youtube.com/vi/UGoAl3L13bc/sddefault.jpg",
          medium_image_url: "https://img.youtube.com/vi/UGoAl3L13bc/mqdefault.jpg",
          large_image_url: "https://img.youtube.com/vi/UGoAl3L13bc/hqdefault.jpg",
          maximum_image_url: "https://img.youtube.com/vi/UGoAl3L13bc/maxresdefault.jpg",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Another",
        },
        {
          type: "Japanese",
          title: "アナザー",
        },
        {
          type: "English",
          title: "Another",
        },
      ],
      title: "Another",
      title_english: "Another",
      title_japanese: "アナザー",
      title_synonyms: [],
      type: "TV",
      source: "Novel",
      episodes: 12,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2012-01-10T00:00:00+00:00",
        to: "2012-03-27T00:00:00+00:00",
        prop: {
          from: {
            day: 10,
            month: 1,
            year: 2012,
          },
          to: {
            day: 27,
            month: 3,
            year: 2012,
          },
        },
        string: "Jan 10, 2012 to Mar 27, 2012",
      },
      duration: "24 min per ep",
      rating: "R - 17+ (violence & profanity)",
      score: 7.47,
      scored_by: 1009274,
      rank: 2007,
      popularity: 59,
      members: 1699934,
      favorites: 17836,
      synopsis:
        "In class 3-3 of Yomiyama North Junior High, transfer student Kouichi Sakakibara makes his return after taking a sick leave for the first month of school. Among his new classmates, he is inexplicably drawn toward Mei Misaki—a reserved girl with an eyepatch whom he met in the hospital during his absence. But none of his classmates acknowledge her existence; they warn him not to acquaint himself with things that do not exist. Against their words of caution, Kouichi befriends Mei—soon learning of the sinister truth behind his friends' apprehension.\n\nThe ominous rumors revolve around a former student of the class 3-3. However, no one will share the full details of the grim event with Kouichi. Engrossed in the curse that plagues his class, Kouichi sets out to discover its connection to his new friend. As a series of tragedies arise around them, it is now up to Kouichi, Mei, and their classmates to unravel the eerie mystery—but doing so will come at a hefty price.\n\n[Written by MAL Rewrite]",
      background: "",
      season: "winter",
      year: 2012,
      broadcast: {
        day: null,
        time: null,
        timezone: null,
        string: "Unknown",
      },
      producers: [
        {
          mal_id: 104,
          type: "anime",
          name: "Lantis",
          url: "https://myanimelist.net/anime/producer/104/Lantis",
        },
        {
          mal_id: 113,
          type: "anime",
          name: "Kadokawa Shoten",
          url: "https://myanimelist.net/anime/producer/113/Kadokawa_Shoten",
        },
        {
          mal_id: 245,
          type: "anime",
          name: "TOHO",
          url: "https://myanimelist.net/anime/producer/245/TOHO",
        },
        {
          mal_id: 460,
          type: "anime",
          name: "KlockWorx",
          url: "https://myanimelist.net/anime/producer/460/KlockWorx",
        },
        {
          mal_id: 687,
          type: "anime",
          name: "Bandai Namco Live Creative",
          url: "https://myanimelist.net/anime/producer/687/Bandai_Namco_Live_Creative",
        },
        {
          mal_id: 689,
          type: "anime",
          name: "NTT Docomo",
          url: "https://myanimelist.net/anime/producer/689/NTT_Docomo",
        },
      ],
      licensors: [
        {
          mal_id: 376,
          type: "anime",
          name: "Sentai Filmworks",
          url: "https://myanimelist.net/anime/producer/376/Sentai_Filmworks",
        },
      ],
      studios: [
        {
          mal_id: 132,
          type: "anime",
          name: "P.A. Works",
          url: "https://myanimelist.net/anime/producer/132/PA_Works",
        },
      ],
      genres: [
        {
          mal_id: 14,
          type: "anime",
          name: "Horror",
          url: "https://myanimelist.net/anime/genre/14/Horror",
        },
        {
          mal_id: 7,
          type: "anime",
          name: "Mystery",
          url: "https://myanimelist.net/anime/genre/7/Mystery",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 58,
          type: "anime",
          name: "Gore",
          url: "https://myanimelist.net/anime/genre/58/Gore",
        },
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
      ],
      demographics: [],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 29699,
              type: "manga",
              name: "Another",
              url: "https://myanimelist.net/manga/29699/Another",
            },
          ],
        },
        {
          relation: "Prequel",
          entry: [
            {
              mal_id: 11701,
              type: "anime",
              name: "Another: The Other - Inga",
              url: "https://myanimelist.net/anime/11701/Another__The_Other_-_Inga",
            },
          ],
        },
        {
          relation: "Other",
          entry: [
            {
              mal_id: 20365,
              type: "anime",
              name: "Another: Misaki Mei - Shizukani",
              url: "https://myanimelist.net/anime/20365/Another__Misaki_Mei_-_Shizukani",
            },
          ],
        },
      ],
      theme: {
        openings: ['"Kyoumu Densen (凶夢伝染)" by ALI PROJECT'],
        endings: ['"anamnesis" by Annabel'],
      },
      external: [
        {
          name: "Official Site",
          url: "http://www.another-anime.jp/",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=8556",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=13258",
        },
        {
          name: "Wikipedia",
          url: "http://en.wikipedia.org/wiki/Another_(novel)",
        },
      ],
      streaming: [
        {
          name: "Crunchyroll",
          url: "http://www.crunchyroll.com/series-240622",
        },
        {
          name: "Netflix",
          url: "https://www.netflix.com/",
        },
      ],
    },
    {
      mal_id: 13759,
      url: "https://myanimelist.net/anime/13759/Sakura-sou_no_Pet_na_Kanojo",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/4/43643.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/4/43643.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/4/43643t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/4/43643l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/4/43643.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/4/43643t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/4/43643l.webp",
        },
      },
      trailer: {
        youtube_id: "HPTtuR1EF_U",
        url: "https://www.youtube.com/watch?v=HPTtuR1EF_U",
        embed_url: "https://www.youtube.com/embed/HPTtuR1EF_U?enablejsapi=1&wmode=opaque&autoplay=1",
        images: {
          image_url: "https://img.youtube.com/vi/HPTtuR1EF_U/default.jpg",
          small_image_url: "https://img.youtube.com/vi/HPTtuR1EF_U/sddefault.jpg",
          medium_image_url: "https://img.youtube.com/vi/HPTtuR1EF_U/mqdefault.jpg",
          large_image_url: "https://img.youtube.com/vi/HPTtuR1EF_U/hqdefault.jpg",
          maximum_image_url: "https://img.youtube.com/vi/HPTtuR1EF_U/maxresdefault.jpg",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Sakura-sou no Pet na Kanojo",
        },
        {
          type: "Synonym",
          title: "Sakurasou no Pet na Kanojo",
        },
        {
          type: "Japanese",
          title: "さくら荘のペットな彼女",
        },
        {
          type: "English",
          title: "The Pet Girl of Sakurasou",
        },
        {
          type: "German",
          title: "The Pet Girl of Sakurasou",
        },
        {
          type: "Spanish",
          title: "The Pet Girl of Sakurasou",
        },
        {
          type: "French",
          title: "The Pet Girl of Sakurasou",
        },
      ],
      title: "Sakura-sou no Pet na Kanojo",
      title_english: "The Pet Girl of Sakurasou",
      title_japanese: "さくら荘のペットな彼女",
      title_synonyms: ["Sakurasou no Pet na Kanojo"],
      type: "TV",
      source: "Light novel",
      episodes: 24,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "2012-10-09T00:00:00+00:00",
        to: "2013-03-26T00:00:00+00:00",
        prop: {
          from: {
            day: 9,
            month: 10,
            year: 2012,
          },
          to: {
            day: 26,
            month: 3,
            year: 2013,
          },
        },
        string: "Oct 9, 2012 to Mar 26, 2013",
      },
      duration: "23 min per ep",
      rating: "PG-13 - Teens 13 or older",
      score: 8.06,
      scored_by: 718759,
      rank: 579,
      popularity: 108,
      members: 1270025,
      favorites: 26165,
      synopsis:
        "At Suimei High, the Sakura-sou dormitory is infamous for housing the school's most notorious delinquents. Thus, when the relatively tame Sorata Kanda is transferred to the dorm, escaping this insane asylum becomes his foremost goal. Trapped there for the time being, he must learn how to deal with his fellow residents, including bubbly animator Misaki Kamiigusa, charming playboy writer Jin Mitaka, and the ever-reclusive Ryuunosuke Akasaka. Surrounded by weirdness, Sorata frequently finds respite in his interactions with his one \"normal\" friend, aspiring voice actress Nanami Aoyama.\n\nWhen Mashiro Shiina—a new foreign exchange student—joins the dormitory, Sorata is instantly enraptured by her beauty. Underneath her otherworldly appearance, Mashiro is an autistic savant, capable of world-renowned brilliance in her art, yet unable to perform simple daily tasks. After Sorata ends up in charge of taking care of Mashiro, the two inevitably grow closer, with Sorata's initial desire to escape the dormitory becoming a forgotten goal.\n\nDespite their eccentricities, every resident is incredible in their own field, leaving Sorata to contend with his own lack of any particular skill. With brilliance all around him, he thus strives to become an equal to their talent. Revolving around the hardships and joys of its colorful cast, Sakura-sou no Pet na Kanojo is a heartwarming coming-of-age tale of friendship, love, ambition, and heartbreak—through the lens of an ordinary person surrounded by the extraordinary.\n\n[Written by MAL Rewrite]",
      background:
        "Sakurasou no Pet na Kanojo adapts the first 6 novels and part of the 7th novel of Hajime Kamoshida's light novel series of the same title.",
      season: "fall",
      year: 2012,
      broadcast: {
        day: "Tuesdays",
        time: "00:30",
        timezone: "Asia/Tokyo",
        string: "Tuesdays at 00:30 (JST)",
      },
      producers: [
        {
          mal_id: 61,
          type: "anime",
          name: "Frontier Works",
          url: "https://myanimelist.net/anime/producer/61/Frontier_Works",
        },
        {
          mal_id: 79,
          type: "anime",
          name: "Genco",
          url: "https://myanimelist.net/anime/producer/79/Genco",
        },
        {
          mal_id: 108,
          type: "anime",
          name: "Media Factory",
          url: "https://myanimelist.net/anime/producer/108/Media_Factory",
        },
        {
          mal_id: 140,
          type: "anime",
          name: "Animax",
          url: "https://myanimelist.net/anime/producer/140/Animax",
        },
        {
          mal_id: 143,
          type: "anime",
          name: "Mainichi Broadcasting System",
          url: "https://myanimelist.net/anime/producer/143/Mainichi_Broadcasting_System",
        },
        {
          mal_id: 681,
          type: "anime",
          name: "ASCII Media Works",
          url: "https://myanimelist.net/anime/producer/681/ASCII_Media_Works",
        },
        {
          mal_id: 737,
          type: "anime",
          name: "Sony Music Communications",
          url: "https://myanimelist.net/anime/producer/737/Sony_Music_Communications",
        },
      ],
      licensors: [
        {
          mal_id: 376,
          type: "anime",
          name: "Sentai Filmworks",
          url: "https://myanimelist.net/anime/producer/376/Sentai_Filmworks",
        },
      ],
      studios: [
        {
          mal_id: 7,
          type: "anime",
          name: "J.C.Staff",
          url: "https://myanimelist.net/anime/producer/7/JCStaff",
        },
      ],
      genres: [
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 22,
          type: "anime",
          name: "Romance",
          url: "https://myanimelist.net/anime/genre/22/Romance",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 23,
          type: "anime",
          name: "School",
          url: "https://myanimelist.net/anime/genre/23/School",
        },
        {
          mal_id: 80,
          type: "anime",
          name: "Visual Arts",
          url: "https://myanimelist.net/anime/genre/80/Visual_Arts",
        },
      ],
      demographics: [],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 30051,
              type: "manga",
              name: "Sakurasou no Pet na Kanojo",
              url: "https://myanimelist.net/manga/30051/Sakurasou_no_Pet_na_Kanojo",
            },
          ],
        },
      ],
      theme: {
        openings: [
          '1: "Kimi ga Yume wo Tsuretekita (君が夢を連れてきた)" by Pet na Kanojo-tachi (Ai Kayano, Mariko Nakatsu, Natsumi Takamori)  (eps 2-10)',
          '2: "Yume no Tsuzuki (夢の続き)" by Konomi Suzuki (eps 13, 16-22, 24)',
          '3: "I call your name again" by Nanami Aoyama (Mariko Nakatsu) (eps 14)',
        ],
        endings: [
          "Sakurai Takahiro, Kayano Ai, Kawasumi Ayako, Toyoguchi Megumi (ep 23)",
          '1: "DAYS of DASH" by Konomi Suzuki (eps 1-12, 24)',
          '2: "Prime number ~Kimi to Deaeru Hi~ (Prime number～君と出会える日～)" by Asuka Ookura (大倉明日香) (eps 13-22)',
          '3: "Kyou no Hi wa Sayounara (今日の日はさようなら)" by Horie Yui, Nakatsu Mariko, Takamori Natsumi, Matsuoka Yoshitsugu,Sakurai Takahiro, Kayano Ai, Kawasumi Ayako, Toyoguchi Megumi  (eps 23)',
        ],
      },
      external: [
        {
          name: "Official Site",
          url: "http://sakurasou.tv/",
        },
        {
          name: "@sakurasou_tv",
          url: "https://twitter.com/sakurasou_tv",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=9153",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=14238",
        },
        {
          name: "Wikipedia",
          url: "http://ja.wikipedia.org/wiki/さくら荘のペットな彼女",
        },
      ],
      streaming: [
        {
          name: "HIDIVE",
          url: "https://www.hidive.com/tv/the-pet-girl-of-sakurasou",
        },
        {
          name: "Netflix",
          url: "https://www.netflix.com/",
        },
      ],
    },
    {
      mal_id: 30,
      url: "https://myanimelist.net/anime/30/Shinseiki_Evangelion",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/anime/1314/108941.jpg",
          base64: "https://cdn.myanimelist.net/images/anime/1314/108941.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1314/108941t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1314/108941l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1314/108941.webp",
          small_image_url: "https://cdn.myanimelist.net/images/anime/1314/108941t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/anime/1314/108941l.webp",
        },
      },
      trailer: {
        youtube_id: null,
        url: null,
        embed_url: null,
        images: {
          image_url: null,
          small_image_url: null,
          medium_image_url: null,
          large_image_url: null,
          maximum_image_url: null,
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Shinseiki Evangelion",
        },
        {
          type: "Synonym",
          title: "NGE",
        },
        {
          type: "Synonym",
          title: "Evangelion (1995)",
        },
        {
          type: "Japanese",
          title: "新世紀エヴァンゲリオン",
        },
        {
          type: "English",
          title: "Neon Genesis Evangelion",
        },
      ],
      title: "Shinseiki Evangelion",
      title_english: "Neon Genesis Evangelion",
      title_japanese: "新世紀エヴァンゲリオン",
      title_synonyms: ["NGE", "Evangelion (1995)"],
      type: "TV",
      source: "Original",
      episodes: 26,
      status: "Finished Airing",
      airing: false,
      aired: {
        from: "1995-10-04T00:00:00+00:00",
        to: "1996-03-27T00:00:00+00:00",
        prop: {
          from: {
            day: 4,
            month: 10,
            year: 1995,
          },
          to: {
            day: 27,
            month: 3,
            year: 1996,
          },
        },
        string: "Oct 4, 1995 to Mar 27, 1996",
      },
      duration: "24 min per ep",
      rating: "PG-13 - Teens 13 or older",
      score: 8.35,
      scored_by: 1117667,
      rank: 231,
      popularity: 45,
      members: 1870652,
      favorites: 108723,
      synopsis:
        "Fifteen years after a cataclysmic event known as the Second Impact, the world faces a new threat: monstrous celestial beings called Angels invade Tokyo-3 one by one. Mankind is unable to defend themselves against the Angels despite utilizing their most advanced munitions and military tactics. The only hope for human salvation rests in the hands of NERV, a mysterious organization led by the cold Gendou Ikari. NERV operates giant humanoid robots dubbed \"Evangelions\" to combat the Angels with state-of-the-art advanced weaponry and protective barriers known as Absolute Terror Fields.\n\nYears after being abandoned by his father, Shinji Ikari, Gendou's 14-year-old son, returns to Tokyo-3. Shinji undergoes a perpetual internal battle against the deeply buried trauma caused by the loss of his mother and the emotional neglect he suffered at the hands of his father. Terrified to open himself up to another, Shinji's life is forever changed upon meeting 29-year-old Misato Katsuragi, a high-ranking NERV officer who shows him a free-spirited maternal kindness he has never experienced.\n\nA devastating Angel attack forces Shinji into action as Gendou reveals his true motive for inviting his son back to Tokyo-3: Shinji is the only child capable of efficiently piloting Evangelion Unit-01, a new robot that synchronizes with his biometrics. Despite the brutal psychological trauma brought about by piloting an Evangelion, Shinji defends Tokyo-3 against the angelic threat, oblivious to his father's dark machinations.\n\n[Written by MAL Rewrite]",
      background:
        "Director Hideaki Anno's depression is what led to the dark themes of Shinseiki Evangelion. Budgetary problems and parental complaints about content led to the original ending being scrapped and replaced with an extremely limited-animation ending breaking from the main plot. A movie, Air/Magokoro wo, Kimi ni, was later made based in part on the original planned ending and in part on Anno's increasing frustration with the otaku fanbase. The series' mix of psychoanalysis, religious symbolism, and genre deconstruction proved extremely influential on mature anime in the late '90s onward. The Japan Media Arts Festival in 2006 ranked it as the most popular anime of all time.",
      season: "fall",
      year: 1995,
      broadcast: {
        day: "Wednesdays",
        time: "18:30",
        timezone: "Asia/Tokyo",
        string: "Wednesdays at 18:30 (JST)",
      },
      producers: [
        {
          mal_id: 16,
          type: "anime",
          name: "TV Tokyo",
          url: "https://myanimelist.net/anime/producer/16/TV_Tokyo",
        },
        {
          mal_id: 113,
          type: "anime",
          name: "Kadokawa Shoten",
          url: "https://myanimelist.net/anime/producer/113/Kadokawa_Shoten",
        },
        {
          mal_id: 139,
          type: "anime",
          name: "Nihon Ad Systems",
          url: "https://myanimelist.net/anime/producer/139/Nihon_Ad_Systems",
        },
        {
          mal_id: 1461,
          type: "anime",
          name: "Audio Tanaka",
          url: "https://myanimelist.net/anime/producer/1461/Audio_Tanaka",
        },
      ],
      licensors: [
        {
          mal_id: 783,
          type: "anime",
          name: "GKIDS",
          url: "https://myanimelist.net/anime/producer/783/GKIDS",
        },
      ],
      studios: [
        {
          mal_id: 6,
          type: "anime",
          name: "Gainax",
          url: "https://myanimelist.net/anime/producer/6/Gainax",
        },
        {
          mal_id: 103,
          type: "anime",
          name: "Tatsunoko Production",
          url: "https://myanimelist.net/anime/producer/103/Tatsunoko_Production",
        },
      ],
      genres: [
        {
          mal_id: 1,
          type: "anime",
          name: "Action",
          url: "https://myanimelist.net/anime/genre/1/Action",
        },
        {
          mal_id: 5,
          type: "anime",
          name: "Avant Garde",
          url: "https://myanimelist.net/anime/genre/5/Avant_Garde",
        },
        {
          mal_id: 46,
          type: "anime",
          name: "Award Winning",
          url: "https://myanimelist.net/anime/genre/46/Award_Winning",
        },
        {
          mal_id: 8,
          type: "anime",
          name: "Drama",
          url: "https://myanimelist.net/anime/genre/8/Drama",
        },
        {
          mal_id: 24,
          type: "anime",
          name: "Sci-Fi",
          url: "https://myanimelist.net/anime/genre/24/Sci-Fi",
        },
        {
          mal_id: 41,
          type: "anime",
          name: "Suspense",
          url: "https://myanimelist.net/anime/genre/41/Suspense",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 18,
          type: "anime",
          name: "Mecha",
          url: "https://myanimelist.net/anime/genre/18/Mecha",
        },
        {
          mal_id: 40,
          type: "anime",
          name: "Psychological",
          url: "https://myanimelist.net/anime/genre/40/Psychological",
        },
      ],
      demographics: [],
      relations: [
        {
          relation: "Adaptation",
          entry: [
            {
              mal_id: 698,
              type: "manga",
              name: "Shinseiki Evangelion",
              url: "https://myanimelist.net/manga/698/Shinseiki_Evangelion",
            },
          ],
        },
        {
          relation: "Sequel",
          entry: [
            {
              mal_id: 32,
              type: "anime",
              name: "Shinseiki Evangelion Movie: Air/Magokoro wo, Kimi ni",
              url: "https://myanimelist.net/anime/32/Shinseiki_Evangelion_Movie__Air_Magokoro_wo_Kimi_ni",
            },
          ],
        },
        {
          relation: "Spin-Off",
          entry: [
            {
              mal_id: 4130,
              type: "anime",
              name: "Petit Eva: Evangelion@School",
              url: "https://myanimelist.net/anime/4130/Petit_Eva__EvangelionSchool",
            },
          ],
        },
        {
          relation: "Summary",
          entry: [
            {
              mal_id: 31,
              type: "anime",
              name: "Shinseiki Evangelion Movie: Shi to Shinsei",
              url: "https://myanimelist.net/anime/31/Shinseiki_Evangelion_Movie__Shi_to_Shinsei",
            },
          ],
        },
        {
          relation: "Alternative Version",
          entry: [
            {
              mal_id: 2759,
              type: "anime",
              name: "Evangelion Movie 1: Jo",
              url: "https://myanimelist.net/anime/2759/Evangelion_Movie_1__Jo",
            },
            {
              mal_id: 3784,
              type: "anime",
              name: "Evangelion Movie 2: Ha",
              url: "https://myanimelist.net/anime/3784/Evangelion_Movie_2__Ha",
            },
            {
              mal_id: 3785,
              type: "anime",
              name: "Evangelion Movie 3: Q",
              url: "https://myanimelist.net/anime/3785/Evangelion_Movie_3__Q",
            },
            {
              mal_id: 3786,
              type: "anime",
              name: "Shin Evangelion Movie:||",
              url: "https://myanimelist.net/anime/3786/Shin_Evangelion_Movie_||",
            },
          ],
        },
        {
          relation: "Character",
          entry: [
            {
              mal_id: 31115,
              type: "anime",
              name: "Schick x Evangelion",
              url: "https://myanimelist.net/anime/31115/Schick_x_Evangelion",
            },
            {
              mal_id: 43745,
              type: "anime",
              name: "Attack Zero x Evangelion",
              url: "https://myanimelist.net/anime/43745/Attack_Zero_x_Evangelion",
            },
            {
              mal_id: 43751,
              type: "anime",
              name: "Ayanami Rei, Hajimete no Kuchibeni",
              url: "https://myanimelist.net/anime/43751/Ayanami_Rei_Hajimete_no_Kuchibeni",
            },
          ],
        },
        {
          relation: "Other",
          entry: [
            {
              mal_id: 23023,
              type: "anime",
              name: "Peaceful Times (F02) Petit Film",
              url: "https://myanimelist.net/anime/23023/Peaceful_Times_F02_Petit_Film",
            },
            {
              mal_id: 28149,
              type: "anime",
              name: "Nihon Animator Mihonichi",
              url: "https://myanimelist.net/anime/28149/Nihon_Animator_Mihonichi",
            },
            {
              mal_id: 41030,
              type: "anime",
              name: "Evangelion Shito, Hakata Shuurai",
              url: "https://myanimelist.net/anime/41030/Evangelion_Shito_Hakata_Shuurai",
            },
            {
              mal_id: 47307,
              type: "anime",
              name: "Shin Gengou Nyankogelion",
              url: "https://myanimelist.net/anime/47307/Shin_Gengou_Nyankogelion",
            },
          ],
        },
      ],
      theme: {
        openings: ['"Zankoku na Tenshi no Thesis (残酷な天使のテーゼ, A Cruel Angel\'s Thesis)" by Yoko Takahashi'],
        endings: [
          '1: "Fly Me to the Moon" by Claire',
          '2: "Fly Me to the Moon (Rei #5 Version)" by Megumi Hayashibara (eps 5)',
          '3: "Fly Me to the Moon (Rei #6 Version)" by Megumi Hayashibara (eps 6)',
          '4: "Fly Me to the Moon -4 Beat Version-" by Yoko Takahashi (eps 7,12)',
          '5: "Fly Me to the Moon (Aya Bossa Techno Version)" by Aya (eps 8,22)',
          '6: "Fly Me to the Moon (Yoko Takahashi Acid Bossa Version)" by Yoko Takahashi (eps 9,13)',
          '7: "Fly Me to the Moon (Yoko Takahashi Version)" by Yoko Takahashi (eps 10,14,21)',
          '8: "Fly Me to the Moon -4 Beat Version (Off-Vocal)-" by [Instrumental] (eps 15)',
          '9: "Fly Me to the Moon (Off-Vocal Version)" by [Instrumental] (eps 16,24)',
          '10: "Fly Me to the Moon (Aki Jungle Version)" by Aki (eps 17)',
          '11: "Fly Me to the Moon -B22 (A-Type)-" by [Instrumental] (eps 20)',
          '12: "Fly Me to the Moon (Rei #23 Version)" by Megumi Hayashibara (eps 23)',
          '13: "Fly Me to the Moon (Rei #25 Version)" by Megumi Hayashibara (eps 25)',
          '14: "Fly Me to the Moon (Rei #26 Version)" by Megumi Hayashibara (eps 26)',
        ],
      },
      external: [
        {
          name: "Official Site",
          url: "http://www.evangelion.co.jp/ng.html",
        },
        {
          name: "@evangelion_co",
          url: "https://twitter.com/evangelion_co",
        },
        {
          name: "AniDB",
          url: "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=22",
        },
        {
          name: "ANN",
          url: "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=49",
        },
        {
          name: "Wikipedia",
          url: "http://en.wikipedia.org/wiki/Neon_Genesis_Evangelion",
        },
        {
          name: "Wikipedia",
          url: "https://ja.wikipedia.org/wiki/%E6%96%B0%E4%B8%96%E7%B4%80%E3%82%A8%E3%83%B4%E3%82%A1%E3%83%B3%E3%82%B2%E3%83%AA%E3%82%AA%E3%83%B3",
        },
        {
          name: "Syoboi",
          url: "https://cal.syoboi.jp/tid/335",
        },
      ],
      streaming: [
        {
          name: "Netflix",
          url: "https://www.netflix.com/title/81033445",
        },
      ],
    },
  ],
  mangas: [
    {
      mal_id: 14893,
      url: "https://myanimelist.net/manga/14893/Monogatari_Series__First_Season",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/manga/2/279887.jpg",
          base64: "https://cdn.myanimelist.net/images/manga/2/279887.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/manga/2/279887t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/manga/2/279887l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/manga/2/279887.webp",
          small_image_url: "https://cdn.myanimelist.net/images/manga/2/279887t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/manga/2/279887l.webp",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Monogatari Series: First Season",
        },
        {
          type: "Synonym",
          title: "Bakemonogatari",
        },
        {
          type: "Synonym",
          title: "Monster Tale",
        },
        {
          type: "Synonym",
          title: "Kizumonogatari",
        },
        {
          type: "Synonym",
          title: "Wound Tale",
        },
        {
          type: "Synonym",
          title: "Nisemonogatari",
        },
        {
          type: "Synonym",
          title: "Fake Tale",
        },
        {
          type: "Synonym",
          title: "Nekomonogatari: Kuro",
        },
        {
          type: "Synonym",
          title: "Nekomonogatari: Black",
        },
        {
          type: "Japanese",
          title: "〈物語〉シリーズ ファーストシーズン",
        },
      ],
      title: "Monogatari Series: First Season",
      title_english: null,
      title_japanese: "〈物語〉シリーズ ファーストシーズン",
      title_synonyms: [
        "Bakemonogatari",
        "Monster Tale",
        "Kizumonogatari",
        "Wound Tale",
        "Nisemonogatari",
        "Fake Tale",
        "Nekomonogatari: Kuro",
        "Nekomonogatari: Black",
      ],
      type: "Light Novel",
      chapters: 107,
      volumes: 6,
      status: "Finished",
      publishing: false,
      published: {
        from: "2006-11-01T00:00:00+00:00",
        to: "2010-07-28T00:00:00+00:00",
        prop: {
          from: {
            day: 1,
            month: 11,
            year: 2006,
          },
          to: {
            day: 28,
            month: 7,
            year: 2010,
          },
        },
        string: "Nov 1, 2006 to Jul 28, 2010",
      },
      score: 8.91,
      scored: 8.91,
      scored_by: 16920,
      rank: 19,
      popularity: 276,
      members: 60592,
      favorites: 3123,
      synopsis:
        'This is a story, a "ghostory" of sorts, about scars that bond, monsters that haunt, and fakes that deceive.\n\nThe story of Koyomi Araragi begins through a fateful encounter with the all-powerful, blonde-haired, "hot-blooded, iron-blooded, and cold-blooded" vampire, later introduced as Shinobu Oshino. Their tragic rendezvous results in the end of Araragi\'s life as a human and his subsequent rebirth as a vampire—a monster. However, this encounter is only the start of his meddlings with the supernatural. Koyomi\'s noble personality ultimately sees him getting further involved in the lives of others with supernatural afflictions. This is his desperate attempt at returning to a normal human life, in a paranormal world filled with nothing but tragedy, suffering, and inhumanity.\n\n[Written by MAL Rewrite]\n\nThis entry includes the first season of the Monogatari Series.',
      background:
        "Monogatari Series: First Season was published in English by Vertical Inc: first with Kizumonogatari as Kizumonogatari: Wound Tale on December 15, 2015; Bakemonogatari as Bakemonogatari: Monster Tale in three volumes from December 20, 2016, to April 25, 2017; Nisemonogatari as Nisemonogatari: Fake Tale in two volumes from June 27, 2017, to August 29, 2017; and Nekomonogatari: Kuro as Nekomonogatari (Black): Cat Tale on November 28, 2017. Vertical also released the series in a box set.",
      authors: [
        {
          mal_id: 5254,
          type: "people",
          name: "NISIO, ISIN",
          url: "https://myanimelist.net/people/5254/ISIN_NISIO",
        },
        {
          mal_id: 8594,
          type: "people",
          name: "VOFAN",
          url: "https://myanimelist.net/people/8594/VOFAN",
        },
      ],
      serializations: [
        {
          mal_id: 498,
          type: "manga",
          name: "Mephisto",
          url: "https://myanimelist.net/manga/magazine/498/Mephisto",
        },
      ],
      genres: [
        {
          mal_id: 1,
          type: "manga",
          name: "Action",
          url: "https://myanimelist.net/manga/genre/1/Action",
        },
        {
          mal_id: 4,
          type: "manga",
          name: "Comedy",
          url: "https://myanimelist.net/manga/genre/4/Comedy",
        },
        {
          mal_id: 7,
          type: "manga",
          name: "Mystery",
          url: "https://myanimelist.net/manga/genre/7/Mystery",
        },
        {
          mal_id: 22,
          type: "manga",
          name: "Romance",
          url: "https://myanimelist.net/manga/genre/22/Romance",
        },
        {
          mal_id: 37,
          type: "manga",
          name: "Supernatural",
          url: "https://myanimelist.net/manga/genre/37/Supernatural",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 32,
          type: "manga",
          name: "Vampire",
          url: "https://myanimelist.net/manga/genre/32/Vampire",
        },
      ],
      demographics: [],
    },
    {
      mal_id: 28533,
      url: "https://myanimelist.net/manga/28533/Watashi_ga_Motenai_no_wa_Dou_Kangaetemo_Omaera_ga_Warui",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/manga/5/63521.jpg",
          base64: "https://cdn.myanimelist.net/images/manga/5/63521.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/manga/5/63521t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/manga/5/63521l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/manga/5/63521.webp",
          small_image_url: "https://cdn.myanimelist.net/images/manga/5/63521t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/manga/5/63521l.webp",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Watashi ga Motenai no wa Dou Kangaetemo Omaera ga Warui!",
        },
        {
          type: "Synonym",
          title: "WataMote",
        },
        {
          type: "Synonym",
          title: "Watashi ga Motenai no wa Dou Kangaete mo Omaera ga Warui!",
        },
        {
          type: "Synonym",
          title: "It's Not My Fault That I'm Not Popular!",
        },
        {
          type: "Japanese",
          title: "私がモテないのはどう考えてもお前らが悪い!",
        },
        {
          type: "English",
          title: "No Matter How I Look at It, It's You Guys' Fault I'm Not Popular!",
        },
      ],
      title: "Watashi ga Motenai no wa Dou Kangaetemo Omaera ga Warui!",
      title_english: "No Matter How I Look at It, It's You Guys' Fault I'm Not Popular!",
      title_japanese: "私がモテないのはどう考えてもお前らが悪い!",
      title_synonyms: [
        "WataMote",
        "Watashi ga Motenai no wa Dou Kangaete mo Omaera ga Warui!",
        "It's Not My Fault That I'm Not Popular!",
      ],
      type: "Manga",
      chapters: null,
      volumes: null,
      status: "Publishing",
      publishing: true,
      published: {
        from: "2011-08-04T00:00:00+00:00",
        to: null,
        prop: {
          from: {
            day: 4,
            month: 8,
            year: 2011,
          },
          to: {
            day: null,
            month: null,
            year: null,
          },
        },
        string: "Aug 4, 2011 to ?",
      },
      score: 7.73,
      scored: 7.73,
      scored_by: 19175,
      rank: 1585,
      popularity: 297,
      members: 56586,
      favorites: 3294,
      synopsis:
        "Tomoko Kuroki is not cool. She is unattractive, socially awkward, and spends most of her evenings playing video games. Even so, no one wants popularity as desperately as she does. With one ingenious idea after another, Tomoko comes ever closer to achieving her goal—or so she thinks. Utilizing such innovative methods as imitating popular anime personas and buying expensive panties, she claws her way toward attaining the social status of her dreams.\n\nPathetically hilarious and strangely charming, Watashi ga Motenai no wa Dou Kangaetemo Omaera ga Warui! depicts Tomoko's daily struggles with social anxiety in a lighthearted and relatable way.\n\n[Written by MAL Rewrite]",
      background:
        "Watashi ga Motenai no wa Dou Kangaetemo Omaera ga Warui! has been published in English as No Matter How I Look At It, It's You Guys' Fault I'm Not Popular! by Yen Press since October 29, 2013, as well as in eBook format since January 20, 2015.",
      authors: [
        {
          mal_id: 7879,
          type: "people",
          name: "Tanigawa, Nico",
          url: "https://myanimelist.net/people/7879/Nico_Tanigawa",
        },
      ],
      serializations: [
        {
          mal_id: 419,
          type: "manga",
          name: "Gangan Online",
          url: "https://myanimelist.net/manga/magazine/419/Gangan_Online",
        },
      ],
      genres: [
        {
          mal_id: 4,
          type: "manga",
          name: "Comedy",
          url: "https://myanimelist.net/manga/genre/4/Comedy",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 70,
          type: "manga",
          name: "Otaku Culture",
          url: "https://myanimelist.net/manga/genre/70/Otaku_Culture",
        },
        {
          mal_id: 23,
          type: "manga",
          name: "School",
          url: "https://myanimelist.net/manga/genre/23/School",
        },
      ],
      demographics: [],
    },
    {
      mal_id: 7149,
      url: "https://myanimelist.net/manga/7149/Toradora",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/manga/1/148447.jpg",
          base64: "https://cdn.myanimelist.net/images/manga/1/148447.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/manga/1/148447t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/manga/1/148447l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/manga/1/148447.webp",
          small_image_url: "https://cdn.myanimelist.net/images/manga/1/148447t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/manga/1/148447l.webp",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Toradora!",
        },
        {
          type: "Japanese",
          title: "とらドラ!",
        },
        {
          type: "English",
          title: "Toradora!",
        },
      ],
      title: "Toradora!",
      title_english: "Toradora!",
      title_japanese: "とらドラ!",
      title_synonyms: [],
      type: "Light Novel",
      chapters: 62,
      volumes: 10,
      status: "Finished",
      publishing: false,
      published: {
        from: "2006-03-10T00:00:00+00:00",
        to: "2009-03-10T00:00:00+00:00",
        prop: {
          from: {
            day: 10,
            month: 3,
            year: 2006,
          },
          to: {
            day: 10,
            month: 3,
            year: 2009,
          },
        },
        string: "Mar 10, 2006 to Mar 10, 2009",
      },
      score: 8.21,
      scored: 8.21,
      scored_by: 8607,
      rank: 409,
      popularity: 665,
      members: 27958,
      favorites: 771,
      synopsis:
        "Takasu Ryuuji might look like a thug, but he's actually a nice guy. Making friends when you've got an unintentionally scary face is tough—and don't even get him started on girlfriends. But with his secret crush in his class, the start of his second year of high school is off to a good start...until he crosses paths with Aisaka Taiga. Beautiful, frightening, and not quite five feet tall, the girl known as the Palmtop Tiger is the one person in school even scarier than Ryuuji himself—and he's just made the mistake of making her very, very angry.\n\n(Source: Seven Seas Entertainment)",
      background:
        "In Kadokawa Shoten's first Light Novel Award contest held in 2007, Toradora! won an award in the romantic-comedy category. The series was published in English by Seven Seas Entertainment under the Airship imprint from May 8, 2018, to August 4, 2020. It was also released in Polish by Studio JG as 2-in-1 omnibus volumes from August 25, 2016, to July 20, 2020; and in Brazilian Portuguese by NewPOP Editora from July 6, 2018, to May 13, 2021.",
      authors: [
        {
          mal_id: 4875,
          type: "people",
          name: "Takemiya, Yuyuko",
          url: "https://myanimelist.net/people/4875/Yuyuko_Takemiya",
        },
        {
          mal_id: 5597,
          type: "people",
          name: "Yasu",
          url: "https://myanimelist.net/people/5597/Yasu",
        },
      ],
      serializations: [],
      genres: [
        {
          mal_id: 8,
          type: "manga",
          name: "Drama",
          url: "https://myanimelist.net/manga/genre/8/Drama",
        },
        {
          mal_id: 22,
          type: "manga",
          name: "Romance",
          url: "https://myanimelist.net/manga/genre/22/Romance",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 64,
          type: "manga",
          name: "Love Polygon",
          url: "https://myanimelist.net/manga/genre/64/Love_Polygon",
        },
        {
          mal_id: 23,
          type: "manga",
          name: "School",
          url: "https://myanimelist.net/manga/genre/23/School",
        },
      ],
      demographics: [],
    },
    {
      mal_id: 102997,
      url: "https://myanimelist.net/manga/102997/Saotome_Senshu_Hitakakusu",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/manga/1/189746.jpg",
          base64: "https://cdn.myanimelist.net/images/manga/1/189746.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/manga/1/189746t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/manga/1/189746l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/manga/1/189746.webp",
          small_image_url: "https://cdn.myanimelist.net/images/manga/1/189746t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/manga/1/189746l.webp",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Saotome Senshu, Hitakakusu",
        },
        {
          type: "Japanese",
          title: "早乙女選手、ひたかくす",
        },
      ],
      title: "Saotome Senshu, Hitakakusu",
      title_english: null,
      title_japanese: "早乙女選手、ひたかくす",
      title_synonyms: [],
      type: "Manga",
      chapters: 124,
      volumes: 10,
      status: "Finished",
      publishing: false,
      published: {
        from: "2016-08-22T00:00:00+00:00",
        to: "2019-10-21T00:00:00+00:00",
        prop: {
          from: {
            day: 22,
            month: 8,
            year: 2016,
          },
          to: {
            day: 21,
            month: 10,
            year: 2019,
          },
        },
        string: "Aug 22, 2016 to Oct 21, 2019",
      },
      score: 7.48,
      scored: 7.48,
      scored_by: 11770,
      rank: 3094,
      popularity: 631,
      members: 29611,
      favorites: 467,
      synopsis:
        "Satoru Tsukishima has just been confessed to by fellow high school boxing club member Yae Saotome, who is currently the Kanto region's Female Featherweight Champion. Overjoyed at first, Satoru isn't able to accept her feelings as he believes that she should be focusing on boxing instead. Yae's championship will soon be on the line, and the entire school is counting on her to someday represent Tokyo in the Olympics. It also doesn't help that he's nowhere near as skilled as she is, conflicted by the thought of a rising star being in a relationship with someone as average as him.\n\nBut when their coach finds out about the confession, Satoru is assigned as Yae's trainer so the two can secretly date and spend more time together while also engaging in club activities. However, if anyone finds out about the two, it will mean the end of their relationship. With this in mind, their pure and awkward romance begins!\n\n[Written by MAL Rewrite]",
      background: "",
      authors: [
        {
          mal_id: 42802,
          type: "people",
          name: "Mizuguchi, Naoki",
          url: "https://myanimelist.net/people/42802/Naoki_Mizuguchi",
        },
      ],
      serializations: [
        {
          mal_id: 3,
          type: "manga",
          name: "Big Comic Spirits",
          url: "https://myanimelist.net/manga/magazine/3/Big_Comic_Spirits",
        },
      ],
      genres: [
        {
          mal_id: 4,
          type: "manga",
          name: "Comedy",
          url: "https://myanimelist.net/manga/genre/4/Comedy",
        },
        {
          mal_id: 22,
          type: "manga",
          name: "Romance",
          url: "https://myanimelist.net/manga/genre/22/Romance",
        },
        {
          mal_id: 30,
          type: "manga",
          name: "Sports",
          url: "https://myanimelist.net/manga/genre/30/Sports",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 54,
          type: "manga",
          name: "Combat Sports",
          url: "https://myanimelist.net/manga/genre/54/Combat_Sports",
        },
        {
          mal_id: 23,
          type: "manga",
          name: "School",
          url: "https://myanimelist.net/manga/genre/23/School",
        },
      ],
      demographics: [
        {
          mal_id: 41,
          type: "manga",
          name: "Seinen",
          url: "https://myanimelist.net/manga/genre/41/Seinen",
        },
      ],
    },
    {
      mal_id: 31,
      url: "https://myanimelist.net/manga/31/Lovely★Complex",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/manga/1/209659.jpg",
          base64: "https://cdn.myanimelist.net/images/manga/1/209659.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/manga/1/209659t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/manga/1/209659l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/manga/1/209659.webp",
          small_image_url: "https://cdn.myanimelist.net/images/manga/1/209659t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/manga/1/209659l.webp",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Lovely★Complex",
        },
        {
          type: "Synonym",
          title: "Love Com Plus",
        },
        {
          type: "Synonym",
          title: "Lovely Complex Plus",
        },
        {
          type: "Japanese",
          title: "ラブ★コン",
        },
        {
          type: "English",
          title: "Love★Com",
        },
      ],
      title: "Lovely★Complex",
      title_english: "Love★Com",
      title_japanese: "ラブ★コン",
      title_synonyms: ["Love Com Plus", "Lovely Complex Plus"],
      type: "Manga",
      chapters: 68,
      volumes: 17,
      status: "Finished",
      publishing: false,
      published: {
        from: "2001-08-13T00:00:00+00:00",
        to: "2007-08-13T00:00:00+00:00",
        prop: {
          from: {
            day: 13,
            month: 8,
            year: 2001,
          },
          to: {
            day: 13,
            month: 8,
            year: 2007,
          },
        },
        string: "Aug 13, 2001 to Aug 13, 2007",
      },
      score: 8.32,
      scored: 8.32,
      scored_by: 28546,
      rank: 285,
      popularity: 254,
      members: 65164,
      favorites: 2854,
      synopsis:
        "When the taller than average 172 cm Risa Koizumi learns that her occasional nemesis, the shorter than average 156 cm Atsushi Ootani, is romantically interested in her friend, she decides to team up with him. After all, she also has feelings for his friend. Unluckily, however, their respective crushes fall for each other instead. Determined to find new love after their recent misfortunes, the pair decide to cheer each other on while maintaining their usual dynamic of constant bickering. \n\nAlthough they continually deny it, Risa and Ootani are more similar than they like to admit: they both have unusual heights, failing grades, identical tastes in food, and a tendency to act extremely childish. Together, they inspire laughter among their peers as a so-called comedic duo. Could the love that these two are looking for be closer than they think?\n\n[Written by MAL Rewrite]\n\n\nIncluded one-shots:\nVolume 12: Hoshi ni Nattemo Aishiteru\nVolume 16: Bokura no Ibasho",
      background:
        "Lovely★Complex won the 49th Shogakukan Manga Award for shoujo in 2004. The manga was published in English as Love★Com by VIZ Media under the Shojo Beat imprint from July 3, 2007 to March 2, 2010 and was adapted to two drama CDs, a live-action movie and PlayStation 2 game in 2006, and a TV anime series in 2007.",
      authors: [
        {
          mal_id: 1896,
          type: "people",
          name: "Nakahara, Aya",
          url: "https://myanimelist.net/people/1896/Aya_Nakahara",
        },
      ],
      serializations: [
        {
          mal_id: 53,
          type: "manga",
          name: "Bessatsu Margaret",
          url: "https://myanimelist.net/manga/magazine/53/Bessatsu_Margaret",
        },
      ],
      genres: [
        {
          mal_id: 46,
          type: "manga",
          name: "Award Winning",
          url: "https://myanimelist.net/manga/genre/46/Award_Winning",
        },
        {
          mal_id: 4,
          type: "manga",
          name: "Comedy",
          url: "https://myanimelist.net/manga/genre/4/Comedy",
        },
        {
          mal_id: 8,
          type: "manga",
          name: "Drama",
          url: "https://myanimelist.net/manga/genre/8/Drama",
        },
        {
          mal_id: 22,
          type: "manga",
          name: "Romance",
          url: "https://myanimelist.net/manga/genre/22/Romance",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 23,
          type: "manga",
          name: "School",
          url: "https://myanimelist.net/manga/genre/23/School",
        },
      ],
      demographics: [
        {
          mal_id: 25,
          type: "manga",
          name: "Shoujo",
          url: "https://myanimelist.net/manga/genre/25/Shoujo",
        },
      ],
    },
    {
      mal_id: 109339,
      url: "https://myanimelist.net/manga/109339/Saihate_no_Paladin",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/manga/2/208057.jpg",
          base64: "https://cdn.myanimelist.net/images/manga/2/208057.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/manga/2/208057t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/manga/2/208057l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/manga/2/208057.webp",
          small_image_url: "https://cdn.myanimelist.net/images/manga/2/208057t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/manga/2/208057l.webp",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Saihate no Paladin",
        },
        {
          type: "Synonym",
          title: "Paladin of the End",
        },
        {
          type: "Synonym",
          title: "Ultimate Paladin",
        },
        {
          type: "Japanese",
          title: "最果てのパラディン",
        },
        {
          type: "English",
          title: "The Faraway Paladin",
        },
      ],
      title: "Saihate no Paladin",
      title_english: "The Faraway Paladin",
      title_japanese: "最果てのパラディン",
      title_synonyms: ["Paladin of the End", "Ultimate Paladin"],
      type: "Manga",
      chapters: null,
      volumes: null,
      status: "Publishing",
      publishing: true,
      published: {
        from: "2017-09-25T00:00:00+00:00",
        to: null,
        prop: {
          from: {
            day: 25,
            month: 9,
            year: 2017,
          },
          to: {
            day: null,
            month: null,
            year: null,
          },
        },
        string: "Sep 25, 2017 to ?",
      },
      score: 7.8,
      scored: 7.8,
      scored_by: 9086,
      rank: 1293,
      popularity: 611,
      members: 30209,
      favorites: 366,
      synopsis:
        "William is the lone human in a city of the dead. Born with vague memories of a past life in contemporary Japan where he failed to do anything useful, he is determined not to make the same mistake again, and that this time, his life will be lived. But what does that really mean? Raised by a group of the undead, William must discover what circumstances brought him to this city and these people as well as what it means to not just exist, but to live a full life.\n\n(Source: ANN)",
      background:
        "Saihate no Paladin has been published digitally in English as The Faraway Paladin by J-Novel Club since November 26, 2019, and in print as 2-in-1 omnibus volumes since August 17, 2021.",
      authors: [
        {
          mal_id: 37314,
          type: "people",
          name: "Okuhashi, Mutsumi",
          url: "https://myanimelist.net/people/37314/Mutsumi_Okuhashi",
        },
        {
          mal_id: 41629,
          type: "people",
          name: "Yanagino, Kanata",
          url: "https://myanimelist.net/people/41629/Kanata_Yanagino",
        },
      ],
      serializations: [
        {
          mal_id: 340,
          type: "manga",
          name: "Comic Gardo",
          url: "https://myanimelist.net/manga/magazine/340/Comic_Gardo",
        },
      ],
      genres: [
        {
          mal_id: 1,
          type: "manga",
          name: "Action",
          url: "https://myanimelist.net/manga/genre/1/Action",
        },
        {
          mal_id: 2,
          type: "manga",
          name: "Adventure",
          url: "https://myanimelist.net/manga/genre/2/Adventure",
        },
        {
          mal_id: 10,
          type: "manga",
          name: "Fantasy",
          url: "https://myanimelist.net/manga/genre/10/Fantasy",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 62,
          type: "manga",
          name: "Isekai",
          url: "https://myanimelist.net/manga/genre/62/Isekai",
        },
        {
          mal_id: 73,
          type: "manga",
          name: "Reincarnation",
          url: "https://myanimelist.net/manga/genre/73/Reincarnation",
        },
      ],
      demographics: [],
    },
    {
      mal_id: 113010,
      url: "https://myanimelist.net/manga/113010/Bakemonogatari",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/manga/2/210355.jpg",
          base64: "https://cdn.myanimelist.net/images/manga/2/210355.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/manga/2/210355t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/manga/2/210355l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/manga/2/210355.webp",
          small_image_url: "https://cdn.myanimelist.net/images/manga/2/210355t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/manga/2/210355l.webp",
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
          title: "Monster Tale",
        },
        {
          type: "Synonym",
          title: "Monogatari Series: First Season",
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
      title_synonyms: ["Monster Tale", "Monogatari Series: First Season"],
      type: "Manga",
      chapters: 193,
      volumes: 22,
      status: "Finished",
      publishing: false,
      published: {
        from: "2018-03-14T00:00:00+00:00",
        to: "2023-03-15T00:00:00+00:00",
        prop: {
          from: {
            day: 14,
            month: 3,
            year: 2018,
          },
          to: {
            day: 15,
            month: 3,
            year: 2023,
          },
        },
        string: "Mar 14, 2018 to Mar 15, 2023",
      },
      score: 8.49,
      scored: 8.49,
      scored_by: 11731,
      rank: 153,
      popularity: 462,
      members: 39143,
      favorites: 1766,
      synopsis:
        "Koyomi Araragi is no stranger to the abnormal. During the spring break of his third year in high school, a fateful encounter with vampire Kiss-Shot Acerola-Orion Heart-Under-Blade turns him into a vampire himself. Thrust into the world of oddities, Araragi finds himself catching classmate Hitagi Senjougahara when she falls down the school stairs one day—but something is amiss. After being confronted by the girl in question, Araragi learns that her weight was stolen by a mythical crab. In spite of Senjougahara's blunt threats, he manages to convince her to let him help. In need of a solution to an abnormal problem, the two visit the mysterious Meme Oshino, a wanderer who saved Araragi from his vampirism.\n\nBakemonogatari is a tale about the monsters that reside within everyone, but just how deep do they dwell in the people Araragi meets?\n\n[Written by MAL Rewrite]",
      background:
        "Bakemonogatari was published in English by Vertical from October 1, 2019 to August 20, 2024. It was also released in Spanish by Milky Way Ediciones from December 27, 2018, to February 28, 2024; and in Brazilian Portuguese by Panini Comics from September 5, 2019, to March 23, 2024.",
      authors: [
        {
          mal_id: 1932,
          type: "people",
          name: "Oh! Great",
          url: "https://myanimelist.net/people/1932/Oh_Great",
        },
        {
          mal_id: 5254,
          type: "people",
          name: "NISIO, ISIN",
          url: "https://myanimelist.net/people/5254/ISIN_NISIO",
        },
      ],
      serializations: [
        {
          mal_id: 8,
          type: "manga",
          name: "Shounen Magazine (Weekly)",
          url: "https://myanimelist.net/manga/magazine/8/Shounen_Magazine_Weekly",
        },
      ],
      genres: [
        {
          mal_id: 1,
          type: "manga",
          name: "Action",
          url: "https://myanimelist.net/manga/genre/1/Action",
        },
        {
          mal_id: 4,
          type: "manga",
          name: "Comedy",
          url: "https://myanimelist.net/manga/genre/4/Comedy",
        },
        {
          mal_id: 8,
          type: "manga",
          name: "Drama",
          url: "https://myanimelist.net/manga/genre/8/Drama",
        },
        {
          mal_id: 7,
          type: "manga",
          name: "Mystery",
          url: "https://myanimelist.net/manga/genre/7/Mystery",
        },
        {
          mal_id: 22,
          type: "manga",
          name: "Romance",
          url: "https://myanimelist.net/manga/genre/22/Romance",
        },
        {
          mal_id: 37,
          type: "manga",
          name: "Supernatural",
          url: "https://myanimelist.net/manga/genre/37/Supernatural",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 32,
          type: "manga",
          name: "Vampire",
          url: "https://myanimelist.net/manga/genre/32/Vampire",
        },
      ],
      demographics: [
        {
          mal_id: 27,
          type: "manga",
          name: "Shounen",
          url: "https://myanimelist.net/manga/genre/27/Shounen",
        },
      ],
    },
    {
      mal_id: 37707,
      url: "https://myanimelist.net/manga/37707/Shigatsu_wa_Kimi_no_Uso",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/manga/3/102691.jpg",
          base64: "https://cdn.myanimelist.net/images/manga/3/102691.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/manga/3/102691t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/manga/3/102691l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/manga/3/102691.webp",
          small_image_url: "https://cdn.myanimelist.net/images/manga/3/102691t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/manga/3/102691l.webp",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Shigatsu wa Kimi no Uso",
        },
        {
          type: "Japanese",
          title: "四月は君の嘘",
        },
        {
          type: "English",
          title: "Your Lie in April",
        },
      ],
      title: "Shigatsu wa Kimi no Uso",
      title_english: "Your Lie in April",
      title_japanese: "四月は君の嘘",
      title_synonyms: [],
      type: "Manga",
      chapters: 44,
      volumes: 11,
      status: "Finished",
      publishing: false,
      published: {
        from: "2011-04-06T00:00:00+00:00",
        to: "2015-02-06T00:00:00+00:00",
        prop: {
          from: {
            day: 6,
            month: 4,
            year: 2011,
          },
          to: {
            day: 6,
            month: 2,
            year: 2015,
          },
        },
        string: "Apr 6, 2011 to Feb 6, 2015",
      },
      score: 8.59,
      scored: 8.59,
      scored_by: 34835,
      rank: 99,
      popularity: 192,
      members: 81659,
      favorites: 2682,
      synopsis:
        'At a very young age, Kousei Arima was strictly taught how to play the piano and meticulously follow the score by his mother, to the point where he dominated every competition he entered with ease. He earned the title of "Human Metronome" for performing almost perfectly. Every musician of his age looked up to him. However, after his mother suddenly dies, he became tone-deaf due to the shock and then disappeared, never to be seen onstage since.\n\nTwo years later, Kousei lives a monotonous life with his childhood friends Tsubaki Sawabe and Ryouta Watari supporting him. He continues to cling to music, although performing is still an impossibility for him. This is until his unexpected encounter with Kaori Miyazono, a violinist who performs freely without the dictations of a score. A story of friendship, love, music, and a single lie, Kousei\'s life begins to change and gain color as Kaori helps him to take up music again.\n\n[Written by MAL Rewrite]',
      background:
        "Shigatsu wa Kimi no Uso was nominated for the fifth Manga Taisho Award in 2012 and placed 13th in the final ranking. In the following year, it won the 37th Kodansha Manga Award in the Shounen category. The series was published in English as Your Lie in April by Kodansha Comics USA from April 21, 2015, to January 3, 2017. It was also released in Spanish by Milky Way Ediciones from March 27, 2015, to January 29, 2016; in Brazilian Portuguese by Panini Comics from April 26, 2017, to December 2018; and in Polish by Studio JG from March 11, 2019, to May 4, 2021.",
      authors: [
        {
          mal_id: 12781,
          type: "people",
          name: "Arakawa, Naoshi",
          url: "https://myanimelist.net/people/12781/Naoshi_Arakawa",
        },
      ],
      serializations: [
        {
          mal_id: 48,
          type: "manga",
          name: "Shounen Magazine (Monthly)",
          url: "https://myanimelist.net/manga/magazine/48/Shounen_Magazine_Monthly",
        },
      ],
      genres: [
        {
          mal_id: 46,
          type: "manga",
          name: "Award Winning",
          url: "https://myanimelist.net/manga/genre/46/Award_Winning",
        },
        {
          mal_id: 8,
          type: "manga",
          name: "Drama",
          url: "https://myanimelist.net/manga/genre/8/Drama",
        },
        {
          mal_id: 22,
          type: "manga",
          name: "Romance",
          url: "https://myanimelist.net/manga/genre/22/Romance",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 19,
          type: "manga",
          name: "Music",
          url: "https://myanimelist.net/manga/genre/19/Music",
        },
        {
          mal_id: 23,
          type: "manga",
          name: "School",
          url: "https://myanimelist.net/manga/genre/23/School",
        },
      ],
      demographics: [
        {
          mal_id: 27,
          type: "manga",
          name: "Shounen",
          url: "https://myanimelist.net/manga/genre/27/Shounen",
        },
      ],
    },
    {
      mal_id: 419,
      url: "https://myanimelist.net/manga/419/Nodame_Cantabile",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/manga/2/153962.jpg",
          base64: "https://cdn.myanimelist.net/images/manga/2/153962.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/manga/2/153962t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/manga/2/153962l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/manga/2/153962.webp",
          small_image_url: "https://cdn.myanimelist.net/images/manga/2/153962t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/manga/2/153962l.webp",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Nodame Cantabile",
        },
        {
          type: "Synonym",
          title: "Nodame Cantabile: Encore Opera-hen",
        },
        {
          type: "Synonym",
          title: "Nodame Cantabile Backstage",
        },
        {
          type: "Japanese",
          title: "のだめカンタービレ",
        },
        {
          type: "English",
          title: "Nodame Cantabile",
        },
      ],
      title: "Nodame Cantabile",
      title_english: "Nodame Cantabile",
      title_japanese: "のだめカンタービレ",
      title_synonyms: ["Nodame Cantabile: Encore Opera-hen", "Nodame Cantabile Backstage"],
      type: "Manga",
      chapters: 150,
      volumes: 25,
      status: "Finished",
      publishing: false,
      published: {
        from: "2001-07-10T00:00:00+00:00",
        to: "2010-08-25T00:00:00+00:00",
        prop: {
          from: {
            day: 10,
            month: 7,
            year: 2001,
          },
          to: {
            day: 25,
            month: 8,
            year: 2010,
          },
        },
        string: "Jul 10, 2001 to Aug 25, 2010",
      },
      score: 8.4,
      scored: 8.4,
      scored_by: 9718,
      rank: 213,
      popularity: 661,
      members: 28091,
      favorites: 875,
      synopsis:
        'Shinichi Chiaki, the perfectionist son of a famous pianist, is in his fourth year at Momogaoka College of Music, hoping to achieve his secret dream of being a conductor. His admiration for his father led him to pursue a career in music. As much as he wants to return to Europe, his phobia of flying traps him in Japan where he now lives.\n\nOne night, he passes out, and ends up being taken in by Megumi "Nodame" Noda. Upon first glance, Nodame is a talented pianist, but she is also slobbish and eccentric. What\'s even worse is that she is his neighbor and he ends up forced to work with her. Though it sounds like a recipe for disaster, Chiaki is drawn to this girl who makes him remember the love for music he once held. Just what does the future hold for this musical duo?\n\n[Written by MAL Rewrite]',
      background:
        "Nodame Cantabile has been adapted as three different television series: an award-winning live-action drama that aired in 2006, followed by a sequel television special that aired in January 2008, and as an anime series spanning three seasons with the first one broadcast in 2007. In 2014, it received a South Korean drama adaptation titled Cantabile Tomorrow. The series was published in English by Del Rey Manga; in France by Pika; and in Spain by Norma Editorial. Kodansha has taken up the English license, and published the series digitally from July 26, 2016 to June 27, 2017. The last two volumes, titled Nodame Cantabile: Encore Opera-hen, contain a sequel to the main series.",
      authors: [
        {
          mal_id: 2395,
          type: "people",
          name: "Ninomiya, Tomoko",
          url: "https://myanimelist.net/people/2395/Tomoko_Ninomiya",
        },
      ],
      serializations: [
        {
          mal_id: 113,
          type: "manga",
          name: "Kiss",
          url: "https://myanimelist.net/manga/magazine/113/Kiss",
        },
      ],
      genres: [
        {
          mal_id: 46,
          type: "manga",
          name: "Award Winning",
          url: "https://myanimelist.net/manga/genre/46/Award_Winning",
        },
        {
          mal_id: 4,
          type: "manga",
          name: "Comedy",
          url: "https://myanimelist.net/manga/genre/4/Comedy",
        },
        {
          mal_id: 22,
          type: "manga",
          name: "Romance",
          url: "https://myanimelist.net/manga/genre/22/Romance",
        },
        {
          mal_id: 36,
          type: "manga",
          name: "Slice of Life",
          url: "https://myanimelist.net/manga/genre/36/Slice_of_Life",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 50,
          type: "manga",
          name: "Adult Cast",
          url: "https://myanimelist.net/manga/genre/50/Adult_Cast",
        },
        {
          mal_id: 19,
          type: "manga",
          name: "Music",
          url: "https://myanimelist.net/manga/genre/19/Music",
        },
      ],
      demographics: [
        {
          mal_id: 42,
          type: "manga",
          name: "Josei",
          url: "https://myanimelist.net/manga/genre/42/Josei",
        },
      ],
    },
    {
      mal_id: 21,
      url: "https://myanimelist.net/manga/21/Death_Note",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/manga/1/258245.jpg",
          base64: "https://cdn.myanimelist.net/images/manga/1/258245.jpg",
          small_image_url: "https://cdn.myanimelist.net/images/manga/1/258245t.jpg",
          large_image_url: "https://cdn.myanimelist.net/images/manga/1/258245l.jpg",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/manga/1/258245.webp",
          small_image_url: "https://cdn.myanimelist.net/images/manga/1/258245t.webp",
          large_image_url: "https://cdn.myanimelist.net/images/manga/1/258245l.webp",
        },
      },
      approved: true,
      titles: [
        {
          type: "Default",
          title: "Death Note",
        },
        {
          type: "Japanese",
          title: "DEATH NOTE",
        },
        {
          type: "English",
          title: "Death Note",
        },
      ],
      title: "Death Note",
      title_english: "Death Note",
      title_japanese: "DEATH NOTE",
      title_synonyms: [],
      type: "Manga",
      chapters: 108,
      volumes: 12,
      status: "Finished",
      publishing: false,
      published: {
        from: "2003-12-01T00:00:00+00:00",
        to: "2006-05-15T00:00:00+00:00",
        prop: {
          from: {
            day: 1,
            month: 12,
            year: 2003,
          },
          to: {
            day: 15,
            month: 5,
            year: 2006,
          },
        },
        string: "Dec 1, 2003 to May 15, 2006",
      },
      score: 8.69,
      scored: 8.69,
      scored_by: 231795,
      rank: 60,
      popularity: 13,
      members: 404403,
      favorites: 32108,
      synopsis:
        'Ryuk, a god of death, drops his Death Note into the human world for personal pleasure. In Japan, prodigious high school student Light Yagami stumbles upon it. Inside the notebook, he finds a chilling message: those whose names are written in it shall die. Its nonsensical nature amuses Light; but when he tests its power by writing the name of a criminal in it, they suddenly meet their demise.\n\nRealizing the Death Note\'s vast potential, Light commences a series of nefarious murders under the pseudonym "Kira," vowing to cleanse the world of corrupt individuals and create a perfect society where crime ceases to exist. However, the police quickly catch on, and they enlist the help of L—a mastermind detective—to uncover the culprit.\n\nDeath Note tells the thrilling tale of Light and L as they clash in a great battle-of-minds, one that will determine the future of the world.\n\n[Written by MAL Rewrite]',
      background:
        "Death Note ranked second in the 2006 and 2007 Kono Manga ga Sugoi! for the Male Readers division. It was nominated for the 38th Seiun Award in the Best Comic category in 2007. In the same year, it was also nominated for the 11th Tezuka Osamu Cultural Prize. As of April 2015, over 30 million copies of the manga are in circulation. The manga was published in English by VIZ Media under the Shonen Jump Advanced imprint from October 10, 2005, to July 3, 2007, and again in 2-in-1 omnibus volumes subtitled Black Edition. There have been several more rereleases of the series: a special hardcover edition of the first volume; a complete box set, which included a guidebook titled Death Note 13: How to Read; and a complete omnibus. It was also published in Italian by Panini Comics from October 19, 2006, to September 18, 2008; in Brazilian Portuguese by Editora JBC from June 2007 to June 2008; in German by Tokyopop from September 2006 to March 2009; in French by Kana from January 19, 2007, to October 9, 2008; in Dutch by Kana; in Argentina by LARP Editores from May 20, 2009, to April 2012; and in Spanish by Glénat España from June 30, 2006, to September 30, 2007. The series was adapted into three live-action films, a TV drama series, and a stage musical. It has also inspired other works and copycat crimes outside Japan, leading to various controversies.",
      authors: [
        {
          mal_id: 1888,
          type: "people",
          name: "Obata, Takeshi",
          url: "https://myanimelist.net/people/1888/Takeshi_Obata",
        },
        {
          mal_id: 2111,
          type: "people",
          name: "Ohba, Tsugumi",
          url: "https://myanimelist.net/people/2111/Tsugumi_Ohba",
        },
      ],
      serializations: [
        {
          mal_id: 83,
          type: "manga",
          name: "Shounen Jump (Weekly)",
          url: "https://myanimelist.net/manga/magazine/83/Shounen_Jump_Weekly",
        },
      ],
      genres: [
        {
          mal_id: 37,
          type: "manga",
          name: "Supernatural",
          url: "https://myanimelist.net/manga/genre/37/Supernatural",
        },
        {
          mal_id: 45,
          type: "manga",
          name: "Suspense",
          url: "https://myanimelist.net/manga/genre/45/Suspense",
        },
      ],
      explicit_genres: [],
      themes: [
        {
          mal_id: 40,
          type: "manga",
          name: "Psychological",
          url: "https://myanimelist.net/manga/genre/40/Psychological",
        },
      ],
      demographics: [
        {
          mal_id: 27,
          type: "manga",
          name: "Shounen",
          url: "https://myanimelist.net/manga/genre/27/Shounen",
        },
      ],
    },
  ],
  characters: [
    {
      mal_id: 22037,
      url: "https://myanimelist.net/character/22037/Hitagi_Senjougahara",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/characters/11/287902.jpg?s=559b750212c5338e987b3d0ebac9d810",
          base64: "https://cdn.myanimelist.net/images/characters/11/287902.jpg?s=559b750212c5338e987b3d0ebac9d810",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/characters/11/287902.webp?s=559b750212c5338e987b3d0ebac9d810",
          small_image_url:
            "https://cdn.myanimelist.net/images/characters/11/287902t.webp?s=559b750212c5338e987b3d0ebac9d810",
        },
      },
      name: "Senjougahara, Hitagi",
    },
    {
      mal_id: 1185,
      url: "https://myanimelist.net/character/1185/Megumi_Noda",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/characters/11/92497.jpg?s=f8d450c55e9f47ee9b6cb93c9cb5a098",
          base64: "https://cdn.myanimelist.net/images/characters/11/92497.jpg?s=f8d450c55e9f47ee9b6cb93c9cb5a098",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/characters/11/92497.webp?s=f8d450c55e9f47ee9b6cb93c9cb5a098",
          small_image_url:
            "https://cdn.myanimelist.net/images/characters/11/92497t.webp?s=f8d450c55e9f47ee9b6cb93c9cb5a098",
        },
      },
      name: "Noda, Megumi",
    },
    {
      mal_id: 12064,
      url: "https://myanimelist.net/character/12064/Taiga_Aisaka",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/characters/11/514086.jpg?s=87920301db499bb344d2efd437699bc4",
          base64: "https://cdn.myanimelist.net/images/characters/11/514086.jpg?s=87920301db499bb344d2efd437699bc4",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/characters/11/514086.webp?s=87920301db499bb344d2efd437699bc4",
          small_image_url:
            "https://cdn.myanimelist.net/images/characters/11/514086t.webp?s=87920301db499bb344d2efd437699bc4",
        },
      },
      name: "Aisaka, Taiga",
    },
    {
      mal_id: 153859,
      url: "https://myanimelist.net/character/153859/Yae_Saotome",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/characters/12/538425.jpg?s=6fcca0ca41d34078b13f35c57dd80804",
          base64: "https://cdn.myanimelist.net/images/characters/12/538425.jpg?s=6fcca0ca41d34078b13f35c57dd80804",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/characters/12/538425.webp?s=6fcca0ca41d34078b13f35c57dd80804",
          small_image_url:
            "https://cdn.myanimelist.net/images/characters/12/538425t.webp?s=6fcca0ca41d34078b13f35c57dd80804",
        },
      },
      name: "Saotome, Yae",
    },
    {
      mal_id: 50057,
      url: "https://myanimelist.net/character/50057/Tomoko_Kuroki",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/characters/15/212635.jpg?s=d3756e5ae6e0e0f03736ba6f464227a2",
          base64: "https://cdn.myanimelist.net/images/characters/15/212635.jpg?s=d3756e5ae6e0e0f03736ba6f464227a2",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/characters/15/212635.webp?s=d3756e5ae6e0e0f03736ba6f464227a2",
          small_image_url:
            "https://cdn.myanimelist.net/images/characters/15/212635t.webp?s=d3756e5ae6e0e0f03736ba6f464227a2",
        },
      },
      name: "Kuroki, Tomoko",
    },
    {
      mal_id: 22054,
      url: "https://myanimelist.net/character/22054/Suruga_Kanbaru",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/characters/11/222449.jpg?s=807b29db48805d06f863451ae8b44d27",
          base64: "https://cdn.myanimelist.net/images/characters/11/222449.jpg?s=807b29db48805d06f863451ae8b44d27",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/characters/11/222449.webp?s=807b29db48805d06f863451ae8b44d27",
          small_image_url:
            "https://cdn.myanimelist.net/images/characters/11/222449t.webp?s=807b29db48805d06f863451ae8b44d27",
        },
      },
      name: "Kanbaru, Suruga",
    },
    {
      mal_id: 6977,
      url: "https://myanimelist.net/character/6977/Sawako_Kuronuma",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/characters/6/120945.jpg?s=b66012c0e8676ef7a444e429ed06e184",
          base64: "https://cdn.myanimelist.net/images/characters/6/120945.jpg?s=b66012c0e8676ef7a444e429ed06e184",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/characters/6/120945.webp?s=b66012c0e8676ef7a444e429ed06e184",
          small_image_url:
            "https://cdn.myanimelist.net/images/characters/6/120945t.webp?s=b66012c0e8676ef7a444e429ed06e184",
        },
      },
      name: "Kuronuma, Sawako",
    },
    {
      mal_id: 674,
      url: "https://myanimelist.net/character/674/Kagura",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/characters/2/245933.jpg?s=a256c2fb147ac3e58818f69eb7e9fe8c",
          base64: "https://cdn.myanimelist.net/images/characters/2/245933.jpg?s=a256c2fb147ac3e58818f69eb7e9fe8c",
        },
        webp: {
          image_url: "https://cdn.myanimelist.net/images/characters/2/245933.webp?s=a256c2fb147ac3e58818f69eb7e9fe8c",
          small_image_url:
            "https://cdn.myanimelist.net/images/characters/2/245933t.webp?s=a256c2fb147ac3e58818f69eb7e9fe8c",
        },
      },
      name: "Kagura",
    },
  ],
  people: [
    {
      mal_id: 2,
      url: "https://myanimelist.net/people/2/Tomokazu_Sugita",
      images: {
        jpg: {
          image_url: "https://cdn.myanimelist.net/images/voiceactors/1/81054.jpg?s=acb8e1dcacacc3d869c36ec876c8c4da",
          base64: "https://cdn.myanimelist.net/images/voiceactors/1/81054.jpg?s=acb8e1dcacacc3d869c36ec876c8c4da",
        },
      },
      name: "Sugita, Tomokazu",
    },
    {
      mal_id: 118,
      url: "https://myanimelist.net/people/118/Hiroshi_Kamiya",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/voiceactors/1/66163.jpg?s=cb07743b7325f20adaa7921160f73646",
        },
      },
      name: "Kamiya, Hiroshi",
    },
    {
      mal_id: 7899,
      url: "https://myanimelist.net/people/7899/Izumi_Kitta",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/voiceactors/1/55656.jpg?s=1aec911b4fc352baf988ed06c83ff3d1",
        },
      },
      name: "Kitta, Izumi",
    },
    {
      mal_id: 99,
      url: "https://myanimelist.net/people/99/Miyuki_Sawashiro",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/voiceactors/2/65500.jpg?s=80c733f0aefed4b574d900e2a4a9037e",
        },
      },
      name: "Sawashiro, Miyuki",
    },
    {
      mal_id: 4875,
      url: "https://myanimelist.net/people/4875/Yuyuko_Takemiya",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/voiceactors/3/60414.jpg?s=23363b3bbe0dbcf21cafbde02441454b",
        },
      },
      name: "Takemiya, Yuyuko",
    },
    {
      mal_id: 1904,
      url: "https://myanimelist.net/people/1904/Hideaki_Sorachi",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/voiceactors/1/44890.jpg?s=cf786139b5b5f43206e017497fbaa765",
        },
      },
      name: "Sorachi, Hideaki",
    },
    {
      mal_id: 13,
      url: "https://myanimelist.net/people/13/Ayako_Kawasumi",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/voiceactors/2/69419.jpg?s=19f702c4cf0e2e0b44e125f8bc9511ab",
        },
      },
      name: "Kawasumi, Ayako",
    },
    {
      mal_id: 8,
      url: "https://myanimelist.net/people/8/Rie_Kugimiya",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/voiceactors/3/63374.jpg?s=afa01c0ce80060bd11daeb6e220679c4",
        },
      },
      name: "Kugimiya, Rie",
    },
    {
      mal_id: 61,
      url: "https://myanimelist.net/people/61/Chiwa_Saitou",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/voiceactors/3/79603.jpg?s=0fdc6450e4421d1f182b6c6223723df5",
        },
      },
      name: "Saitou, Chiwa",
    },
    {
      mal_id: 5254,
      url: "https://myanimelist.net/people/5254/ISIN_NISIO",
      images: {
        jpg: {
          base64: "https://cdn.myanimelist.net/images/voiceactors/2/43583.jpg?s=d5875b3197c6226978d5eeac7a473f2d",
        },
      },
      name: "NISIO, ISIN",
    },
  ],
  updates: {
    anime: [
      {
        entry: {
          mal_id: 918,
          url: "https://myanimelist.net/anime/918/Gintama",
          images: {
            jpg: {
              image_url: "https://cdn.myanimelist.net/images/anime/10/73274.jpg?s=fdbf13c774b1342ac246244a1e09cefa",
              base64: "https://cdn.myanimelist.net/images/anime/10/73274.jpg?s=fdbf13c774b1342ac246244a1e09cefa",
              small_image_url:
                "https://cdn.myanimelist.net/images/anime/10/73274t.jpg?s=fdbf13c774b1342ac246244a1e09cefa",
              large_image_url:
                "https://cdn.myanimelist.net/images/anime/10/73274l.jpg?s=fdbf13c774b1342ac246244a1e09cefa",
            },
            webp: {
              image_url: "https://cdn.myanimelist.net/images/anime/10/73274.webp?s=fdbf13c774b1342ac246244a1e09cefa",
              small_image_url:
                "https://cdn.myanimelist.net/images/anime/10/73274t.webp?s=fdbf13c774b1342ac246244a1e09cefa",
              large_image_url:
                "https://cdn.myanimelist.net/images/anime/10/73274l.webp?s=fdbf13c774b1342ac246244a1e09cefa",
            },
          },
          title: "Gintama",
        },
        score: 0,
        status: "Watching",
        episodes_seen: 101,
        episodes_total: 201,
        date: "2024-10-09T23:17:00+00:00",
      },
      {
        entry: {
          mal_id: 39710,
          url: "https://myanimelist.net/anime/39710/Yesterday_wo_Utatte",
          images: {
            jpg: {
              image_url: "https://cdn.myanimelist.net/images/anime/1553/107721.jpg?s=dee54873cfcddcbca96efe5cbc68def9",
              base64: "https://cdn.myanimelist.net/images/anime/1553/107721.jpg?s=dee54873cfcddcbca96efe5cbc68def9",
              small_image_url:
                "https://cdn.myanimelist.net/images/anime/1553/107721t.jpg?s=dee54873cfcddcbca96efe5cbc68def9",
              large_image_url:
                "https://cdn.myanimelist.net/images/anime/1553/107721l.jpg?s=dee54873cfcddcbca96efe5cbc68def9",
            },
            webp: {
              image_url: "https://cdn.myanimelist.net/images/anime/1553/107721.webp?s=dee54873cfcddcbca96efe5cbc68def9",
              small_image_url:
                "https://cdn.myanimelist.net/images/anime/1553/107721t.webp?s=dee54873cfcddcbca96efe5cbc68def9",
              large_image_url:
                "https://cdn.myanimelist.net/images/anime/1553/107721l.webp?s=dee54873cfcddcbca96efe5cbc68def9",
            },
          },
          title: "Yesterday wo Utatte",
        },
        score: 0,
        status: "Plan to Watch",
        episodes_seen: null,
        episodes_total: null,
        date: "2024-10-07T13:40:00+00:00",
      },
      {
        entry: {
          mal_id: 56062,
          url: "https://myanimelist.net/anime/56062/Naze_Boku_no_Sekai_wo_Daremo_Oboeteinai_no_ka",
          images: {
            jpg: {
              image_url: "https://cdn.myanimelist.net/images/anime/1664/144272.jpg?s=8ec76f99596f38c2100fcb0bcbf0483b",
              base64: "https://cdn.myanimelist.net/images/anime/1664/144272.jpg?s=8ec76f99596f38c2100fcb0bcbf0483b",
              small_image_url:
                "https://cdn.myanimelist.net/images/anime/1664/144272t.jpg?s=8ec76f99596f38c2100fcb0bcbf0483b",
              large_image_url:
                "https://cdn.myanimelist.net/images/anime/1664/144272l.jpg?s=8ec76f99596f38c2100fcb0bcbf0483b",
            },
            webp: {
              image_url: "https://cdn.myanimelist.net/images/anime/1664/144272.webp?s=8ec76f99596f38c2100fcb0bcbf0483b",
              small_image_url:
                "https://cdn.myanimelist.net/images/anime/1664/144272t.webp?s=8ec76f99596f38c2100fcb0bcbf0483b",
              large_image_url:
                "https://cdn.myanimelist.net/images/anime/1664/144272l.webp?s=8ec76f99596f38c2100fcb0bcbf0483b",
            },
          },
          title: "Naze Boku no Sekai wo Daremo Oboeteinai no ka?",
        },
        score: 6,
        status: "Completed",
        episodes_seen: 12,
        episodes_total: 12,
        date: "2024-10-01T19:59:00+00:00",
      },
    ],
    manga: [
      {
        entry: {
          mal_id: 100127,
          url: "https://myanimelist.net/manga/100127/Uchi_no_Ko_no_Tame_naraba_Ore_wa_Moshikashitara_Maou_mo_Taoseru_kamo_Shirenai",
          images: {
            jpg: {
              image_url: "https://cdn.myanimelist.net/images/manga/2/189919.jpg?s=5be11f851a5c46513f4d06355b90acd5",
              base64: "https://cdn.myanimelist.net/images/manga/2/189919.jpg?s=5be11f851a5c46513f4d06355b90acd5",
              small_image_url:
                "https://cdn.myanimelist.net/images/manga/2/189919t.jpg?s=5be11f851a5c46513f4d06355b90acd5",
              large_image_url:
                "https://cdn.myanimelist.net/images/manga/2/189919l.jpg?s=5be11f851a5c46513f4d06355b90acd5",
            },
            webp: {
              image_url: "https://cdn.myanimelist.net/images/manga/2/189919.webp?s=5be11f851a5c46513f4d06355b90acd5",
              small_image_url:
                "https://cdn.myanimelist.net/images/manga/2/189919t.webp?s=5be11f851a5c46513f4d06355b90acd5",
              large_image_url:
                "https://cdn.myanimelist.net/images/manga/2/189919l.webp?s=5be11f851a5c46513f4d06355b90acd5",
            },
          },
          title: "Uchi no Ko no Tame naraba, Ore wa Moshikashitara Maou mo Taoseru kamo Shirenai.",
        },
        score: 8,
        status: "Reading",
        chapters_read: null,
        chapters_total: null,
        date: "2024-10-14T21:19:00+00:00",
      },
      {
        entry: {
          mal_id: 152183,
          url: "https://myanimelist.net/manga/152183/The_Dukes_Darling_Daughter-in-Law",
          images: {
            jpg: {
              image_url: "https://cdn.myanimelist.net/images/manga/1/269491.jpg?s=e17045c74b1ec1a26df8159749f0226f",
              base64: "https://cdn.myanimelist.net/images/manga/1/269491.jpg?s=e17045c74b1ec1a26df8159749f0226f",
              small_image_url:
                "https://cdn.myanimelist.net/images/manga/1/269491t.jpg?s=e17045c74b1ec1a26df8159749f0226f",
              large_image_url:
                "https://cdn.myanimelist.net/images/manga/1/269491l.jpg?s=e17045c74b1ec1a26df8159749f0226f",
            },
            webp: {
              image_url: "https://cdn.myanimelist.net/images/manga/1/269491.webp?s=e17045c74b1ec1a26df8159749f0226f",
              small_image_url:
                "https://cdn.myanimelist.net/images/manga/1/269491t.webp?s=e17045c74b1ec1a26df8159749f0226f",
              large_image_url:
                "https://cdn.myanimelist.net/images/manga/1/269491l.webp?s=e17045c74b1ec1a26df8159749f0226f",
            },
          },
          title: "The Duke's Darling Daughter-in-Law",
        },
        score: 6,
        status: "On-Hold",
        chapters_read: null,
        chapters_total: null,
        date: "2024-10-13T21:29:00+00:00",
      },
      {
        entry: {
          mal_id: 146912,
          url: "https://myanimelist.net/manga/146912/Beware_the_Villainess",
          images: {
            jpg: {
              image_url: "https://cdn.myanimelist.net/images/manga/2/260779.jpg?s=292f51ad685d3602151a9230d75005dc",
              base64: "https://cdn.myanimelist.net/images/manga/2/260779.jpg?s=292f51ad685d3602151a9230d75005dc",
              small_image_url:
                "https://cdn.myanimelist.net/images/manga/2/260779t.jpg?s=292f51ad685d3602151a9230d75005dc",
              large_image_url:
                "https://cdn.myanimelist.net/images/manga/2/260779l.jpg?s=292f51ad685d3602151a9230d75005dc",
            },
            webp: {
              image_url: "https://cdn.myanimelist.net/images/manga/2/260779.webp?s=292f51ad685d3602151a9230d75005dc",
              small_image_url:
                "https://cdn.myanimelist.net/images/manga/2/260779t.webp?s=292f51ad685d3602151a9230d75005dc",
              large_image_url:
                "https://cdn.myanimelist.net/images/manga/2/260779l.webp?s=292f51ad685d3602151a9230d75005dc",
            },
          },
          title: "Beware the Villainess!",
        },
        score: 3,
        status: "Dropped",
        chapters_read: 47,
        chapters_total: 128,
        date: "2024-10-13T09:32:00+00:00",
      },
    ],
  },
}

const fakeData = {
  get animes() {
    return shuffleArray(baseData.animes)
  },
  get characters() {
    return shuffleArray(baseData.characters)
  },
  get mangas() {
    return shuffleArray(baseData.mangas)
  },
  get people() {
    return shuffleArray(baseData.people)
  },
  get updates() {
    return {
      anime: shuffleArray(baseData.updates.anime),
      manga: shuffleArray(baseData.updates.manga),
    }
  },
}

export default fakeData
