
import type {
  MyAnimeListData,
  AnimeStatistics,
  MangaStatistics,
  BasicCharacterFavorite,
  FullAnimeFavorite,
  FullMangaFavorite,
  BasicPeopleFavorite,
  BasicAnimeFavorite,
  BasicMangaFavorite,
  LastUpdatesAnime,
  LastUpdatesManga
} from "../types.js"

export function getMockMyAnimeListData(): MyAnimeListData {
  const mockAnimeStats: AnimeStatistics = {
    days_watched: 65.8,
    mean_score: 6.43,
    watching: 2,
    completed: 273,
    on_hold: 8,
    dropped: 39,
    plan_to_watch: 38,
    total_entries: 360,
    rewatched: 20,
    episodes_watched: 4111,
  }

  const mockMangaStats: MangaStatistics = {
    days_read: 93.7,
    mean_score: 6.54,
    reading: 48,
    completed: 56,
    on_hold: 28,
    dropped: 60,
    plan_to_read: 21,
    total_entries: 213,
    reread: 4,
    chapters_read: 13078,
    volumes_read: 517,
  }

  const basicAnimeFavorites: BasicAnimeFavorite[] = [
  {
    mal_id: 1698,
    title: 'Nodame Cantabile',
    image: 'https://cdn.myanimelist.net/images/anime/9/11986l.webp?s=e586004bf43e678f7a93a301859adf1b',
    start_year: 0,
    type: 'TV'
  },
  {
    mal_id: 4224,
    title: 'Toradora!',
    image: 'https://cdn.myanimelist.net/images/anime/13/22128l.webp?s=fa7d47bc3bec4cd26d628c5760228c99',
    start_year: 0,
    type: 'TV'
  },
  {
    mal_id: 5081,
    title: 'Bakemonogatari',
    image: 'https://cdn.myanimelist.net/images/anime/11/75274l.webp?s=950c09e4c176ebfb7536962be2b1bae5',
    start_year: 0,
    type: 'TV'
  },
  {
    mal_id: 3702,
    title: 'Detroit Metal City',
    image: 'https://cdn.myanimelist.net/images/anime/3/9853l.webp?s=d573d17bf570bef4da8adde3d5139da6',
    start_year: 0,
    type: 'OVA'
  },
  {
    mal_id: 30831,
    title: 'Kono Subarashii Sekai ni Shukufuku wo!',
    image: 'https://cdn.myanimelist.net/images/anime/1895/142748l.webp?s=725fe8c638210f856406b86149af016e',
    start_year: 0,
    type: 'TV'
  },
  {
    mal_id: 20785,
    title: 'Mahouka Koukou no Rettousei',
    image: 'https://cdn.myanimelist.net/images/anime/11/61039l.webp?s=71c2a88c1b3b0a4cdb0c8d6b17a7d18e',
    start_year: 0,
    type: 'TV'
  }
]

  const basicMangaFavorites: BasicMangaFavorite[] = [
  {
    mal_id: 14893,
    title: 'Monogatari Series: First Season',
    image: 'https://cdn.myanimelist.net/images/manga/2/279887l.webp?s=56fb228c092b690f9014afcbbe2ce548',
    start_year: 0,
    type: 'Light Novel'
  },
  {
    mal_id: 419,
    title: 'Nodame Cantabile',
    image: 'https://cdn.myanimelist.net/images/manga/2/153962l.webp?s=8eed2b5fd5a7a66c9fa95c002d40d43a',
    start_year: 0,
    type: 'Manga'
  },
  {
    mal_id: 7149,
    title: 'Toradora!',
    image: 'https://cdn.myanimelist.net/images/manga/1/148447l.webp?s=f3a3d7433244a7fcf877dfe37a1b64fc',
    start_year: 0,
    type: 'Light Novel'
  },
  {
    mal_id: 109339,
    title: 'Saihate no Paladin',
    image: 'https://cdn.myanimelist.net/images/manga/2/208057l.webp?s=7fd31f03c25259c91aa5459674b00171',
    start_year: 0,
    type: 'Manga'
  },
  {
    mal_id: 102997,
    title: 'Saotome Senshu, Hitakakusu',
    image: 'https://cdn.myanimelist.net/images/manga/1/189746l.webp?s=9b6f15b5d41c6afca9b438698528ad5a',
    start_year: 0,
    type: 'Manga'
  },
  {
    mal_id: 31,
    title: 'Lovely★Complex',
    image: 'https://cdn.myanimelist.net/images/manga/1/209659l.webp?s=7ccf416ea0711f702a361c90fd258603',
    start_year: 0,
    type: 'Manga'
  },
  {
    mal_id: 28533,
    title: 'Watashi ga Motenai no wa Dou Kangaetemo Omaera ga Warui!',
    image: 'https://cdn.myanimelist.net/images/manga/5/63521l.webp?s=bab4088dfa68ddad739a3d52bc1140b3',
    start_year: 0,
    type: 'Manga'
  },
  {
    mal_id: 114175,
    title: 'Shin no Nakama ja Nai to Yuusha no Party wo Oidasareta node, Henkyou de Slow Life suru Koto ni Shimashita',
    image: 'https://cdn.myanimelist.net/images/manga/2/223659l.webp?s=ec2b47456a75e24dcf9c55d9892dbf13',
    start_year: 0,
    type: 'Manga'
  }
]

  const characterFavorites: BasicCharacterFavorite[] = [
  {
    mal_id: 22037,
    name: 'Senjougahara, Hitagi',
    image: 'https://cdn.myanimelist.net/images/characters/11/287902.webp?s=559b750212c5338e987b3d0ebac9d810'
  },
  {
    mal_id: 1185,
    name: 'Noda, Megumi',
    image: 'https://cdn.myanimelist.net/images/characters/11/92497.webp?s=f8d450c55e9f47ee9b6cb93c9cb5a098'
  },
  {
    mal_id: 12064,
    name: 'Aisaka, Taiga',
    image: 'https://cdn.myanimelist.net/images/characters/11/514086.webp?s=87920301db499bb344d2efd437699bc4'
  },
  {
    mal_id: 153859,
    name: 'Saotome, Yae',
    image: 'https://cdn.myanimelist.net/images/characters/12/538425.webp?s=6fcca0ca41d34078b13f35c57dd80804'
  },
  {
    mal_id: 50057,
    name: 'Kuroki, Tomoko',
    image: 'https://cdn.myanimelist.net/images/characters/15/212635.webp?s=d3756e5ae6e0e0f03736ba6f464227a2'
  },
  {
    mal_id: 22054,
    name: 'Kanbaru, Suruga',
    image: 'https://cdn.myanimelist.net/images/characters/11/222449.webp?s=807b29db48805d06f863451ae8b44d27'
  },
  {
    mal_id: 6977,
    name: 'Kuronuma, Sawako',
    image: 'https://cdn.myanimelist.net/images/characters/11/597997.webp?s=b4105fec8ee4b8dcaf13f4858ab14e26'
  },
  {
    mal_id: 674,
    name: 'Kagura',
    image: 'https://cdn.myanimelist.net/images/characters/2/505912.webp?s=5267fe4113ece30080a8d93ee3fd9d9c'
  }
]

  const peopleFavorites: BasicPeopleFavorite[] = [
  {
    mal_id: 2,
    name: 'Sugita, Tomokazu',
    image: 'https://cdn.myanimelist.net/images/voiceactors/1/81054.jpg?s=acb8e1dcacacc3d869c36ec876c8c4da'
  },
  {
    mal_id: 118,
    name: 'Kamiya, Hiroshi',
    image: 'https://cdn.myanimelist.net/images/voiceactors/1/66163.jpg?s=cb07743b7325f20adaa7921160f73646'
  },
  {
    mal_id: 7899,
    name: 'Kitta, Izumi',
    image: 'https://cdn.myanimelist.net/images/voiceactors/1/55656.jpg?s=1aec911b4fc352baf988ed06c83ff3d1'
  },
  {
    mal_id: 99,
    name: 'Sawashiro, Miyuki',
    image: 'https://cdn.myanimelist.net/images/voiceactors/2/65500.jpg?s=80c733f0aefed4b574d900e2a4a9037e'
  },
  {
    mal_id: 4875,
    name: 'Takemiya, Yuyuko',
    image: 'https://cdn.myanimelist.net/images/voiceactors/3/60414.jpg?s=23363b3bbe0dbcf21cafbde02441454b'
  },
  {
    mal_id: 1904,
    name: 'Sorachi, Hideaki',
    image: 'https://cdn.myanimelist.net/images/voiceactors/1/44890.jpg?s=cf786139b5b5f43206e017497fbaa765'
  },
  {
    mal_id: 13,
    name: 'Kawasumi, Ayako',
    image: 'https://cdn.myanimelist.net/images/voiceactors/2/69419.jpg?s=19f702c4cf0e2e0b44e125f8bc9511ab'
  },
  {
    mal_id: 8,
    name: 'Kugimiya, Rie',
    image: 'https://cdn.myanimelist.net/images/voiceactors/3/63374.jpg?s=afa01c0ce80060bd11daeb6e220679c4'
  },
  {
    mal_id: 61,
    name: 'Saitou, Chiwa',
    image: 'https://cdn.myanimelist.net/images/voiceactors/3/79603.jpg?s=0fdc6450e4421d1f182b6c6223723df5'
  },
  {
    mal_id: 5254,
    name: 'NISIO, ISIN',
    image: 'https://cdn.myanimelist.net/images/voiceactors/2/43583.jpg?s=d5875b3197c6226978d5eeac7a473f2d'
  }
]

  const animeFavorites: FullAnimeFavorite[] = [
  {
    mal_id: 1698,
    title: 'Nodame Cantabile',
    image: 'https://cdn.myanimelist.net/images/anime/9/11986l.webp?s=e586004bf43e678f7a93a301859adf1b',
    start_year: 0,
    type: 'TV',
    synopsis: "Shinichi Chiaki is a first class musician whose dream is to play among the elites in Europe. Coming from a distinguished family, he is an infamous perfectionist—not only is he highly critical of himself, but of others as well. The only thing stopping Shinichi from leaving for Europe is his fear of flying. As a result, he's grounded in Japan.\n\nDuring his fourth year at Japan's top music university, Shinichi happens to meet Megumi Noda or, as she refers to herself, Nodame. On the surface, she seems to be an unkempt girl with no direction in life. However, when Shinichi hears Nodame play the piano for the first time, he is in awe of the kind of music she creates. Nevertheless, Shinichi is dismayed to discover that Nodame is his neighbor, and worse, she ends up falling head over heels in love with him.\n\n[Written by MAL Rewrite]",
    score: 8.25,
    popularity: 823,
    episodes: 23,
    status: 'Finished Airing',
    rank: 354,
    year: 2007,
    genres: [
      {
        name: 'Comedy'
      },
      {
        name: 'Romance'
      }
    ]
  },
  {
    mal_id: 4224,
    title: 'Toradora!',
    image: 'https://cdn.myanimelist.net/images/anime/13/22128l.webp?s=fa7d47bc3bec4cd26d628c5760228c99',
    start_year: 0,
    type: 'TV',
    synopsis: "Ryuuji Takasu is a gentle high school student with a love for housework; but in contrast to his kind nature, he has an intimidating face that often gets him labeled as a delinquent. On the other hand is Taiga Aisaka, a small, doll-like student, who is anything but a cute and fragile girl. Equipped with a wooden katana and feisty personality, Taiga is known throughout the school as the 'Palmtop Tiger.'\n\nOne day, an embarrassing mistake causes the two students to cross paths. Ryuuji discovers that Taiga actually has a sweet side: she has a crush on the popular vice president, Yuusaku Kitamura, who happens to be his best friend. But things only get crazier when Ryuuji reveals that he has a crush on Minori Kushieda—Taiga's best friend!\n\nToradora! is a romantic comedy that follows this odd duo as they embark on a quest to help each other with their respective crushes, forming an unlikely alliance in the process.\n\n[Written by MAL Rewrite]",
    score: 8.04,
    popularity: 26,
    episodes: 25,
    status: 'Finished Airing',
    rank: 634,
    year: 2008,
    genres: [
      {
        name: 'Drama'
      },
      {
        name: 'Romance'
      }
    ]
  },
  {
    mal_id: 5081,
    title: 'Bakemonogatari',
    image: 'https://cdn.myanimelist.net/images/anime/11/75274l.webp?s=950c09e4c176ebfb7536962be2b1bae5',
    start_year: 0,
    type: 'TV',
    synopsis: "Koyomi Araragi, a third-year high school student, manages to survive a vampire attack with the help of Meme Oshino, a strange man residing in an abandoned building. Though being saved from vampirism and now a human again, several side effects such as superhuman healing abilities and enhanced vision still remain. Regardless, Araragi tries to live the life of a normal student, with the help of his friend and the class president, Tsubasa Hanekawa.\n\nWhen fellow classmate Hitagi Senjougahara falls down the stairs and is caught by Araragi, the boy realizes that the girl is unnaturally weightless. Despite Senjougahara's protests, Araragi insists he help her, deciding to enlist the aid of Oshino, the very man who had once helped him with his own predicament.\n\nThrough several tales involving demons and gods, Bakemonogatari follows Araragi as he attempts to help those who suffer from supernatural maladies.\n\n[Written by MAL Rewrite]",
    score: 8.32,
    popularity: 97,
    episodes: 15,
    status: 'Finished Airing',
    rank: 282,
    year: 2009,
    genres: [
      {
        name: 'Mystery'
      },
      {
        name: 'Romance'
      },
      {
        name: 'Supernatural'
      }
    ]
  },
  {
    mal_id: 3702,
    title: 'Detroit Metal City',
    image: 'https://cdn.myanimelist.net/images/anime/3/9853l.webp?s=d573d17bf570bef4da8adde3d5139da6',
    start_year: 0,
    type: 'OVA',
    synopsis: "Dominating the world of indie music, Detroit Metal City (DMC) is a popular death metal band known for its captivatingly dark and crude style. Its extravagant lead singer, Johannes Krauser II, is especially infamous as a demonic being who has risen from the fiery pits of hell itself in order to bring the world to its knees and lord over all mortals—or at least that's what he's publicized to be.\n\nUnbeknownst to his many worshippers, Krauser II is just the alter ego of an average college graduate named Souichi Negishi. Although he is soft-spoken, peace-loving, and would rather listen to Swedish pop all day, he must participate in DMC's garish concerts in order to make ends meet. Detroit Metal City chronicles Negishi's hilarious misadventures as he attempts to juggle his hectic band life, a seemingly budding romance, and dealing with his incredibly obsessive and dedicated fans.\n\n[Written by MAL Rewrite]",
    score: 8.09,
    popularity: 1227,
    episodes: 12,
    status: 'Finished Airing',
    rank: 574,
    year: null,
    genres: [
      {
        name: 'Comedy'
      }
    ]
  },
  {
    mal_id: 30831,
    title: 'Kono Subarashii Sekai ni Shukufuku wo!',
    image: 'https://cdn.myanimelist.net/images/anime/1895/142748l.webp?s=725fe8c638210f856406b86149af016e',
    start_year: 0,
    type: 'TV',
    synopsis: "After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named Aqua. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer's dream—a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake—Aqua is completely useless!\n\nUnfortunately, their troubles don't end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!\n\n[Written by MAL Rewrite]",
    score: 8.09,
    popularity: 38,
    episodes: 10,
    status: 'Finished Airing',
    rank: 564,
    year: 2016,
    genres: [
      {
        name: 'Adventure'
      },
      {
        name: 'Comedy'
      },
      {
        name: 'Fantasy'
      }
    ]
  }
]

  const mangaFavorites: FullMangaFavorite[] = [
  {
    mal_id: 14893,
    title: 'Monogatari Series: First Season',
    image: 'https://cdn.myanimelist.net/images/manga/2/279887l.webp?s=56fb228c092b690f9014afcbbe2ce548',
    start_year: 0,
    type: 'Light Novel',
    synopsis: "This is a story, a 'ghostory' of sorts, about scars that bond, monsters that haunt, and fakes that deceive.\n\nThe story of Koyomi Araragi begins through a fateful encounter with the all-powerful, blonde-haired, 'hot-blooded, iron-blooded, and cold-blooded' vampire, later introduced as Shinobu Oshino. Their tragic rendezvous results in the end of Araragi's life as a human and his subsequent rebirth as a vampire—a monster. However, this encounter is only the start of his meddlings with the supernatural. Koyomi's noble personality ultimately sees him getting further involved in the lives of others with supernatural afflictions. This is his desperate attempt at returning to a normal human life, in a paranormal world filled with nothing but tragedy, suffering, and inhumanity.\n\n[Written by MAL Rewrite]\n\nThis entry includes the first season of the Monogatari Series.",
    score: 8.91,
    popularity: 274,
    chapters: 107,
    rank: 22,
    volumes: 6,
    status: 'Finished',
    year: null,
    genres: [
      {
        name: 'Action'
      },
      {
        name: 'Comedy'
      },
      {
        name: 'Mystery'
      },
      {
        name: 'Romance'
      },
      {
        name: 'Supernatural'
      }
    ]
  },
  {
    mal_id: 419,
    title: 'Nodame Cantabile',
    image: 'https://cdn.myanimelist.net/images/manga/2/153962l.webp?s=8eed2b5fd5a7a66c9fa95c002d40d43a',
    start_year: 0,
    type: 'Manga',
    synopsis: "Shinichi Chiaki, the perfectionist son of a famous pianist, is in his fourth year at Momogaoka College of Music, hoping to achieve his secret dream of being a conductor. His admiration for his father led him to pursue a career in music. As much as he wants to return to Europe, his phobia of flying traps him in Japan where he now lives.\n\nOne night, he passes out, and ends up being taken in by Megumi 'Nodame' Noda. Upon first glance, Nodame is a talented pianist, but she is also slobbish and eccentric. What's even worse is that she is his neighbor and he ends up forced to work with her. Though it sounds like a recipe for disaster, Chiaki is drawn to this girl who makes him remember the love for music he once held. Just what does the future hold for this musical duo?\n\n[Written by MAL Rewrite]",
    score: 8.39,
    popularity: 691,
    chapters: 150,
    rank: 231,
    volumes: 25,
    status: 'Finished',
    year: null,
    genres: [
      {
        name: 'Award Winning'
      },
      {
        name: 'Comedy'
      },
      {
        name: 'Romance'
      },
      {
        name: 'Slice of Life'
      }
    ]
  },
  {
    mal_id: 7149,
    title: 'Toradora!',
    image: 'https://cdn.myanimelist.net/images/manga/1/148447l.webp?s=f3a3d7433244a7fcf877dfe37a1b64fc',
    start_year: 0,
    type: 'Light Novel',
    synopsis: "Takasu Ryuuji might look like a thug, but he's actually a nice guy. Making friends when you've got an unintentionally scary face is tough—and don't even get him started on girlfriends. But with his secret crush in his class, the start of his second year of high school is off to a good start...until he crosses paths with Aisaka Taiga. Beautiful, frightening, and not quite five feet tall, the girl known as the Palmtop Tiger is the one person in school even scarier than Ryuuji himself—and he's just made the mistake of making her very, very angry.\n\n(Source: Seven Seas Entertainment)",
    score: 8.21,
    popularity: 705,
    chapters: 62,
    rank: 445,
    volumes: 10,
    status: 'Finished',
    year: null,
    genres: [
      {
        name: 'Drama'
      },
      {
        name: 'Romance'
      }
    ]
  },
  {
    mal_id: 109339,
    title: 'Saihate no Paladin',
    image: 'https://cdn.myanimelist.net/images/manga/2/208057l.webp?s=7fd31f03c25259c91aa5459674b00171',
    start_year: 0,
    type: 'Manga',
    synopsis: 'William is the lone human in a city of the dead. Born with vague memories of a past life in contemporary Japan where he failed to do anything useful, he is determined not to make the same mistake again, and that this time, his life will be lived. But what does that really mean? Raised by a group of the undead, William must discover what circumstances brought him to this city and these people as well as what it means to not just exist, but to live a full life.\n\n(Source: ANN)',
    score: 7.8,
    popularity: 602,
    chapters: null,
    rank: 1411,
    volumes: null,
    status: 'Publishing',
    year: null,
    genres: [
      {
        name: 'Action'
      },
      {
        name: 'Adventure'
      },
      {
        name: 'Fantasy'
      }
    ]
  },
  {
    mal_id: 102997,
    title: 'Saotome Senshu, Hitakakusu',
    image: 'https://cdn.myanimelist.net/images/manga/1/189746l.webp?s=9b6f15b5d41c6afca9b438698528ad5a',
    start_year: 0,
    type: 'Manga',
    synopsis: "Satoru Tsukishima has just been confessed to by fellow high school boxing club member Yae Saotome, who is currently the Kanto region's Female Featherweight Champion. Overjoyed at first, Satoru isn't able to accept her feelings as he believes that she should be focusing on boxing instead. Yae's championship will soon be on the line, and the entire school is counting on her to someday represent Tokyo in the Olympics. It also doesn't help that he's nowhere near as skilled as she is, conflicted by the thought of a rising star being in a relationship with someone as average as him.\n\nBut when their coach finds out about the confession, Satoru is assigned as Yae's trainer so the two can secretly date and spend more time together while also engaging in club activities. However, if anyone finds out about the two, it will mean the end of their relationship. With this in mind, their pure and awkward romance begins!\n\n[Written by MAL Rewrite]",
    score: 7.47,
    popularity: 632,
    chapters: 124,
    rank: 3318,
    volumes: 10,
    status: 'Finished',
    year: null,
    genres: [
      {
        name: 'Comedy'
      },
      {
        name: 'Romance'
      },
      {
        name: 'Sports'
      }
    ]
  }
]

  const lastUpdatesAnime: LastUpdatesAnime[] = [
  {
    title: 'Ore dake Level Up na Ken Season 2: Arise from the Shadow',
    image: 'https://cdn.myanimelist.net/images/anime/1448/147351l.webp?s=0b2e4eac5b1a337235330e095129c3e4',
    score: 6,
    status: 'Completed',
    episodes_seen: 13,
    episodes_total: 13,
    date: '2025-04-14T21:21:00+00:00'
  },
  {
    title: 'Kage no Jitsuryokusha ni Naritakute!',
    image: 'https://cdn.myanimelist.net/images/anime/1091/128729l.webp?s=1d7ea7da7faa2acc0d1c2f9cf7d1bfad',
    score: 7,
    status: 'Completed',
    episodes_seen: 20,
    episodes_total: 20,
    date: '2025-03-22T17:19:00+00:00'
  },
  {
    title: 'Tate no Yuusha no Nariagari Season 3',
    image: 'https://cdn.myanimelist.net/images/anime/1317/139802l.webp?s=2d6833d0f4f111435d8f51473aa23805',
    score: 5,
    status: 'Completed',
    episodes_seen: 12,
    episodes_total: 12,
    date: '2025-01-21T09:36:00+00:00'
  }
]

  const lastUpdatesManga: LastUpdatesManga[] = [
  {
    title: 'Tanbo de Hirotta Onna Kishi, Inaka de Ore no Yome dato Omowareteiru',
    image: 'https://cdn.myanimelist.net/images/manga/2/282862l.webp?s=1085e23bd5cbd202303f4028b60f7ae3',
    score: 0,
    status: 'Reading',
    chapters_read: null,
    chapters_total: null,
    date: '2025-10-22T13:39:00+00:00'
  },
  {
    title: 'Tsuihou sareru Tabi ni Skill wo Te ni Ireta Ore ga, 100 no Isekai de 2-shuume Musou',
    image: 'https://cdn.myanimelist.net/images/manga/1/278728l.webp?s=8b465c0bfe93eb5046a5445020cfb3c3',
    score: 8,
    status: 'Reading',
    chapters_read: null,
    chapters_total: null,
    date: '2025-10-22T09:52:00+00:00'
  },
  {
    title: 'Otome Game no Heroine de Saikyou Survival @comic',
    image: 'https://cdn.myanimelist.net/images/manga/1/256791l.webp?s=022202543a43602d79fa3a8f5b232e21',
    score: 7,
    status: 'Reading',
    chapters_read: null,
    chapters_total: null,
    date: '2025-10-14T19:43:00+00:00'
  }
]

  return {
    favorites: {
      anime: basicAnimeFavorites,
      manga: basicMangaFavorites,
      characters: characterFavorites,
      people: peopleFavorites,
    },
    favorites_full: {
      anime: animeFavorites,
      manga: mangaFavorites,
      characters: characterFavorites,
      people: peopleFavorites,
    },
    last_updated: {
      anime: lastUpdatesAnime,
      manga: lastUpdatesManga,
    },
    statistics: {
      anime: mockAnimeStats,
      manga: mockMangaStats,
    },
  }
}