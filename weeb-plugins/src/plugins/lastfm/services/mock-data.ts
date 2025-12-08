/**
 * Mock data for LastFM plugin development
 *
 * ⚠️  THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY ⚠️
 *
 * Generated from real API data
 */

import type { LastFmData, LastFmTrack, LastFmArtist, LastFmAlbum, TopTrack, LastFmFeaturedTrack } from '../types'

function generateMockRecentTracks(count = 50): LastFmTrack[] {
  const baseData: LastFmTrack[] = [
  {
    "track": "tiny sand rat - battle",
    "artist": "AZALI",
    "date": "07 Dec 2025, 15:03",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/eaafaf19e0a4289bd14b3bbcef500ae9.jpg"
  },
  {
    "track": "Puppet Strings",
    "artist": "Kichi",
    "date": "07 Dec 2025, 15:00",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/d22763347aa2488e023d3f7679096e7e.jpg"
  },
  {
    "track": "The Cradle of Vanity",
    "artist": "Dysmn",
    "date": "07 Dec 2025, 14:57",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/871cd27c56bd06ad8f96d05b9a8bfa09.jpg"
  },
  {
    "track": "Genesis of Violincore",
    "artist": "Smoke-Oh",
    "date": "07 Dec 2025, 14:53",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "VYLLAINOUS",
    "artist": "VYLT",
    "date": "07 Dec 2025, 14:48",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/649b5869709e8661aafe06c184a47c2f.jpg"
  },
  {
    "track": "Counter Blade",
    "artist": "lappy",
    "date": "07 Dec 2025, 14:45",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/a3ed9994e934682b860e88e37bcfe8ba.png"
  },
  {
    "track": "CHAOS CONTROL",
    "artist": "AZALI",
    "date": "07 Dec 2025, 14:43",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/eaafaf19e0a4289bd14b3bbcef500ae9.jpg"
  },
  {
    "track": "Lunar Clock ~ Luna Dial",
    "artist": "YaboiMatoi",
    "date": "07 Dec 2025, 14:40",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/f15820024641d27e7c908cf873199137.jpg"
  },
  {
    "track": "Judgement I",
    "artist": "Dysmn",
    "date": "07 Dec 2025, 14:37",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/8a7c484e00debccca578988cc1265644.jpg"
  },
  {
    "track": "Aether",
    "artist": "Powerless",
    "date": "07 Dec 2025, 14:34",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "Zero to Midnight",
    "artist": "Challenger Deep",
    "date": "07 Dec 2025, 14:29",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/e5f692a00c46069589e600be764175e1.jpg"
  },
  {
    "track": "It's Your Chance!",
    "artist": "lappy",
    "date": "07 Dec 2025, 14:22",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "FROSTBEARER",
    "artist": "AZALI",
    "date": "07 Dec 2025, 14:20",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/03ff03d8073a71dbbc52e65ee7b57fb7.jpg"
  },
  {
    "track": "Nightmare",
    "artist": "RJ Pasin",
    "date": "07 Dec 2025, 14:18",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/758545ed89da9fc932430335deceb870.jpg"
  },
  {
    "track": "Armageddon",
    "artist": "Dysmn",
    "date": "07 Dec 2025, 14:14",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/871cd27c56bd06ad8f96d05b9a8bfa09.jpg"
  },
  {
    "track": "Suwa Foughten Field",
    "artist": "YaboiMatoi",
    "date": "07 Dec 2025, 14:10",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/f15820024641d27e7c908cf873199137.jpg"
  },
  {
    "track": "Insomnia Club",
    "artist": "Nouvelle Story",
    "date": "07 Dec 2025, 14:05",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "Heart of Corruption",
    "artist": "lappy",
    "date": "07 Dec 2025, 14:02",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/19e781d62027d220598f10233ea5e443.png"
  },
  {
    "track": "DIVINITY DISSONANT",
    "artist": "AZALI",
    "date": "07 Dec 2025, 14:00",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/65acb5d842cb756d9325d6ed90a4a6d6.jpg"
  },
  {
    "track": "VYSIONS",
    "artist": "VYLT",
    "date": "07 Dec 2025, 13:55",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/cfee3e2e2664d5a1392c4c9d680edd26.jpg"
  },
  {
    "track": "Starfury",
    "artist": "Dysmn",
    "date": "07 Dec 2025, 13:46",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/4d8bd1bff1cc429cb42f198a2094444e.jpg"
  },
  {
    "track": "Green-Eyed Jealousy",
    "artist": "YaboiMatoi",
    "date": "07 Dec 2025, 13:43",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/f15820024641d27e7c908cf873199137.jpg"
  },
  {
    "track": "Be Yourself Or Die Dreaming",
    "artist": "Nouvelle Story",
    "date": "07 Dec 2025, 13:39",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/a3e01c0eced02487b8ed815fe8023dcb.jpg"
  },
  {
    "track": "Laminar Flow",
    "artist": "Syncatto",
    "date": "07 Dec 2025, 13:36",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/33f0f390b343ac1d43bd3576e93d044d.jpg"
  },
  {
    "track": "ROSEATE PAROXYSM",
    "artist": "AZALI",
    "date": "07 Dec 2025, 13:34",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "You Can't Hide",
    "artist": "Zetsubou P",
    "date": "07 Dec 2025, 13:30",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/07c48397d03134e245d5c67b225d54c4.jpg"
  },
  {
    "track": "Salvation.exe",
    "artist": "Dysmn",
    "date": "07 Dec 2025, 13:28",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/8c042f45d3608181260d8bad2e6354d2.jpg"
  },
  {
    "track": "Bloom",
    "artist": "NOXUNUS",
    "date": "07 Dec 2025, 13:25",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/568bb37dd2326ad58458a90bcf4ce3e4.jpg"
  },
  {
    "track": "She Said I'm Gloomy",
    "artist": "Nouvelle Story",
    "date": "07 Dec 2025, 13:21",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/ad95bd685fd782dc8bbbae9e79edb06b.jpg"
  },
  {
    "track": "VYVYSECTION",
    "artist": "VYLT",
    "date": "07 Dec 2025, 13:17",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/cb3954e90f10b7a3bbe5a01ca4156b53.jpg"
  },
  {
    "track": "CHAOS CONSTRUCT",
    "artist": "AZALI",
    "date": "07 Dec 2025, 13:15",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/0b4a4490d8d5ec54df6bd8190df4d893.png"
  },
  {
    "track": "Good night, Terra",
    "artist": "lappy",
    "date": "07 Dec 2025, 13:12",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/23304e6a10fe0f8f9fdfc59412c84c55.png"
  },
  {
    "track": "Hatred",
    "artist": "Dysmn",
    "date": "07 Dec 2025, 13:08",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "Suffer! Suffer!",
    "artist": "Kichi",
    "date": "07 Dec 2025, 13:06",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/9fb2b6ded8ac78e2f6f5fcbe1fb7b265.jpg"
  },
  {
    "track": "The Cat On The Roof",
    "artist": "Nouvelle Story",
    "date": "07 Dec 2025, 13:03",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/ad95bd685fd782dc8bbbae9e79edb06b.jpg"
  },
  {
    "track": "Ritual",
    "artist": "Syncatto",
    "date": "07 Dec 2025, 12:59",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/f32f8022301fbbf4766b90395ed8c27e.jpg"
  },
  {
    "track": "PLAYING WITH FIRE",
    "artist": "AZALI",
    "date": "07 Dec 2025, 12:56",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/b4e2bd985c3111a87d6cf2d6f8ed9328.jpg"
  },
  {
    "track": "Luce del Desiderio",
    "artist": "lappy",
    "date": "07 Dec 2025, 12:54",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/541bf41589d494719cd27e13363fd4f7.png"
  },
  {
    "track": "Die Screaming",
    "artist": "Dysmn",
    "date": "07 Dec 2025, 12:51",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/8c042f45d3608181260d8bad2e6354d2.jpg"
  },
  {
    "track": "Fortune",
    "artist": "NOXUNUS",
    "date": "07 Dec 2025, 12:45",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/b4c37d8f40d045b8ef23fe20f24e99dd.jpg"
  },
  {
    "track": "VYBRANCY",
    "artist": "VYLT",
    "date": "07 Dec 2025, 12:42",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/b93776fee2b82e5bf98dbbb952004d0e.jpg"
  },
  {
    "track": "Festival Atmosphere",
    "artist": "Nouvelle Story",
    "date": "07 Dec 2025, 12:38",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/ad95bd685fd782dc8bbbae9e79edb06b.jpg"
  },
  {
    "track": "PLAYFUL MASSACRE",
    "artist": "AZALI",
    "date": "07 Dec 2025, 12:20",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/338d19a9c808c44b7c1bc4005a88fcdd.jpg"
  },
  {
    "track": "Elegy of the End",
    "artist": "lappy",
    "date": "07 Dec 2025, 12:15",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/89f220fc601260838ad1e42376f2d5ad.png"
  },
  {
    "track": "I Swear I'm Normal",
    "artist": "Dysmn",
    "date": "07 Dec 2025, 12:11",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/8c042f45d3608181260d8bad2e6354d2.jpg"
  },
  {
    "track": "Death (I Am Ready To Die)",
    "artist": "Dysmn",
    "date": "07 Dec 2025, 12:05",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "Promised",
    "artist": "KnifeFightKyoto",
    "date": "07 Dec 2025, 12:03",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/e819527ff2e5c838a15fed04d2eb92d9.jpg"
  },
  {
    "track": "HIKIKOMORI",
    "artist": "Neon Oni",
    "date": "07 Dec 2025, 12:00",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/cac6e3563d1b4ca98b58aee666a01add.jpg"
  },
  {
    "track": "Empty",
    "artist": "Takamachi Walk",
    "date": "07 Dec 2025, 11:56",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/c1645b499700704e299049c8d3fae5ae.jpg"
  },
  {
    "track": "The Voice",
    "artist": "Zetsubou P",
    "date": "07 Dec 2025, 11:53",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/768c3553b0f3a8d36fb2216db7977b1b.jpg"
  }
]
  return baseData.slice(0, count)
}

function generateMockTopArtists(count = 10): LastFmArtist[] {
  const baseData: LastFmArtist[] = [
  {
    "artist": "Seycara Orchestral",
    "totalPlays": "3267",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "artist": "Daughter",
    "totalPlays": "1723",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "artist": "Five Finger Death Punch",
    "totalPlays": "1180",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "artist": "Shawn Lee",
    "totalPlays": "863",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "artist": "Sean Angus Watson",
    "totalPlays": "730",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "artist": "BABYMETAL",
    "totalPlays": "695",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "artist": "Steve Jablonsky",
    "totalPlays": "683",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "artist": "Andrew Bird",
    "totalPlays": "676",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "artist": "Antonio Vivaldi",
    "totalPlays": "674",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "artist": "Lofi Fruits Music",
    "totalPlays": "639",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  }
]
  return baseData.slice(0, count)
}

function generateMockTopAlbums(count = 10): LastFmAlbum[] {
  const baseData: LastFmAlbum[] = [
  {
    "album": "Music from Before the Storm",
    "artist": "Daughter",
    "plays": "1270",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/d8ac095172c560db08de8ca9829c510f.jpg"
  },
  {
    "album": "Bully (Original Soundtrack)",
    "artist": "Shawn Lee",
    "plays": "680",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/fb8b7955d49546bf80f38ba8886685ab.jpg"
  },
  {
    "album": "The Sims 3 (Original Soundtrack)",
    "artist": "Steve Jablonsky",
    "plays": "492",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/a4f3d74fb84f4e0bdfc0068021ea0014.jpg"
  },
  {
    "album": "Hades: Original Soundtrack",
    "artist": "Darren Korb",
    "plays": "454",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/1fe70c05b6a46ce025f515c026bfc10c.jpg"
  },
  {
    "album": "Persona 3 Reload Original Soundtrack",
    "artist": "アトラスサウンドチーム",
    "plays": "445",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/c43cd58536fb7ea786064d57be1b9600.jpg"
  },
  {
    "album": "Kingdom Come: Deliverance (Original Soundtrack Essentials)",
    "artist": "Jan Valta",
    "plays": "439",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2b15fc6fd3745cbf23ebf1be4cedab7c.jpg"
  },
  {
    "album": "BABYMETAL",
    "artist": "BABYMETAL",
    "plays": "376",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/ef534ed897b4fee346393653c0449e80.jpg"
  },
  {
    "album": "RuneScape: (Original Soundtrack Classics)",
    "artist": "Jagex Audio Team",
    "plays": "371",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/574cb2c5e28f29835a61d8247ac2296f.jpg"
  },
  {
    "album": "Hypnospace Outlaw Original Soundtrack, Vol. 2",
    "artist": "Jay Tholen",
    "plays": "359",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/f602427c173db819e86a1a7c20ca39c9.jpg"
  },
  {
    "album": "Everlasting Summer",
    "artist": "Seycara Orchestral",
    "plays": "344",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/c245b7027d87a5a97e1c7192a6c6c600.jpg"
  }
]
  return baseData.slice(0, count)
}

function generateMockTopTracks(count = 10): TopTrack[] {
  const baseData: TopTrack[] = [
  {
    "track": "WRATH",
    "artist": "Phonkha",
    "plays": "240",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "Override",
    "artist": "KSLV Noh",
    "plays": "220",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "LVL DEATH",
    "artist": "psychomane",
    "plays": "214",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "No Below",
    "artist": "Speedy Ortiz",
    "plays": "196",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "Piano Fire",
    "artist": "Sparklehorse",
    "plays": "195",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "Disaster",
    "artist": "KSLV Noh",
    "plays": "172",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "Mountains",
    "artist": "Message To Bears",
    "plays": "170",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "Going up the Country",
    "artist": "Canned Heat",
    "plays": "164",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "When the Party's Over",
    "artist": "Felix Martin",
    "plays": "164",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  },
  {
    "track": "Look, I'm Dancing",
    "artist": "Syncatto",
    "plays": "159",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  }
]
  return baseData.slice(0, count)
}

function generateMockFeaturedTrack(): LastFmFeaturedTrack | null {
  return {
  "track": "WRATH",
  "artist": "Phonkha",
  "image": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
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
  "totalScrobbles": "153353",
  "totalArtists": "11733",
  "lovedTracks": "0"
},
    featuredTrack: generateMockFeaturedTrack(),
  }
}
