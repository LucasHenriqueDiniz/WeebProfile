import {
  BasicCharacterFavorite,
  BasicPeopleFavorite,
  FullAnimeFavorite,
  FullMangaFavorite,
} from "../types/malFavorites"

const animeData: FullAnimeFavorite[] = [
  {
    mal_id: 5081,
    image: "https://cdn.myanimelist.net/images/anime/11/75274l.jpg",
    title: "Bakemonogatari",
    type: "TV",
    episodes: 15,
    status: "Finished Airing",
    score: 8.32,
    rank: 253,
    popularity: 94,
    synopsis:
      "Koyomi Araragi, a third-year high school student, manages to survive a vampire attack with the help of Meme Oshino, a strange man residing in an abandoned building. Though being saved from vampirism and now a human again, several side effects such as superhuman healing abilities and enhanced vision still remain. Regardless, Araragi tries to live the life of a normal student, with the help of his friend and the class president, Tsubasa Hanekawa.\n\nWhen fellow classmate Hitagi Senjougahara falls down the stairs and is caught by Araragi, the boy realizes that the girl is unnaturally weightless. Despite Senjougahara's protests, Araragi insists he help her, deciding to enlist the aid of Oshino, the very man who had once helped him with his own predicament.\n\nThrough several tales involving demons and gods, Bakemonogatari follows Araragi as he attempts to help those who suffer from supernatural maladies.\n\n[Written by MAL Rewrite],",
    year: 2009,
    start_year: 2009,
    genres: [
      {
        name: "Mystery",
      },
      {
        name: "Romance",
      },
      {
        name: "Supernatural",
      },
      {
        name: "Vampire",
      },
    ],
  },
  {
    mal_id: 1698,
    image: "https://cdn.myanimelist.net/images/anime/9/11986l.jpg",
    title: "Nodame Cantabile",
    type: "TV",
    episodes: 23,
    status: "Finished Airing",
    score: 8.26,
    rank: 322,
    popularity: 783,
    synopsis:
      "Shinichi Chiaki is a first class musician whose dream is to play among the elites in Europe. Coming from a distinguished family, he is an infamous perfectionist—not only is he highly critical of himself, but of others as well. The only thing stopping Shinichi from leaving for Europe is his fear of flying. As a result, he's grounded in Japan.\n\nDuring his fourth year at Japan's top music university, Shinichi happens to meet Megumi Noda or, as she refers to herself, Nodame. On the surface, she seems to be an unkempt girl with no direction in life. However, when Shinichi hears Nodame play the piano for the first time, he is in awe of the kind of music she creates. Nevertheless, Shinichi is dismayed to discover that Nodame is his neighbor, and worse, she ends up falling head over heels in love with him.\n\n[Written by MAL Rewrite]",
    year: 2007,
    start_year: 2007,
    genres: [
      {
        name: "Comedy",
      },
      {
        name: "Romance",
      },
    ],
  },
  {
    mal_id: 1535,
    image: "https://cdn.myanimelist.net/images/anime/1079/138100l.jpg",
    title: "Death Note",
    type: "TV",
    episodes: 37,
    status: "Finished Airing",
    score: 8.62,
    rank: 89,
    popularity: 2,
    synopsis:
      "Brutal murders, petty thefts, and senseless violence pollute the human world. In contrast, the realm of death gods is a humdrum, unchanging gambling den. The ingenious 17-year-old Japanese student Light Yagami and sadistic god of death Ryuk share one belief: their worlds are rotten.\n\nFor his own amusement, Ryuk drops his Death Note into the human world. Light stumbles upon it, deeming the first of its rules ridiculous: the human whose name is written in this note shall die. However, the temptation is too great, and Light experiments by writing a felon's name, which disturbingly enacts his first murder.\n\nAware of the terrifying godlike power that has fallen into his hands, Light—under the alias Kira—follows his wicked sense of justice with the ultimate goal of cleansing the world of all evil-doers. The meticulous mastermind detective L is already on his trail, but as Light's brilliance rivals L's, the grand chase for Kira turns into an intense battle of wits that can only end when one of them is dead.\n\n[Written by MAL Rewrite]",
    year: 2006,
    start_year: 2006,
    genres: [
      {
        name: "Supernatural",
      },
      {
        name: "Suspense",
      },
      {
        name: "Psychological",
      },
    ],
  },
  {
    mal_id: 20785,
    image: "https://cdn.myanimelist.net/images/anime/11/61039l.jpg",
    title: "Mahouka Koukou no Rettousei",
    type: "TV",
    episodes: 26,
    status: "Finished Airing",
    score: 7.38,
    rank: 2406,
    popularity: 139,
    synopsis:
      'In the dawn of the 21st century, magic, long thought to be folklore and fairy tales, has become a systematized technology and is taught as a technical skill. In First High School, the institution for magicians, students are segregated into two groups based on their entrance exam scores: "Blooms," those who receive high scores, are assigned to the First Course, while "Weeds" are reserve students assigned to the Second Course.\n\nMahouka Koukou no Rettousei follows the siblings, Tatsuya and Miyuki Shiba, who are enrolled in First High School. Upon taking the exam, the prodigious Miyuki is placed in the First Course, while Tatsuya is relegated to the Second Course. Though his practical test scores and status as a "Weed" show him to be magically inept, he possesses extraordinary technical knowledge, physical combat capabilities, and unique magic techniques—making Tatsuya the irregular at a magical high school.\n\n[Written by MAL Rewrite]',
    year: 2014,
    start_year: 2014,
    genres: [
      {
        name: "Action",
      },
      {
        name: "Fantasy",
      },
      {
        name: "Romance",
      },
      {
        name: "Sci-Fi",
      },
    ],
  },
  {
    mal_id: 30831,
    image: "https://cdn.myanimelist.net/images/anime/1895/142748l.jpg",
    title: "Kono Subarashii Sekai ni Shukufuku wo!",
    type: "TV",
    episodes: 10,
    status: "Finished Airing",
    score: 8.1,
    rank: 510,
    popularity: 38,
    synopsis:
      "After dying a laughable and pathetic death on his way back from buying a game, high school student and recluse Kazuma Satou finds himself sitting before a beautiful but obnoxious goddess named Aqua. She provides the NEET with two options: continue on to heaven or reincarnate in every gamer's dream—a real fantasy world! Choosing to start a new life, Kazuma is quickly tasked with defeating a Demon King who is terrorizing villages. But before he goes, he can choose one item of any kind to aid him in his quest, and the future hero selects Aqua. But Kazuma has made a grave mistake—Aqua is completely useless!\n\nUnfortunately, their troubles don't end here; it turns out that living in such a world is far different from how it plays out in a game. Instead of going on a thrilling adventure, the duo must first work to pay for their living expenses. Indeed, their misfortunes have only just begun!\n\n[Written by MAL Rewrite]",
    year: 2016,
    start_year: 2016,
    genres: [
      {
        name: "Adventure",
      },
      {
        name: "Comedy",
      },
      {
        name: "Fantasy",
      },
      {
        name: "Isekai",
      },
      {
        name: "Parody",
      },
    ],
  },
  {
    mal_id: 3702,
    image: "https://cdn.myanimelist.net/images/anime/3/9853l.jpg",
    title: "Detroit Metal City",
    type: "OVA",
    episodes: 12,
    status: "Finished Airing",
    score: 8.09,
    rank: 521,
    popularity: 1174,
    synopsis:
      "Dominating the world of indie music, Detroit Metal City (DMC) is a popular death metal band known for its captivatingly dark and crude style. Its extravagant lead singer, Johannes Krauser II, is especially infamous as a demonic being who has risen from the fiery pits of hell itself in order to bring the world to its knees and lord over all mortals—or at least that's what he's publicized to be.\n\nUnbeknownst to his many worshippers, Krauser II is just the alter ego of an average college graduate named Souichi Negishi. Although he is soft-spoken, peace-loving, and would rather listen to Swedish pop all day, he must participate in DMC's garish concerts in order to make ends meet. Detroit Metal City chronicles Negishi's hilarious misadventures as he attempts to juggle his hectic band life, a seemingly budding romance, and dealing with his incredibly obsessive and dedicated fans.\n\n[Written by MAL Rewrite]",
    year: 2008,
    start_year: 2008,
    genres: [
      {
        name: "Comedy",
      },
      {
        name: "Adult Cast",
      },
      {
        name: "Gag Humor",
      },
      {
        name: "Music",
      },
      {
        name: "Parody",
      },
      {
        name: "Showbiz",
      },
    ],
  },
  {
    mal_id: 4224,
    image: "https://cdn.myanimelist.net/images/anime/13/22128l.jpg",
    title: "Toradora!",
    type: "TV",
    episodes: 25,
    status: "Finished Airing",
    score: 8.06,
    rank: 563,
    popularity: 25,
    synopsis:
      'Ryuuji Takasu is a gentle high school student with a love for housework; but in contrast to his kind nature, he has an intimidating face that often gets him labeled as a delinquent. On the other hand is Taiga Aisaka, a small, doll-like student, who is anything but a cute and fragile girl. Equipped with a wooden katana and feisty personality, Taiga is known throughout the school as the "Palmtop Tiger."\n\nOne day, an embarrassing mistake causes the two students to cross paths. Ryuuji discovers that Taiga actually has a sweet side: she has a crush on the popular vice president, Yuusaku Kitamura, who happens to be his best friend. But things only get crazier when Ryuuji reveals that he has a crush on Minori Kushieda—Taiga\'s best friend!\n\nToradora! is a romantic comedy that follows this odd duo as they embark on a quest to help each other with their respective crushes, forming an unlikely alliance in the process.\n\n[Written by MAL Rewrite]',
    year: 2008,
    start_year: 2008,
    genres: [
      {
        name: "Drama",
      },
      {
        name: "Romance",
      },
      {
        name: "Love Polygon",
      },
      {
        name: "School",
      },
    ],
  },
  {
    mal_id: 39535,
    image: "https://cdn.myanimelist.net/images/anime/1530/117776l.jpg",
    title: "Mushoku Tensei: Isekai Ittara Honki Dasu",
    type: "TV",
    episodes: 11,
    status: "Finished Airing",
    score: 8.36,
    rank: 224,
    popularity: 96,
    synopsis:
      "Despite being bullied, scorned, and oppressed all of his life, a 34-year-old shut-in still found the resolve to attempt something heroic—only for it to end in a tragic accident. But in a twist of fate, he awakens in another world as Rudeus Greyrat, starting life again as a baby born to two loving parents.\n\nPreserving his memories and knowledge from his previous life, Rudeus quickly adapts to his new environment. With the mind of a grown adult, he starts to display magical talent that exceeds all expectations, honing his skill with the help of a mage named Roxy Migurdia. Rudeus learns swordplay from his father, Paul, and meets Sylphiette, a girl his age who quickly becomes his closest friend.\n\nAs Rudeus' second chance at life begins, he tries to make the most of his new opportunity while conquering his traumatic past. And perhaps, one day, he may find the one thing he could not find in his old world—love.\n\n[Written by MAL Rewrite]",
    year: 2021,
    start_year: 2021,
    genres: [
      {
        name: "Adventure",
      },
      {
        name: "Drama",
      },
      {
        name: "Fantasy",
      },
      {
        name: "Ecchi",
      },
      {
        name: "Isekai",
      },
      {
        name: "Reincarnation",
      },
    ],
  },
  {
    mal_id: 11577,
    image: "https://cdn.myanimelist.net/images/anime/1611/112806l.jpg",
    title: "Steins;Gate Movie: Fuka Ryouiki no Déjà vu",
    type: "Movie",
    episodes: 1,
    status: "Finished Airing",
    score: 8.45,
    rank: 166,
    popularity: 374,
    synopsis:
      "After a year in America, Kurisu Makise returns to Akihabara and reunites with Rintarou Okabe. However, their reunion is cut short when Okabe begins to experience recurring flashes of other timelines as the consequences of his time traveling start to manifest. These side effects eventually culminate in Okabe suddenly vanishing from the world, and only the startled Kurisu has any memory of his existence.\n\nIn the midst of despair, Kurisu is faced with a truly arduous choice that will test both her duty as a scientist and her loyalty as a friend: follow Okabe's advice and stay away from traveling through time to avoid the potential consequences it may have on the world lines, or ignore it to rescue the person that she cherishes most. Regardless of her decision, the path she chooses is one that will affect the past, the present, and the future.\n\n[Written by MAL Rewrite]",
    year: 2013,
    start_year: 2013,
    genres: [
      {
        name: "Drama",
      },
      {
        name: "Sci-Fi",
      },
    ],
  },
  {
    mal_id: 10162,
    image: "https://cdn.myanimelist.net/images/anime/1460/98853l.jpg",
    title: "Usagi Drop",
    type: "TV",
    episodes: 11,
    status: "Finished Airing",
    year: 2011,
    start_year: 2011,
    score: 8.33,
    rank: 242,
    popularity: 462,
    synopsis:
      "Daikichi Kawachi is a 30-year-old bachelor working a respectable job but otherwise wandering aimlessly through life. When his grandfather suddenly passes away, he returns to the family home to pay his respects. Upon arriving at the house, he meets a mysterious young girl named Rin who, to Daikichi's astonishment, is his grandfather's illegitimate daughter!\n \nThe shy and unapproachable girl is deemed an embarrassment to the family, and finds herself ostracized by her father's relatives, all of them refusing to take care of her in the wake of his death. Daikichi, angered by their coldness toward Rin, announces that he will take her in—despite the fact that he is a young, single man with no prior childcare experience.\n\nUsagi Drop is the story of Daikichi's journey through fatherhood as he raises Rin with his gentle and affectionate nature, as well as an exploration of the warmth and interdependence that are at the heart of a happy, close-knit family.\n\n[Written by MAL Rewrite]",
    genres: [
      {
        name: "Slice of Life",
      },
    ],
  },
  {
    mal_id: 11111,
    image: "https://cdn.myanimelist.net/images/anime/4/75509l.jpg",
    title: "Another",
    type: "TV",
    episodes: 12,
    status: "Finished Airing",
    year: 2012,
    start_year: 2012,
    score: 7.47,
    rank: 2007,
    popularity: 59,
    synopsis:
      "In class 3-3 of Yomiyama North Junior High, transfer student Kouichi Sakakibara makes his return after taking a sick leave for the first month of school. Among his new classmates, he is inexplicably drawn toward Mei Misaki—a reserved girl with an eyepatch whom he met in the hospital during his absence. But none of his classmates acknowledge her existence; they warn him not to acquaint himself with things that do not exist. Against their words of caution, Kouichi befriends Mei—soon learning of the sinister truth behind his friends' apprehension.\n\nThe ominous rumors revolve around a former student of the class 3-3. However, no one will share the full details of the grim event with Kouichi. Engrossed in the curse that plagues his class, Kouichi sets out to discover its connection to his new friend. As a series of tragedies arise around them, it is now up to Kouichi, Mei, and their classmates to unravel the eerie mystery—but doing so will come at a hefty price.\n\n[Written by MAL Rewrite]",
    genres: [
      {
        name: "Horror",
      },
      {
        name: "Mystery",
      },
      {
        name: "Gore",
      },
      {
        name: "School",
      },
    ],
  },
  {
    mal_id: 13759,
    image: "https://cdn.myanimelist.net/images/anime/4/43643l.jpg",
    title: "Sakura-sou no Pet na Kanojo",
    type: "TV",
    episodes: 24,
    status: "Finished Airing",
    score: 8.06,
    rank: 579,
    popularity: 108,
    synopsis:
      "At Suimei High, the Sakura-sou dormitory is infamous for housing the school's most notorious delinquents. Thus, when the relatively tame Sorata Kanda is transferred to the dorm, escaping this insane asylum becomes his foremost goal. Trapped there for the time being, he must learn how to deal with his fellow residents, including bubbly animator Misaki Kamiigusa, charming playboy writer Jin Mitaka, and the ever-reclusive Ryuunosuke Akasaka. Surrounded by weirdness, Sorata frequently finds respite in his interactions with his one \"normal\" friend, aspiring voice actress Nanami Aoyama.\n\nWhen Mashiro Shiina—a new foreign exchange student—joins the dormitory, Sorata is instantly enraptured by her beauty. Underneath her otherworldly appearance, Mashiro is an autistic savant, capable of world-renowned brilliance in her art, yet unable to perform simple daily tasks. After Sorata ends up in charge of taking care of Mashiro, the two inevitably grow closer, with Sorata's initial desire to escape the dormitory becoming a forgotten goal.\n\nDespite their eccentricities, every resident is incredible in their own field, leaving Sorata to contend with his own lack of any particular skill. With brilliance all around him, he thus strives to become an equal to their talent. Revolving around the hardships and joys of its colorful cast, Sakura-sou no Pet na Kanojo is a heartwarming coming-of-age tale of friendship, love, ambition, and heartbreak—through the lens of an ordinary person surrounded by the extraordinary.\n\n[Written by MAL Rewrite]",
    year: 2012,
    start_year: 2012,
    genres: [
      {
        name: "Drama",
      },
      {
        name: "Romance",
      },
      {
        name: "School",
      },
      {
        name: "Visual Arts",
      },
    ],
  },
  {
    mal_id: 30,
    image: "https://cdn.myanimelist.net/images/anime/1314/108941l.jpg",
    title: "Shinseiki Evangelion",
    type: "TV",
    episodes: 26,
    status: "Finished Airing",
    score: 8.35,
    rank: 231,
    popularity: 45,
    synopsis:
      "Fifteen years after a cataclysmic event known as the Second Impact, the world faces a new threat: monstrous celestial beings called Angels invade Tokyo-3 one by one. Mankind is unable to defend themselves against the Angels despite utilizing their most advanced munitions and military tactics. The only hope for human salvation rests in the hands of NERV, a mysterious organization led by the cold Gendou Ikari. NERV operates giant humanoid robots dubbed \"Evangelions\" to combat the Angels with state-of-the-art advanced weaponry and protective barriers known as Absolute Terror Fields.\n\nYears after being abandoned by his father, Shinji Ikari, Gendou's 14-year-old son, returns to Tokyo-3. Shinji undergoes a perpetual internal battle against the deeply buried trauma caused by the loss of his mother and the emotional neglect he suffered at the hands of his father. Terrified to open himself up to another, Shinji's life is forever changed upon meeting 29-year-old Misato Katsuragi, a high-ranking NERV officer who shows him a free-spirited maternal kindness he has never experienced.\n\nA devastating Angel attack forces Shinji into action as Gendou reveals his true motive for inviting his son back to Tokyo-3: Shinji is the only child capable of efficiently piloting Evangelion Unit-01, a new robot that synchronizes with his biometrics. Despite the brutal psychological trauma brought about by piloting an Evangelion, Shinji defends Tokyo-3 against the angelic threat, oblivious to his father's dark machinations.\n\n[Written by MAL Rewrite]",
    year: 1995,
    start_year: 1995,
    genres: [
      {
        name: "Action",
      },
      {
        name: "Avant Garde",
      },
      {
        name: "Award Winning",
      },
      {
        name: "Drama",
      },
      {
        name: "Sci-Fi",
      },
      {
        name: "Suspense",
      },
      {
        name: "Mecha",
      },
      {
        name: "Psychological",
      },
    ],
  },
]

const mangaData: FullMangaFavorite[] = [
  {
    mal_id: 14893,
    image: "https://cdn.myanimelist.net/images/manga/2/279887l.jpg",
    title: "Monogatari Series: First Season",
    type: "Light Novel",
    chapters: 107,
    volumes: 6,
    status: "Finished",
    score: 8.91,
    rank: 19,
    popularity: 276,
    synopsis:
      'This is a story, a "ghostory" of sorts, about scars that bond, monsters that haunt, and fakes that deceive.\n\nThe story of Koyomi Araragi begins through a fateful encounter with the all-powerful, blonde-haired, "hot-blooded, iron-blooded, and cold-blooded" vampire, later introduced as Shinobu Oshino. Their tragic rendezvous results in the end of Araragi\'s life as a human and his subsequent rebirth as a vampire—a monster. However, this encounter is only the start of his meddlings with the supernatural. Koyomi\'s noble personality ultimately sees him getting further involved in the lives of others with supernatural afflictions. This is his desperate attempt at returning to a normal human life, in a paranormal world filled with nothing but tragedy, suffering, and inhumanity.\n\n[Written by MAL Rewrite]\n\nThis entry includes the first season of the Monogatari Series.',
    genres: [
      {
        name: "Action",
      },
      {
        name: "Comedy",
      },
      {
        name: "Mystery",
      },
      {
        name: "Romance",
      },
      {
        name: "Supernatural",
      },
      {
        name: "Vampire",
      },
    ],
    year: 2006,
    start_year: 2006,
  },
  {
    mal_id: 28533,
    image: "https://cdn.myanimelist.net/images/manga/5/63521l.jpg",
    title: "Watashi ga Motenai no wa Dou Kangaetemo Omaera ga Warui!",
    type: "Manga",
    chapters: null,
    volumes: null,
    status: "Publishing",
    score: 7.73,
    rank: 1585,
    popularity: 297,
    synopsis:
      "Tomoko Kuroki is not cool. She is unattractive, socially awkward, and spends most of her evenings playing video games. Even so, no one wants popularity as desperately as she does. With one ingenious idea after another, Tomoko comes ever closer to achieving her goal—or so she thinks. Utilizing such innovative methods as imitating popular anime personas and buying expensive panties, she claws her way toward attaining the social status of her dreams.\n\nPathetically hilarious and strangely charming, Watashi ga Motenai no wa Dou Kangaetemo Omaera ga Warui! depicts Tomoko's daily struggles with social anxiety in a lighthearted and relatable way.\n\n[Written by MAL Rewrite]",
    genres: [
      {
        name: "Comedy",
      },
      {
        name: "Otaku Culture",
      },
      {
        name: "School",
      },
    ],
    year: 2011,
    start_year: 2011,
  },
  {
    mal_id: 7149,
    image: "https://cdn.myanimelist.net/images/manga/1/148447l.jpg",
    title: "Toradora!",
    type: "Light Novel",
    chapters: 62,
    volumes: 10,
    status: "Finished",
    score: 8.21,
    rank: 409,
    popularity: 665,
    synopsis:
      "Takasu Ryuuji might look like a thug, but he's actually a nice guy. Making friends when you've got an unintentionally scary face is tough—and don't even get him started on girlfriends. But with his secret crush in his class, the start of his second year of high school is off to a good start...until he crosses paths with Aisaka Taiga. Beautiful, frightening, and not quite five feet tall, the girl known as the Palmtop Tiger is the one person in school even scarier than Ryuuji himself—and he's just made the mistake of making her very, very angry.\n\n(Source: Seven Seas Entertainment)",
    genres: [
      {
        name: "Drama",
      },
      {
        name: "Romance",
      },
      {
        name: "Love Polygon",
      },
      {
        name: "School",
      },
    ],
    year: 2006,
    start_year: 2006,
  },
  {
    mal_id: 102997,
    image: "https://cdn.myanimelist.net/images/manga/1/189746l.jpg",
    title: "Saotome Senshu, Hitakakusu",
    type: "Manga",
    chapters: 124,
    volumes: 10,
    status: "Finished",
    score: 7.48,
    rank: 3094,
    popularity: 631,
    synopsis:
      "Satoru Tsukishima has just been confessed to by fellow high school boxing club member Yae Saotome, who is currently the Kanto region's Female Featherweight Champion. Overjoyed at first, Satoru isn't able to accept her feelings as he believes that she should be focusing on boxing instead. Yae's championship will soon be on the line, and the entire school is counting on her to someday represent Tokyo in the Olympics. It also doesn't help that he's nowhere near as skilled as she is, conflicted by the thought of a rising star being in a relationship with someone as average as him.\n\nBut when their coach finds out about the confession, Satoru is assigned as Yae's trainer so the two can secretly date and spend more time together while also engaging in club activities. However, if anyone finds out about the two, it will mean the end of their relationship. With this in mind, their pure and awkward romance begins!\n\n[Written by MAL Rewrite]",
    genres: [
      {
        name: "Comedy",
      },
      {
        name: "Romance",
      },
      {
        name: "Sports",
      },
      {
        name: "Combat Sports",
      },
      {
        name: "School",
      },
    ],
    year: 2016,
    start_year: 2016,
  },
  {
    mal_id: 31,
    image: "https://cdn.myanimelist.net/images/manga/1/209659l.jpg",
    title: "Lovely★Complex",
    type: "Manga",
    chapters: 68,
    volumes: 17,
    status: "Finished",
    score: 8.32,
    rank: 285,
    popularity: 254,
    synopsis:
      "When the taller than average 172 cm Risa Koizumi learns that her occasional nemesis, the shorter than average 156 cm Atsushi Ootani, is romantically interested in her friend, she decides to team up with him. After all, she also has feelings for his friend. Unluckily, however, their respective crushes fall for each other instead. Determined to find new love after their recent misfortunes, the pair decide to cheer each other on while maintaining their usual dynamic of constant bickering. \n\nAlthough they continually deny it, Risa and Ootani are more similar than they like to admit: they both have unusual heights, failing grades, identical tastes in food, and a tendency to act extremely childish. Together, they inspire laughter among their peers as a so-called comedic duo. Could the love that these two are looking for be closer than they think?\n\n[Written by MAL Rewrite]\n\n\nIncluded one-shots:\nVolume 12: Hoshi ni Nattemo Aishiteru\nVolume 16: Bokura no Ibasho",
    genres: [
      {
        name: "Award Winning",
      },
      {
        name: "Comedy",
      },
      {
        name: "Drama",
      },
      {
        name: "Romance",
      },
      {
        name: "School",
      },
    ],
    year: 2001,
    start_year: 2001,
  },
  {
    mal_id: 109339,
    image: "https://cdn.myanimelist.net/images/manga/2/208057l.jpg",
    title: "Saihate no Paladin",
    type: "Manga",
    chapters: null,
    volumes: null,
    status: "Publishing",
    score: 7.8,
    rank: 1293,
    popularity: 611,
    synopsis:
      "William is the lone human in a city of the dead. Born with vague memories of a past life in contemporary Japan where he failed to do anything useful, he is determined not to make the same mistake again, and that this time, his life will be lived. But what does that really mean? Raised by a group of the undead, William must discover what circumstances brought him to this city and these people as well as what it means to not just exist, but to live a full life.\n\n(Source: ANN)",
    genres: [
      {
        name: "Action",
      },
      {
        name: "Adventure",
      },
      {
        name: "Fantasy",
      },
      {
        name: "Isekai",
      },
      {
        name: "Reincarnation",
      },
    ],
    year: 2017,
    start_year: 2017,
  },
  {
    mal_id: 113010,
    image: "https://cdn.myanimelist.net/images/manga/2/210355l.jpg",
    title: "Bakemonogatari",
    type: "Manga",
    chapters: 193,
    volumes: 22,
    status: "Finished",
    score: 8.49,
    rank: 153,
    popularity: 462,
    synopsis:
      "Koyomi Araragi is no stranger to the abnormal. During the spring break of his third year in high school, a fateful encounter with vampire Kiss-Shot Acerola-Orion Heart-Under-Blade turns him into a vampire himself. Thrust into the world of oddities, Araragi finds himself catching classmate Hitagi Senjougahara when she falls down the school stairs one day—but something is amiss. After being confronted by the girl in question, Araragi learns that her weight was stolen by a mythical crab. In spite of Senjougahara's blunt threats, he manages to convince her to let him help. In need of a solution to an abnormal problem, the two visit the mysterious Meme Oshino, a wanderer who saved Araragi from his vampirism.\n\nBakemonogatari is a tale about the monsters that reside within everyone, but just how deep do they dwell in the people Araragi meets?\n\n[Written by MAL Rewrite]",
    genres: [
      {
        name: "Action",
      },
      {
        name: "Comedy",
      },
      {
        name: "Drama",
      },
      {
        name: "Mystery",
      },
      {
        name: "Romance",
      },
      {
        name: "Supernatural",
      },
      {
        name: "Vampire",
      },
    ],
    year: 2018,
    start_year: 2018,
  },
  {
    mal_id: 37707,
    image: "https://cdn.myanimelist.net/images/manga/3/102691l.jpg",
    title: "Shigatsu wa Kimi no Uso",
    type: "Manga",
    chapters: 44,
    volumes: 11,
    status: "Finished",
    score: 8.59,
    rank: 99,
    popularity: 192,
    synopsis:
      'At a very young age, Kousei Arima was strictly taught how to play the piano and meticulously follow the score by his mother, to the point where he dominated every competition he entered with ease. He earned the title of "Human Metronome" for performing almost perfectly. Every musician of his age looked up to him. However, after his mother suddenly dies, he became tone-deaf due to the shock and then disappeared, never to be seen onstage since.\n\nTwo years later, Kousei lives a monotonous life with his childhood friends Tsubaki Sawabe and Ryouta Watari supporting him. He continues to cling to music, although performing is still an impossibility for him. This is until his unexpected encounter with Kaori Miyazono, a violinist who performs freely without the dictations of a score. A story of friendship, love, music, and a single lie, Kousei\'s life begins to change and gain color as Kaori helps him to take up music again.\n\n[Written by MAL Rewrite]',
    genres: [
      {
        name: "Award Winning",
      },
      {
        name: "Drama",
      },
      {
        name: "Romance",
      },
      {
        name: "Music",
      },
      {
        name: "School",
      },
    ],
    year: 2011,
    start_year: 2011,
  },
  {
    mal_id: 419,
    image: "https://cdn.myanimelist.net/images/manga/2/153962l.jpg",
    title: "Nodame Cantabile",
    type: "Manga",
    chapters: 150,
    volumes: 25,
    status: "Finished",
    score: 8.4,
    rank: 213,
    popularity: 661,
    synopsis:
      'Shinichi Chiaki, the perfectionist son of a famous pianist, is in his fourth year at Momogaoka College of Music, hoping to achieve his secret dream of being a conductor. His admiration for his father led him to pursue a career in music. As much as he wants to return to Europe, his phobia of flying traps him in Japan where he now lives.\n\nOne night, he passes out, and ends up being taken in by Megumi "Nodame" Noda. Upon first glance, Nodame is a talented pianist, but she is also slobbish and eccentric. What\'s even worse is that she is his neighbor and he ends up forced to work with her. Though it sounds like a recipe for disaster, Chiaki is drawn to this girl who makes him remember the love for music he once held. Just what does the future hold for this musical duo?\n\n[Written by MAL Rewrite]',
    genres: [
      {
        name: "Award Winning",
      },
      {
        name: "Comedy",
      },
      {
        name: "Romance",
      },
      {
        name: "Slice of Life",
      },
      {
        name: "Adult Cast",
      },
      {
        name: "Music",
      },
    ],
    year: 2001,
    start_year: 2001,
  },
  {
    mal_id: 21,
    image: "https://cdn.myanimelist.net/images/manga/1/258245l.jpg",
    title: "Death Note",
    type: "Manga",
    chapters: 108,
    volumes: 12,
    status: "Finished",
    score: 8.69,
    rank: 60,
    popularity: 13,
    synopsis:
      'Ryuk, a god of death, drops his Death Note into the human world for personal pleasure. In Japan, prodigious high school student Light Yagami stumbles upon it. Inside the notebook, he finds a chilling message: those whose names are written in it shall die. Its nonsensical nature amuses Light; but when he tests its power by writing the name of a criminal in it, they suddenly meet their demise.\n\nRealizing the Death Note\'s vast potential, Light commences a series of nefarious murders under the pseudonym "Kira," vowing to cleanse the world of corrupt individuals and create a perfect society where crime ceases to exist. However, the police quickly catch on, and they enlist the help of L—a mastermind detective—to uncover the culprit.\n\nDeath Note tells the thrilling tale of Light and L as they clash in a great battle-of-minds, one that will determine the future of the world.\n\n[Written by MAL Rewrite]',
    genres: [
      {
        name: "Supernatural",
      },
      {
        name: "Suspense",
      },
      {
        name: "Psychological",
      },
    ],
    year: 2003,
    start_year: 2003,
  },
]

const characterData: BasicCharacterFavorite[] = [
  {
    mal_id: 22037,
    image: "https://cdn.myanimelist.net/images/characters/11/287902.jpg?s=559b750212c5338e987b3d0ebac9d810",
    name: "Senjougahara, Hitagi",
  },
  {
    mal_id: 1185,
    image: "https://cdn.myanimelist.net/images/characters/11/92497.jpg?s=f8d450c55e9f47ee9b6cb93c9cb5a098",
    name: "Noda, Megumi",
  },
  {
    mal_id: 12064,
    image: "https://cdn.myanimelist.net/images/characters/11/514086.jpg?s=87920301db499bb344d2efd437699bc4",
    name: "Aisaka, Taiga",
  },
  {
    mal_id: 153859,
    image: "https://cdn.myanimelist.net/images/characters/12/538425.jpg?s=6fcca0ca41d34078b13f35c57dd80804",
    name: "Saotome, Yae",
  },
  {
    mal_id: 50057,
    image: "https://cdn.myanimelist.net/images/characters/15/212635.jpg?s=d3756e5ae6e0e0f03736ba6f464227a2",
    name: "Kuroki, Tomoko",
  },
  {
    mal_id: 22054,
    image: "https://cdn.myanimelist.net/images/characters/11/222449.jpg?s=807b29db48805d06f863451ae8b44d27",
    name: "Kanbaru, Suruga",
  },
  {
    mal_id: 6977,
    image: "https://cdn.myanimelist.net/images/characters/6/120945.jpg?s=b66012c0e8676ef7a444e429ed06e184",
    name: "Kuronuma, Sawako",
  },
  {
    mal_id: 674,
    image: "https://cdn.myanimelist.net/images/characters/2/245933.jpg?s=a256c2fb147ac3e58818f69eb7e9fe8c",
    name: "Kagura",
  },
]

const peopleData: BasicPeopleFavorite[] = [
  {
    mal_id: 2,
    image: "https://cdn.myanimelist.net/images/voiceactors/1/81054.jpg?s=acb8e1dcacacc3d869c36ec876c8c4da",
    name: "Sugita, Tomokazu",
  },
  {
    mal_id: 118,
    image: "https://cdn.myanimelist.net/images/voiceactors/1/66163.jpg?s=cb07743b7325f20adaa7921160f73646",
    name: "Kamiya, Hiroshi",
  },
  {
    mal_id: 7899,
    image: "https://cdn.myanimelist.net/images/voiceactors/1/55656.jpg?s=1aec911b4fc352baf988ed06c83ff3d1",
    name: "Kitta, Izumi",
  },
  {
    mal_id: 99,
    image: "https://cdn.myanimelist.net/images/voiceactors/2/65500.jpg?s=80c733f0aefed4b574d900e2a4a9037e",
    name: "Sawashiro, Miyuki",
  },
  {
    mal_id: 4875,
    image: "https://cdn.myanimelist.net/images/voiceactors/3/60414.jpg?s=23363b3bbe0dbcf21cafbde02441454b",
    name: "Takemiya, Yuyuko",
  },
  {
    mal_id: 1904,
    image: "https://cdn.myanimelist.net/images/voiceactors/1/44890.jpg?s=cf786139b5b5f43206e017497fbaa765",
    name: "Sorachi, Hideaki",
  },
  {
    mal_id: 13,
    image: "https://cdn.myanimelist.net/images/voiceactors/2/69419.jpg?s=19f702c4cf0e2e0b44e125f8bc9511ab",
    name: "Kawasumi, Ayako",
  },
  {
    mal_id: 8,
    image: "https://cdn.myanimelist.net/images/voiceactors/3/63374.jpg?s=afa01c0ce80060bd11daeb6e220679c4",
    name: "Kugimiya, Rie",
  },
  {
    mal_id: 61,
    image: "https://cdn.myanimelist.net/images/voiceactors/3/79603.jpg?s=0fdc6450e4421d1f182b6c6223723df5",
    name: "Saitou, Chiwa",
  },
  {
    mal_id: 5254,
    image: "https://cdn.myanimelist.net/images/voiceactors/2/43583.jpg?s=d5875b3197c6226978d5eeac7a473f2d",
    name: "NISIO, ISIN",
  },
]

export { animeData, characterData, mangaData, peopleData }
