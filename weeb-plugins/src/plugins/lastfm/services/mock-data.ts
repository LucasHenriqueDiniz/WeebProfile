import type { LastFmData, LastFmTrack, LastFmArtist, LastFmAlbum, TopTrack, LastFmFeaturedTrack } from "../types"

function generateMockRecentTracks(count = 50): LastFmTrack[] {
  const baseData: LastFmTrack[] = [
    {
        track: "PPPP (feat. Hatsune Miku, Kasane Teto)",
        artist: "Tak",
        date: "now",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/927a4cb87fe8f154f094708196727b80.png"
    },
    {
        track: "To Hell and Back",
        artist: "Sabaton",
        date: "28 Dec 2025, 20:37",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/332b818df8fe479bc7ba38394add796a.jpg"
    },
    {
        track: "The Last Stand",
        artist: "Sabaton",
        date: "28 Dec 2025, 20:33",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/e2af6cc57603d4cd19aaf72a3486e39f.jpg"
    },
    {
        track: "Under Your Skin",
        artist: "Silent Planet",
        date: "28 Dec 2025, 20:30",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/3473673c629dd75ead29a323f2f3690d.jpg"
    },
    {
        track: "Sacred",
        artist: "Parkway Drive",
        date: "28 Dec 2025, 20:26",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/1bb72dceb819bf19b3718ae0b5d5d752.jpg"
    },
    {
        track: "Let There Be Shred",
        artist: "Megadeth",
        date: "28 Dec 2025, 20:22",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/f595c8c54864c6abc178638dfd6ab967.jpg"
    },
    {
        track: "The End (feat. BABYMETAL) - 2025 VERSION",
        artist: "Five Finger Death Punch",
        date: "28 Dec 2025, 20:16",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/88b8c8d767d6b409428d4920f0e1b04e.jpg"
    },
    {
        track: "from me to u (feat. Poppy) (LIVE FROM THE O2)",
        artist: "BABYMETAL",
        date: "28 Dec 2025, 20:14",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/f87ad8695ec7209ec6bcf9352c243d22.png"
    },
    {
        track: "Albatross",
        artist: "Halou",
        date: "28 Dec 2025, 20:11",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/f5ed7d4370f867edb845e0f3bbdbb504.jpg"
    },
    {
        track: "Alone in the Town",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 20:09",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/4a438d2e1d0ad278ca925877ddd7304a.jpg"
    },
    {
        track: "Green Bird",
        artist: "Gabriela Robin",
        date: "28 Dec 2025, 20:07",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/33c08e0862163ebe4d682ebd14c3dbf0.jpg"
    },
    {
        track: "Tears of...",
        artist: "Avith Ortega",
        date: "28 Dec 2025, 20:04",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/29c7fc3f289767206c2ccdde1c5bdd2d.jpg"
    },
    {
        track: "Wretched Weaponry: Medium/Dynamic",
        artist: "岡部啓一",
        date: "28 Dec 2025, 19:51",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/459e7e4fd2d0b2686b83e53a8d2f01d4.png"
    },
    {
        track: "Broken Eclipse",
        artist: "bellawella",
        date: "28 Dec 2025, 19:47",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/18456985982c3d6026af7d4b564e1f2a.jpg"
    },
    {
        track: "Letter - from the Lost Days",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 19:43",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/b43eab48c61f5f3c51307dd14af7e0e8.jpg"
    },
    {
        track: "Thorofare Hike",
        artist: "Chris Remo",
        date: "28 Dec 2025, 19:41",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/ebcac08c7a95d8154695b39d1a45ea24.jpg"
    },
    {
        track: "Halo of the Sun",
        artist: "Avith Ortega",
        date: "28 Dec 2025, 19:38",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/29c7fc3f289767206c2ccdde1c5bdd2d.jpg"
    },
    {
        track: "Voice of no Return - Guitar",
        artist: "岡部啓一",
        date: "28 Dec 2025, 19:34",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/459e7e4fd2d0b2686b83e53a8d2f01d4.png"
    },
    {
        track: "Die Toteninsel (Shooting Stars)",
        artist: "1000 Eyes",
        date: "28 Dec 2025, 19:28",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/1c232dacc4df0d713abc72bdd2be9a42.png"
    },
    {
        track: "True",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 19:24",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/4a438d2e1d0ad278ca925877ddd7304a.jpg"
    },
    {
        track: "Hometown",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 15:29",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/b43eab48c61f5f3c51307dd14af7e0e8.jpg"
    },
    {
        track: "Waiting For You ～Live AT \"Heaven's Night\"～(Unreleased Tunes)",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 15:25",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/14b1e4205aaa9e8f742d1e5c9eb45c3f.jpg"
    },
    {
        track: "I Want Love (Studio Mix)",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 15:20",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/b43eab48c61f5f3c51307dd14af7e0e8.jpg"
    },
    {
        track: "Overdose Delusion",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 15:16",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/4a438d2e1d0ad278ca925877ddd7304a.jpg"
    },
    {
        track: "Silent Scream",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 15:10",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/d1d54e0c81cf4d03ac200b0e27225ae9.png"
    },
    {
        track: "Promise",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 15:05",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/4a438d2e1d0ad278ca925877ddd7304a.jpg"
    },
    {
        track: "Cradel of Forest",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 14:59",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/14b1e4205aaa9e8f742d1e5c9eb45c3f.jpg"
    },
    {
        track: "Theme of Laura",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 14:56",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/4a438d2e1d0ad278ca925877ddd7304a.jpg"
    },
    {
        track: "One More Soul to the Call (From \"Silent Hill Homecoming\") - Live Cover",
        artist: "Iris ~Pamela Calvo~",
        date: "28 Dec 2025, 14:50",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    },
    {
        track: "Tender Sugar",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 14:44",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/14b1e4205aaa9e8f742d1e5c9eb45c3f.jpg"
    },
    {
        track: "Love Psalm",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 14:40",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/4a438d2e1d0ad278ca925877ddd7304a.jpg"
    },
    {
        track: "Your Rain",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 14:35",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/14b1e4205aaa9e8f742d1e5c9eb45c3f.jpg"
    },
    {
        track: "You're Not Here",
        artist: "Akira Yamaoka",
        date: "28 Dec 2025, 14:31",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/b43eab48c61f5f3c51307dd14af7e0e8.jpg"
    },
    {
        track: "I've Been Losing You",
        artist: "Avith Ortega",
        date: "28 Dec 2025, 14:08",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/29c7fc3f289767206c2ccdde1c5bdd2d.jpg"
    },
    {
        track: "Le festin",
        artist: "Camille",
        date: "28 Dec 2025, 14:06",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/5a6368348d88b92c4fe17fddabf3d1e8.jpg"
    },
    {
        track: "Special Order",
        artist: "Michael Giacchino",
        date: "28 Dec 2025, 14:04",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/5a6368348d88b92c4fe17fddabf3d1e8.jpg"
    },
    {
        track: "Bella Toscana",
        artist: "Wayne Jones",
        date: "28 Dec 2025, 13:59",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    },
    {
        track: "C'est si bon",
        artist: "Aoi Teshima",
        date: "28 Dec 2025, 13:58",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/1556632270b973b5f9bffdf5268149d3.jpg"
    },
    {
        track: "The Merry Go Round of Life",
        artist: "Kazumi Tateishi Trio",
        date: "28 Dec 2025, 13:53",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/5c27d0ab28ba55c6dcb940316ba9e1bb.jpg"
    },
    {
        track: "Losing Control",
        artist: "Michael Giacchino",
        date: "28 Dec 2025, 13:51",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/5a6368348d88b92c4fe17fddabf3d1e8.jpg"
    },
    {
        track: "BALLAD DU PARIS",
        artist: "FRANCOIS PARISI",
        date: "28 Dec 2025, 13:48",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/c709b53eed21bb6b6cbde4200cac2dcd.jpg"
    },
    {
        track: "Wonderthing",
        artist: "Chikoi The Maid",
        date: "28 Dec 2025, 13:40",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/e6f13aa597066decca6747d2cb1d1c08.jpg"
    },
    {
        track: "Hatred",
        artist: "Dysmn",
        date: "28 Dec 2025, 13:36",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    },
    {
        track: "Oyasame(?)",
        artist: "Pathcel Tarts",
        date: "28 Dec 2025, 13:20",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/a20382a24bbb07e15dc06d60ff17c906.jpg"
    },
    {
        track: "Decayed hope",
        artist: "Melody xee",
        date: "28 Dec 2025, 13:17",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/ae053edcda0f2bdfc50a5449c0b41ba4.png"
    },
    {
        track: "repeat",
        artist: "kiyosumi",
        date: "28 Dec 2025, 13:15",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/5d356836fb8a6fbab292a3523d3cff0c.jpg"
    },
    {
        track: "The Third Sanctuary",
        artist: "Duv",
        date: "28 Dec 2025, 13:00",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    },
    {
        track: "stargazing",
        artist: "AZALI",
        date: "28 Dec 2025, 12:56",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/a9a73bd1de88aaa007d1892eeaacae98.jpg"
    },
    {
        track: "Edict",
        artist: "Chikoi The Maid",
        date: "28 Dec 2025, 12:51",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/e6f13aa597066decca6747d2cb1d1c08.jpg"
    },
    {
        track: "I Swear I'm Normal",
        artist: "Dysmn",
        date: "28 Dec 2025, 12:49",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/8c042f45d3608181260d8bad2e6354d2.jpg"
    },
    {
        track: "Carry On",
        artist: "Peppsen",
        date: "26 Dec 2025, 19:02",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/c1c3b2d436418634727ec1485680c61f.jpg"
    }
]
  return baseData.slice(0, count)
}

function generateMockTopArtists(count = 10): LastFmArtist[] {
  const baseData: LastFmArtist[] = [
    {
        artist: "Seycara Orchestral",
        totalPlays: "208",
        image: "https://i.scdn.co/image/ab6761610000e5ebb75e82756973a7f55d189b8c"
    },
    {
        artist: "Chikoi The Maid",
        totalPlays: "167",
        image: "https://i.scdn.co/image/ab67616d0000b273dcb6f50b9001e9cde95dc136"
    },
    {
        artist: "Campfire Stalker",
        totalPlays: "151",
        image: "https://i.scdn.co/image/ab67616d0000b27341dd74d166a618d27e1f28cf"
    },
    {
        artist: "Peppsen",
        totalPlays: "75",
        image: "https://i.scdn.co/image/ab6761610000e5ebd065875a5944c9057d334f87"
    },
    {
        artist: "Steve Jablonsky",
        totalPlays: "60",
        image: "https://i.scdn.co/image/c65979ab9c8924cd836b77331cf8afa4463f51eb"
    },
    {
        artist: "Exhibit",
        totalPlays: "55",
        image: "https://i.scdn.co/image/ab6761610000e5eb0012f2f21cc83c6e55c9cc46"
    },
    {
        artist: "i don't like mirrors",
        totalPlays: "53",
        image: ""
    },
    {
        artist: "Akmigone",
        totalPlays: "46",
        image: "https://i.scdn.co/image/ab6761610000e5eb9044fca895d71afda01437a7"
    },
    {
        artist: "Avith Ortega",
        totalPlays: "44",
        image: "https://i.scdn.co/image/ab6761610000e5eb0cdf7ffefdaff8a6479fad9c"
    },
    {
        artist: "Vagabond",
        totalPlays: "39",
        image: "https://i.scdn.co/image/ab6761610000e5eb11e048f220d44a59d7ca9273"
    },
    {
        artist: "Akira Yamaoka",
        totalPlays: "35",
        image: "https://i.scdn.co/image/ab67616d0000b27330f7a8628bd1b67c0ee5c817"
    },
    {
        artist: "Dysmn",
        totalPlays: "29",
        image: "https://i.scdn.co/image/ab6761610000e5eb8be6399d47aa047c581f36d6"
    },
    {
        artist: "Five Finger Death Punch",
        totalPlays: "29",
        image: "https://i.scdn.co/image/ab6761610000e5eb1e7f796a17c2dc3c28bdeeb9"
    },
    {
        artist: "too unbothered.",
        totalPlays: "29",
        image: "https://i.scdn.co/image/ab6761610000e5ebf44917cf83bde899128ad430"
    },
    {
        artist: "Paweł Błaszczak",
        totalPlays: "27",
        image: "https://i.scdn.co/image/ab6761610000e5eb8e1b40a5be232934a750a493"
    },
    {
        artist: "Jonathan Geer",
        totalPlays: "22",
        image: "https://i.scdn.co/image/ab67616d0000b2732b5a03a119167450c4a5c9c8"
    },
    {
        artist: "George Strezov",
        totalPlays: "19",
        image: "https://i.scdn.co/image/ab6761610000e5eb13808eed3c523d0f7d8cfcbd"
    },
    {
        artist: "Sungiovese",
        totalPlays: "19",
        image: "https://i.scdn.co/image/ab6761610000e5ebb507f87bdbc2b38ccd065e45"
    },
    {
        artist: "SWIK",
        totalPlays: "19",
        image: "https://i.scdn.co/image/ab6761610000e5eb15f7375b2d63d9b33976ad9b"
    },
    {
        artist: "Eleftherios",
        totalPlays: "18",
        image: "https://i.scdn.co/image/ab6761610000e5eb22819b5104b82782f64b948e"
    },
    {
        artist: "Capcom Sound Team",
        totalPlays: "17",
        image: "https://i.scdn.co/image/ab67616d0000b273a2949f7d85e88b5f4de66f04"
    },
    {
        artist: "ISQ",
        totalPlays: "17",
        image: "https://i.scdn.co/image/ab6761610000e5ebc949e40a4045ed1dec4b239b"
    },
    {
        artist: "Hallowed",
        totalPlays: "16",
        image: "https://i.scdn.co/image/ab6761610000e5eb7dcd7c2d30d8003f4f9a709c"
    },
    {
        artist: "Kichi",
        totalPlays: "16",
        image: "https://i.scdn.co/image/ab6761610000e5eb114dcd4810052c54a77f7f51"
    },
    {
        artist: "Federico Dubbini",
        totalPlays: "15",
        image: "https://i.scdn.co/image/ab6761610000e5eb0acb26a7d093c68cf192d9c7"
    },
    {
        artist: "Gustavo Santaolalla",
        totalPlays: "15",
        image: "https://i.scdn.co/image/ab6761610000e5eb074781eba0a9c008945cde18"
    },
    {
        artist: "Michael Giacchino",
        totalPlays: "15",
        image: "https://i.scdn.co/image/ab6761610000e5eb9945209ac13720afd7eea2e3"
    },
    {
        artist: "Mili",
        totalPlays: "15",
        image: "https://i.scdn.co/image/ab6761610000e5eb26c5c8d56a8979c644f37de7"
    },
    {
        artist: "oxinym",
        totalPlays: "15",
        image: "https://i.scdn.co/image/ab6761610000e5eb5d0ca619b7fbfafe82bc227e"
    },
    {
        artist: "BLESSED MANE",
        totalPlays: "14",
        image: "https://i.scdn.co/image/ab6761610000e5eb4041b318a10ace5d0c56229a"
    },
    {
        artist: "ConcernedApe",
        totalPlays: "14",
        image: "https://i.scdn.co/image/ab6761610000e5ebe17351c781f0cd9ae4b6442e"
    },
    {
        artist: "drackfreeee",
        totalPlays: "14",
        image: "https://i.scdn.co/image/ab6761610000e5eb5e402a309424f1b6a455d262"
    },
    {
        artist: "Fade to Black",
        totalPlays: "14",
        image: "https://i.scdn.co/image/ab6761610000e5eb789dc6a11b0e44a8d164f3a1"
    },
    {
        artist: "Ramón de Smit",
        totalPlays: "14",
        image: "https://i.scdn.co/image/ab6761610000e5eb78ec3fc2965ba2fa3916728a"
    },
    {
        artist: "SLXUGHTER",
        totalPlays: "14",
        image: "https://i.scdn.co/image/ab6761610000e5eb9031c826e43e0d2702e496cd"
    },
    {
        artist: "Christopher Larkin",
        totalPlays: "13",
        image: "https://i.scdn.co/image/ab6761610000e5eb22c3ebc48fc86c3bfdc47dfe"
    },
    {
        artist: "Eiby",
        totalPlays: "13",
        image: "https://i.scdn.co/image/ab6761610000e5eb7f9982583996e70a37eb9beb"
    },
    {
        artist: "AZALI",
        totalPlays: "12",
        image: "https://i.scdn.co/image/ab6761610000e5eb75c119f5749fa65e2d2589b9"
    },
    {
        artist: "Jay Tholen",
        totalPlays: "12",
        image: "https://i.scdn.co/image/ab6761610000e5eb460627e98539b2d207a1daed"
    },
    {
        artist: "Jesper Kyd",
        totalPlays: "12",
        image: "https://i.scdn.co/image/ab6761610000e5ebcde68a261f933f4f5d8be288"
    },
    {
        artist: "Ludwig van Beethoven",
        totalPlays: "12",
        image: "https://i.scdn.co/image/ab6761610000e5eba636b0b244253f602a629796"
    },
    {
        artist: "ogryzek",
        totalPlays: "12",
        image: "https://i.scdn.co/image/ab6761610000e5ebf5083570c3167efac89e6713"
    },
    {
        artist: "Nowt",
        totalPlays: "11",
        image: "https://i.scdn.co/image/ab67616d0000b273bcfb1f5b1204d8b028115839"
    },
    {
        artist: "1000 Eyes",
        totalPlays: "10",
        image: "https://i.scdn.co/image/ab6761610000e5eb36658bd668105ee45eaf56c4"
    },
    {
        artist: "Jagex Audio Team",
        totalPlays: "10",
        image: "https://i.scdn.co/image/ab67616d0000b2735be11fd85e00e21b0d13b97b"
    },
    {
        artist: "Lena Raine",
        totalPlays: "10",
        image: "https://i.scdn.co/image/ab6761610000e5eb1d57e92e8f3fa62e756f9303"
    },
    {
        artist: "Sayfalse",
        totalPlays: "10",
        image: "https://i.scdn.co/image/ab6761610000e5ebff21d1e99bd2b43cb6107352"
    },
    {
        artist: "SCYTHERMANE",
        totalPlays: "10",
        image: "https://i.scdn.co/image/ab6761610000e5eb78c7eac7f83aef818f78356c"
    },
    {
        artist: "Hikari",
        totalPlays: "9",
        image: "https://i.scdn.co/image/ab6761610000e5eb1033010ed4980d57f90f8c7c"
    },
    {
        artist: "lappy",
        totalPlays: "9",
        image: "https://i.scdn.co/image/ab6761610000e5ebeda6b40e1ee2413b73ceaa91"
    }
]
  return baseData.slice(0, count)
}

function generateMockTopAlbums(count = 10): LastFmAlbum[] {
  const baseData: LastFmAlbum[] = [
    {
        album: "The Sims 3 (Original Soundtrack)",
        artist: "Steve Jablonsky",
        plays: "400",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/a4f3d74fb84f4e0bdfc0068021ea0014.jpg"
    },
    {
        album: "Hypnospace Outlaw Original Soundtrack, Vol. 2",
        artist: "Jay Tholen",
        plays: "360",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/f602427c173db819e86a1a7c20ca39c9.jpg"
    },
    {
        album: "Persona 3 Reload Original Soundtrack",
        artist: "アトラスサウンドチーム",
        plays: "291",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/c43cd58536fb7ea786064d57be1b9600.jpg"
    },
    {
        album: "SILENT HILL2 （Original Soundtrack）",
        artist: "Akira Yamaoka",
        plays: "248",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/4a438d2e1d0ad278ca925877ddd7304a.jpg"
    },
    {
        album: "Stardew Valley (Original Game Soundtrack)",
        artist: "ConcernedApe",
        plays: "203",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/5a03c265c98fc5769046f09c43c0e8f7.png"
    },
    {
        album: "the forest piano",
        artist: "Vários intérpretes",
        plays: "151",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/6cd0e3c7cb926c850fae5f7ad2412edb.png"
    },
    {
        album: "Inscryption (Original Soundtrack)",
        artist: "Jonah Senzel",
        plays: "150",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/0e34f74d0efaa179906014f35517cbf2.jpg"
    },
    {
        album: "Hypnospace Outlaw Original Soundtrack, Vol. 1",
        artist: "Jay Tholen",
        plays: "139",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/2d56a92db8f197bd1991abed73245416.jpg"
    },
    {
        album: "Silent Hill (The Headphones 2)",
        artist: "Avith Ortega",
        plays: "133",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/29c7fc3f289767206c2ccdde1c5bdd2d.jpg"
    },
    {
        album: "Alice in Paris!",
        artist: "Seycara Orchestral",
        plays: "133",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/8ec5a096eaa3905057af190b08a6e927.jpg"
    },
    {
        album: "Kingdom Come: Deliverance (Original Soundtrack Essentials)",
        artist: "Jan Valta",
        plays: "129",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/2b15fc6fd3745cbf23ebf1be4cedab7c.jpg"
    },
    {
        album: "Shining Song Starnova (Music from the Original Anime \"Shining Song Starnova\")",
        artist: "Seycara Orchestral",
        plays: "128",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/d4205181478a5c05dd74f362d60b30ee.jpg"
    },
    {
        album: "Illusions of the Heart",
        artist: "Seycara Orchestral",
        plays: "113",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/626a2e41d87d3d2da6bd5cf63e6195b4.jpg"
    },
    {
        album: "Everlasting Summer",
        artist: "Seycara Orchestral",
        plays: "111",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/c245b7027d87a5a97e1c7192a6c6c600.jpg"
    },
    {
        album: "RuneScape: (Original Soundtrack Classics)",
        artist: "Jagex Audio Team",
        plays: "103",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/574cb2c5e28f29835a61d8247ac2296f.jpg"
    },
    {
        album: "Keyword (Original Game Soundtrack)",
        artist: "Seycara Orchestral",
        plays: "99",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/3ba7e88de291e88b2967e2931f42667d.jpg"
    },
    {
        album: "Portal 2: Songs to Test By (Original Game Soundtrack) [Collectors Edition]",
        artist: "Aperture Science Psychoacoustic Laboratories",
        plays: "98",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/1b2c69b6898585b9a615ed1c1cb1c7e9.jpg"
    },
    {
        album: "Lost in Vivo (Original Game Soundtrack)",
        artist: "Akuma Kira",
        plays: "90",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/438520a1a4bd8aea67a5efbb6951b2b8.jpg"
    },
    {
        album: "From The Past to The Future",
        artist: "Chikoi The Maid",
        plays: "88",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/e6f13aa597066decca6747d2cb1d1c08.jpg"
    },
    {
        album: "L.A. Noire Official Soundtrack",
        artist: "Vários intérpretes",
        plays: "86",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/5bcac12ea5e131c146cac0bb546e0ee5.jpg"
    },
    {
        album: "Mother 4 Soundtraaaack!! (Original Video Game Soundtrack)",
        artist: "shane mesa",
        plays: "82",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/a04fbfa7de8719df9ac7fcdfa9a0c4c0.jpg"
    },
    {
        album: "for when you're just staring at the ceiling",
        artist: "Exhibit",
        plays: "80",
        image: ""
    },
    {
        album: "In the Wind",
        artist: "Million Eyes",
        plays: "79",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/2a4d3c5636fcbe93b245a970079fd6fc.png"
    },
    {
        album: "STALKER Original Soundtrack",
        artist: "Campfire Stalker",
        plays: "77",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/8e2be294ef88c74650b78ef0b1c9ebc7.png"
    },
    {
        album: "Echoes of Silent Hill",
        artist: "efise",
        plays: "77",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/67f13ce6255b51f940347e3d29ec08e1.jpg"
    },
    {
        album: "minecraft - volume alpha (nostalgic)",
        artist: "Exhibit",
        plays: "74",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/f317ba7b0fb4a15d461e81cdfa2ff031.jpg"
    },
    {
        album: "Distant Keys",
        artist: "Akmigone",
        plays: "73",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/7525c6420ee8063db2168b102802e79d.png"
    },
    {
        album: "Rad Trad",
        artist: "Hallowed",
        plays: "73",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/2d4e54a99b64feea3762b1d4af11b9fb.png"
    },
    {
        album: "The Congregation",
        artist: "Leprous",
        plays: "65",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/3e4382394a13a0feb7266986224058bd.jpg"
    },
    {
        album: "Soulmate",
        artist: "SWIK",
        plays: "64",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/d3fdfd50995f495b12758c2a584a2307.jpg"
    },
    {
        album: "PERSONA5 ORIGINAL SOUNDTRACK",
        artist: "アトラスサウンドチーム",
        plays: "62",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/8a661f6b143a73ff2ced3b29f3ba8629.png"
    },
    {
        album: "Core Keeper: Volume 1 (Original Game Soundtrack)",
        artist: "Jonathan Geer",
        plays: "61",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/658863f6194e7654c5e25e7764d348f7.jpg"
    },
    {
        album: "Klangfeld",
        artist: "Ramón de Smit",
        plays: "61",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/9e97af125fea9bc91ad0f57234540c3b.jpg"
    },
    {
        album: "Block by Block",
        artist: "Akmigone",
        plays: "60",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/3b6745c06609e5c633358c5f6a17b000.png"
    },
    {
        album: "NUNCA MUDA?",
        artist: "SCYTHERMANE",
        plays: "60",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/0e644a8d0ba8ef74da53bfcdf08f7c78.jpg"
    },
    {
        album: "Bully (Original Soundtrack)",
        artist: "Shawn Lee",
        plays: "60",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/fb8b7955d49546bf80f38ba8886685ab.jpg"
    },
    {
        album: "kyoto rain",
        artist: "Seycara Orchestral",
        plays: "59",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/55d36496f38205aec64e91c1c396cb78.jpg"
    },
    {
        album: "Silent Hill: The Headphones (Covers)",
        artist: "Avith Ortega",
        plays: "58",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/11e42cea850a97823c0c74ea71cbb6a1.jpg"
    },
    {
        album: "Stray (Original Soundtrack)",
        artist: "Yann van der Cruyssen",
        plays: "58",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/957f7a34b5e384dcdb76f5e1639f96b4.jpg"
    },
    {
        album: "The Sims 3",
        artist: "EA Games Soundtrack",
        plays: "53",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/16aa60ee99f74f0c95f1b6da6af9a466.jpg"
    },
    {
        album: "BEST OF (Volume 2)",
        artist: "Five Finger Death Punch",
        plays: "51",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/88b8c8d767d6b409428d4920f0e1b04e.jpg"
    },
    {
        album: "fragment",
        artist: "SLXUGHTER",
        plays: "51",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/ba4f0a2fd9c1b8a7aa422caa0d04020f.jpg"
    },
    {
        album: "Balatro (Original Game Soundtrack)",
        artist: "LouisF",
        plays: "50",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/b4f86f1473f7ed9d0bad734a4281b928.jpg"
    },
    {
        album: "The Sleepy Piano, Vol. I",
        artist: "Seycara Orchestral",
        plays: "48",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/dac9b1b6b9627eec9087f6f0820a5851.jpg"
    },
    {
        album: "Hollow Knight: Silksong (Original Soundtrack)",
        artist: "Christopher Larkin",
        plays: "47",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/119cd8774637e0c2b1323dc1c7dba9de.jpg"
    },
    {
        album: "The Sims 3: Showtime, Supernatural and Seasons",
        artist: "EA Games Soundtrack",
        plays: "47",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/24460fc4686348f9c8e3310c024341e1.jpg"
    },
    {
        album: "The Chowder Man",
        artist: "Hot Dad",
        plays: "47",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/ab4b339e16b8b5dfb2503f637ba40f45.jpg"
    },
    {
        album: "Classical Current",
        artist: "Laurindo Almeida",
        plays: "47",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/9351c4917ef34fc194b9bc9c3617aecf.jpg"
    },
    {
        album: "Trickle",
        artist: "Million Eyes",
        plays: "47",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/41b1bc1cbcc339f9104241bffac03f21.jpg"
    },
    {
        album: "Velocity",
        artist: "Chikoi The Maid",
        plays: "46",
        image: "https://lastfm.freetls.fastly.net/i/u/174s/7101b4561f882c42eab01505da162401.jpg"
    }
]
  return baseData.slice(0, count)
}

function generateMockTopTracks(count = 10): TopTrack[] {
  const baseData: TopTrack[] = [
    {
        track: "WRATH",
        artist: "Phonkha",
        plays: "240",
        image: "https://i.scdn.co/image/ab67616d0000b273843242f8abfe17a40ea81483",
    },
    {
        track: "Override",
        artist: "KSLV Noh",
        plays: "220",
        image: "https://i.scdn.co/image/ab67616d0000b273fd0d8f94779bdd003596f2ed",
    },
    {
        track: "LVL DEATH",
        artist: "psychomane",
        plays: "214",
        image: "https://i.scdn.co/image/ab67616d0000b27381b29d239828b1dd6973ec4d",
    },
    {
        track: "No Below",
        artist: "Speedy Ortiz",
        plays: "196",
        image: "https://i.scdn.co/image/ab67616d0000b27339b683ce822becda4ecccfd8",
    },
    {
        track: "Piano Fire",
        artist: "Sparklehorse",
        plays: "195",
        image: "https://i.scdn.co/image/ab67616d0000b273249e18bd7db232c8384924ce",
    },
    {
        track: "Disaster",
        artist: "KSLV Noh",
        plays: "172",
        image: "https://i.scdn.co/image/ab67616d0000b2731115e7ebc1eae4e6b9027de6",
    },
    {
        track: "Mountains",
        artist: "Message To Bears",
        plays: "170",
        image: "https://i.scdn.co/image/ab67616d0000b27335c0b12724c2c9296a8e1436",
    },
    {
        track: "When the Party's Over",
        artist: "Felix Martin",
        plays: "166",
        image: "https://i.scdn.co/image/ab67616d0000b273f90448ad68fe4a30e14a16a7",
    },
    {
        track: "Going up the Country",
        artist: "Canned Heat",
        plays: "164",
        image: "https://i.scdn.co/image/ab67616d0000b27308a9f2ae15587fa3da702ba0",
    },
    {
        track: "Look, I'm Dancing",
        artist: "Syncatto",
        plays: "160",
        image: "https://i.scdn.co/image/ab67616d0000b27315e78e8098569df3f867bd69",
    },
    {
        track: "Obstacles",
        artist: "Syd Matters",
        plays: "158",
        image: "https://i.scdn.co/image/ab67616d0000b273baf75feff7c9a2c4ceaee87e",
    },
    {
        track: "Glock To Your Head",
        artist: "DeadJxhn",
        plays: "157",
        image: "https://i.scdn.co/image/ab67616d0000b273bbad1d2f974718059eb8d63b",
    },
    {
        track: "Slushies",
        artist: "karavelo",
        plays: "157",
        image: "https://i.scdn.co/image/ab67616d0000b2739abc30394b05bad8b9ca3114",
    },
    {
        track: "Sahara",
        artist: "Hensonn",
        plays: "152",
        image: "https://i.scdn.co/image/ab67616d0000b27383bd1e120f8b14407fe73816",
    },
    {
        track: "DESTRUCTION",
        artist: "MC ORSEN",
        plays: "148",
        image: "https://i.scdn.co/image/ab67616d0000b27327f442f0adb5d57caffe7253",
    },
    {
        track: "Live Another Day",
        artist: "Kordhell",
        plays: "147",
        image: "https://i.scdn.co/image/ab67616d0000b273cc319cc65277ea17783dca6b",
    },
    {
        track: "Pitch Dark",
        artist: "CHON",
        plays: "146",
        image: "https://i.scdn.co/image/ab67616d0000b27356c4f4160b3639d69f995cf8",
    },
    {
        track: "No Care",
        artist: "Daughter",
        plays: "144",
        image: "https://i.scdn.co/image/ab67616d0000b2732b39f574d17e45fad82194f0",
    },
    {
        track: "Youth",
        artist: "Daughter",
        plays: "141",
        image: "https://i.scdn.co/image/ab67616d0000b273f9e7f5cc42ac959998ca90ee",
    },
    {
        track: "Amore In Controluce 3",
        artist: "Gianni Marchetti",
        plays: "139",
        image: "https://i.scdn.co/image/ab67616d0000b27311dd95756ecb3953ac1ae3b0",
    },
    {
        track: "Dies irae",
        artist: "Giuseppe Verdi",
        plays: "138",
        image: "https://i.scdn.co/image/ab67616d0000b2735abdabd1eeb2bdd287ad8ce9",
    },
    {
        track: "Crosses",
        artist: "José González",
        plays: "138",
        image: "https://i.scdn.co/image/ab67616d0000b27376557bf2d3926bf5a607cd92",
    },
    {
        track: "Through The Cellar Door",
        artist: "Lanterns on the Lake",
        plays: "138",
        image: "https://i.scdn.co/image/ab67616d0000b273377e9a1eb4adac0f5e17fdea",
    },
    {
        track: "The Last of Us",
        artist: "Gustavo Santaolalla",
        plays: "137",
        image: "https://i.scdn.co/image/ab67616d0000b27368e5e7cc9256ca8c0917a9dd",
    },
    {
        track: "Mt. Washington",
        artist: "Local Natives",
        plays: "136",
        image: "https://i.scdn.co/image/ab67616d0000b27373f379b7c980cfb5be81553a",
    },
    {
        track: "Eclisse Slow - From \"L'eclisse\" Original Soundtrack",
        artist: "Giovanni Fusco",
        plays: "132",
        image: "https://i.scdn.co/image/ab67616d0000b273cdbd0a9bdb46f9132d42d9ab",
    },
    {
        track: "Kids Will Be Skeletons",
        artist: "Mogwai",
        plays: "132",
        image: "https://i.scdn.co/image/ab67616d0000b2730f65da27c1b96335e297c08b",
    },
    {
        track: "Stereo Love",
        artist: "my!lane",
        plays: "132",
        image: "https://i.scdn.co/image/ab67616d0000b273a97cc86221a5d3302be26680",
    },
    {
        track: "Ignorant",
        artist: "PHXNKPLAYA",
        plays: "132",
        image: "https://i.scdn.co/image/ab67616d0000b27310ec3c928abe7e9c480cd2d8",
    },
    {
        track: "I Can't Live Here Anymore",
        artist: "Daughter",
        plays: "131",
        image: "https://i.scdn.co/image/ab67616d0000b27337b43514fe2d8ec40c59f130",
    },
    {
        track: "I Don't",
        artist: "Koda",
        plays: "130",
        image: "https://i.scdn.co/image/ab67616d0000b27375900a8b36933b95b6e613e8",
    },
    {
        track: "he waits patiently",
        artist: "ichika Nito",
        plays: "128",
        image: "https://i.scdn.co/image/ab67616d0000b273868947899e3125b87a5ef73c",
    },
    {
        track: "All I Wanted",
        artist: "Daughter",
        plays: "126",
        image: "https://i.scdn.co/image/ab67616d0000b27337b43514fe2d8ec40c59f130",
    },
    {
        track: "Oats We Sow",
        artist: "Gregory and the Hawk",
        plays: "125",
        image: "https://i.scdn.co/image/ab67616d0000b27328e2b529cb08bfe5a00035c3",
    },
    {
        track: "The Four Seasons, Violin Concerto No. 2 in G Minor, RV 315 \"L'estate\": III. Tempo impetuoso d'estate",
        artist: "Antonio Vivaldi",
        plays: "124",
        image: "https://i.scdn.co/image/ab67616d0000b2735ec9bde7fb0ad9f6aa646866",
    },
    {
        track: "Main Title",
        artist: "Inon Zur",
        plays: "123",
        image: "https://i.scdn.co/image/ab67616d0000b27325f0615aeb6e2096bae05190",
    },
    {
        track: "Withdrawn",
        artist: "mell-ø",
        plays: "122",
        image: "https://i.scdn.co/image/ab67616d0000b2733d18783d914028156c41becc",
    },
    {
        track: "Street Market / Love Scene",
        artist: "Michael Small",
        plays: "120",
        image: "https://i.scdn.co/image/ab67616d0000b27310a62291ee92d7d270f8beba",
    },
    {
        track: "Voices",
        artist: "Daughter",
        plays: "116",
        image: "https://i.scdn.co/image/ab67616d0000b27337b43514fe2d8ec40c59f130",
    },
    {
        track: "Cursed Midnight - Radio Edit",
        artist: "GLWKMOD",
        plays: "116",
        image: "https://i.scdn.co/image/ab67616d0000b2736f8dbed1a5c6ddf7cbfc4af5",
    },
    {
        track: "Numbers",
        artist: "Daughter",
        plays: "114",
        image: "https://i.scdn.co/image/ab67616d0000b2732b39f574d17e45fad82194f0",
    },
    {
        track: "Swirl",
        artist: "Noflik",
        plays: "113",
        image: "https://i.scdn.co/image/ab67616d0000b27319483f6082db88c5d254e0f3",
    },
    {
        track: "Blackwell Academy",
        artist: "Dolkins",
        plays: "112",
        image: "https://i.scdn.co/image/ab67616d0000b2734c5d863b3fbdc9b4f5693b7b",
    },
    {
        track: "Fallout 4 Main Theme",
        artist: "Inon Zur",
        plays: "112",
        image: "https://i.scdn.co/image/ab67616d0000b273ee81b3d1a2d4185c24845c09",
    },
    {
        track: "The Right Way Around",
        artist: "Daughter",
        plays: "110",
        image: "https://i.scdn.co/image/ab67616d0000b27337b43514fe2d8ec40c59f130",
    },
    {
        track: "A Hole in the Earth",
        artist: "Daughter",
        plays: "109",
        image: "https://i.scdn.co/image/ab67616d0000b27337b43514fe2d8ec40c59f130",
    },
    {
        track: "No One is Ever Going to Want Me",
        artist: "Giles Corey",
        plays: "108",
        image: "https://i.scdn.co/image/ab67616d0000b273e461745c8728c3fdb048422f",
    },
    {
        track: "Ultraviolet",
        artist: "James Heather",
        plays: "108",
        image: "https://i.scdn.co/image/ab67616d0000b273ce38c0e59b44133928ac34f7",
    },
    {
        track: "El Gringo",
        artist: "Alessandro Alessandroni",
        plays: "107",
        image: "https://i.scdn.co/image/ab67616d0000b2731a3fc23749b24aa6a401caa3",
    },
    {
        track: "Pretty Little Head",
        artist: "Eliza Rickman",
        plays: "106",
        image: "https://i.scdn.co/image/ab67616d0000b27346aea3d7199c71688fd811c7",
    }
]
  return baseData.slice(0, count)
}

function generateMockFeaturedTrack(): LastFmFeaturedTrack | null {
  return {
    track: "PPPP (feat. Hatsune Miku, Kasane Teto)",
    artist: "Tak",
    image: "https://lastfm.freetls.fastly.net/i/u/174s/927a4cb87fe8f154f094708196727b80.png",
  }
}

export async function getMockLastFmData(config?: {
  recent_tracks_max?: number
  top_artists_max?: number
  top_albums_max?: number
  top_tracks_max?: number
}): Promise<LastFmData> {
  return {
    recentTracks: generateMockRecentTracks(config?.recent_tracks_max || 50),
    topArtists: generateMockTopArtists(config?.top_artists_max || 10),
    topAlbums: generateMockTopAlbums(config?.top_albums_max || 10),
    topTracks: generateMockTopTracks(config?.top_tracks_max || 10),
    statistics: {
      totalScrobbles: "155316",
      totalArtists: "11852",
      lovedTracks: "0",
    },
    featuredTrack: generateMockFeaturedTrack(),
  }
}
