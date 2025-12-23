import type { LastFmData, LastFmTrack, LastFmArtist, LastFmAlbum, TopTrack, LastFmFeaturedTrack } from "../types"

function generateMockRecentTracks(count = 50): LastFmTrack[] {
  const baseData: LastFmTrack[] = [
    {
        track: 'you got me worse',
        artist: "i don't like mirrors",
        date: '19 Dec 2025, 07:10',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/c3861d6c0ce6fd782ab07dec6d6013cf.png'
    },
    {
        track: 'repressed',
        artist: "i don't like mirrors",
        date: '19 Dec 2025, 07:09',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/55411ddacd2b6e74a78fcae166206808.jpg'
    },
    {
        track: 'this was everything for me',
        artist: "i don't like mirrors",
        date: '19 Dec 2025, 07:05',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/6aa70e1711ba33e4dc82d7dee2ee7ab9.jpg'
    },
    {
        track: "it hurts, now that you're gone",
        artist: "i don't like mirrors",
        date: '19 Dec 2025, 06:58',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/3606ce1d05b38800147eab7decf1b2e3.jpg'
    },
    {
        track: 'i miss your warm hands',
        artist: "i don't like mirrors",
        date: '19 Dec 2025, 06:56',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/5a77701a01dea9f7645a378c060d597b.jpg'
    },
    {
        track: 'A Ginko Tree',
        artist: 'Hemio',
        date: '19 Dec 2025, 06:53',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/615c9773db6dd02bfab82cd504ae6ae3.jpg'
    },
    {
        track: 'The Valley',
        artist: 'Niklas Blumenthaler',
        date: '19 Dec 2025, 06:51',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/56f1a86a610775d640c02311a1b9dfa5.jpg'
    },
    {
        track: 'Missing Home',
        artist: 'Erikson Jayanto',
        date: '19 Dec 2025, 06:47',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/967309736b1fb097bb6ca81eb52d6587.jpg'
    },
    {
        track: 'Epic Church Organ',
        artist: 'Rafael Krux',
        date: '19 Dec 2025, 06:44',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: "Elise's Garden",
        artist: 'Joshua Kyan Aalampour',
        date: '19 Dec 2025, 06:42',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/d40b749e0dc35e1b68daf3e0746cdbca.jpg'
    },
    {
        track: 'Reverie in a Heartbeat',
        artist: 'Franz Gordon',
        date: '19 Dec 2025, 06:38',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: "Des Vagues Sur l'Eau",
        artist: 'Million Eyes',
        date: '19 Dec 2025, 06:36',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/41b1bc1cbcc339f9104241bffac03f21.jpg'
    },
    {
        track: 'Dark chocolate',
        artist: 'Hemio',
        date: '19 Dec 2025, 06:33',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/615c9773db6dd02bfab82cd504ae6ae3.jpg'
    },
    {
        track: "Étude d'Amour",
        artist: 'Hakdo',
        date: '19 Dec 2025, 06:30',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'daydream',
        artist: 'Nowt',
        date: '19 Dec 2025, 06:27',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/90f92a06a2d8675ef41299644165bd31.jpg'
    },
    {
        track: 'Valse Sentimentale No. 2 In G Minor',
        artist: 'Eric Christian',
        date: '19 Dec 2025, 06:24',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/78bde38f30d30ad0c9269a6089a1e8ce.jpg'
    },
    {
        track: 'Beloved Mirage',
        artist: 'Joshua Kyan Aalampour',
        date: '19 Dec 2025, 06:22',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/dd7a14001b36a49702c60a4c873a88a4.jpg'
    },
    {
        track: 'Time for Eiroa',
        artist: 'Franz Gordon',
        date: '19 Dec 2025, 06:18',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/6a081160bf8c237b680f223fe2303286.jpg'
    },
    {
        track: 'Come Nighttime',
        artist: 'Million Eyes',
        date: '19 Dec 2025, 06:17',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Ethereal',
        artist: 'txmy',
        date: '19 Dec 2025, 05:14',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/e81465325ebad4095da698eddfb8a9b6.png'
    },
    {
        track: 'Wild Blue Yonder (In-Game)',
        artist: 'Upright T-Rex Music',
        date: '19 Dec 2025, 05:12',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/e8b5b6d24bd67d7bf337ce15f4891d72.jpg'
    },
    {
        track: 'Summer Fragrance',
        artist: 'Powerless',
        date: '19 Dec 2025, 05:08',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Parasol',
        artist: 'Seycara Orchestral',
        date: '19 Dec 2025, 05:05',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/c245b7027d87a5a97e1c7192a6c6c600.jpg'
    },
    {
        track: 'weather the storm',
        artist: 'Maran',
        date: '19 Dec 2025, 05:01',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'With Sadness in Heart',
        artist: 'Federico Dubbini',
        date: '19 Dec 2025, 04:59',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/6dc16ea36540719995a127933655caad.jpg'
    },
    {
        track: 'Dark anomaly',
        artist: 'Tomoki Miyoshi',
        date: '19 Dec 2025, 04:55',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/8757ee846ecd4e2f263f249e1ab3d5c7.jpg'
    },
    {
        track: 'Buried Away (Mars Underground)',
        artist: 'Flare',
        date: '19 Dec 2025, 04:53',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2d09dba043c92cdcd325d6ce98071684.jpg'
    },
    {
        track: '二十二時の絵本',
        artist: 'ミツキヨ',
        date: '19 Dec 2025, 04:40',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/92fd3eaeeaf866340957772f83ca797d.png'
    },
    {
        track: 'Night Market',
        artist: 'Seycara Orchestral',
        date: '19 Dec 2025, 04:37',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/626a2e41d87d3d2da6bd5cf63e6195b4.jpg'
    },
    {
        track: 'five & eight',
        artist: 'Maran',
        date: '19 Dec 2025, 04:35',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Empty dignity',
        artist: 'Mili',
        date: '19 Dec 2025, 04:32',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/a6387576d0615f102eadd5a219e267ee.jpg'
    },
    {
        track: 'Whispering of the Stars',
        artist: 'Luella Gren',
        date: '19 Dec 2025, 01:14',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/b911677ff7d607ee38031710905b5cd7.jpg'
    },
    {
        track: 'My Quiet Forest Home',
        artist: 'Yasunori Nishiki',
        date: '19 Dec 2025, 01:11',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/3a6f674dc73a6ba67c8b9d8fc4e5e721.jpg'
    },
    {
        track: 'Alabaster Dreams (Snow World)',
        artist: 'Flare',
        date: '19 Dec 2025, 01:07',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2d09dba043c92cdcd325d6ce98071684.jpg'
    },
    {
        track: 'Cake Castle!',
        artist: 'Seycara Orchestral',
        date: '19 Dec 2025, 01:04',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/8ec5a096eaa3905057af190b08a6e927.jpg'
    },
    {
        track: 'Bits and Pieces',
        artist: 'Chamber Chu',
        date: '19 Dec 2025, 01:01',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Reunion',
        artist: 'Aaron Cherof',
        date: '19 Dec 2025, 00:57',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/b9603820c90aec8d32a079c938e706ca.jpg'
    },
    {
        track: 'your life flashing before your eyes',
        artist: 'Dreamcorp.',
        date: '19 Dec 2025, 00:54',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/017e8056353b7903ff6fdcc6cfc69e7b.png'
    },
    {
        track: 'A Place In The Sun',
        artist: 'Launchable Socks',
        date: '19 Dec 2025, 00:52',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/49e2c18f0d1ef1d90c1a215db3c08fed.jpg'
    },
    {
        track: 'sleepy',
        artist: 'Nikita Kryukov',
        date: '19 Dec 2025, 00:48',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/09d7a17066bf5cd065b9271b382a6318.png'
    },
    {
        track: 'Flirtatious',
        artist: 'Seycara Orchestral',
        date: '19 Dec 2025, 00:45',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/60739efa07a8c5f681ce991242db6df3.jpg'
    },
    {
        track: "Rei's Smile",
        artist: 'Chamber Chu',
        date: '19 Dec 2025, 00:43',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/76791c3ab90a49064d9a6046f221c3a3.jpg'
    },
    {
        track: 'Hod Battle',
        artist: 'Everything Fantasy',
        date: '19 Dec 2025, 00:41',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Ascurcia',
        artist: 'Artisan',
        date: '19 Dec 2025, 00:37',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/93354e46e73ba14d759852219808d036.jpg'
    },
    {
        track: 'III. Reminiscence',
        artist: 'Feryquitous',
        date: '19 Dec 2025, 00:34',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'The Forgotten Memories',
        artist: 'Luella Gren',
        date: '19 Dec 2025, 00:31',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/7cc3f016bc4c536a682fd927ff64854b.jpg'
    },
    {
        track: 'Epilogue: Headed Home',
        artist: 'Seycara Orchestral',
        date: '19 Dec 2025, 00:28',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/8ec5a096eaa3905057af190b08a6e927.jpg'
    },
    {
        track: 'Flowing Flutes',
        artist: 'Chamber Chu',
        date: '19 Dec 2025, 00:26',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Spin - Instrumental',
        artist: 'Pathcel Tarts',
        date: '19 Dec 2025, 00:22',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'L',
        artist: 'Mili',
        date: '19 Dec 2025, 00:21',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/a6387576d0615f102eadd5a219e267ee.jpg'
    }
]
  return baseData.slice(0, count)
}

function generateMockTopArtists(count = 10): LastFmArtist[] {
  const baseData: LastFmArtist[] = [
    {
        artist: 'Seycara Orchestral',
        totalPlays: '3313',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        artist: 'Daughter',
        totalPlays: '1723',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        artist: 'Five Finger Death Punch',
        totalPlays: '1181',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        artist: 'Shawn Lee',
        totalPlays: '863',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        artist: 'Sean Angus Watson',
        totalPlays: '730',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        artist: 'Steve Jablonsky',
        totalPlays: '712',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        artist: 'BABYMETAL',
        totalPlays: '695',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        artist: 'Andrew Bird',
        totalPlays: '676',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        artist: 'Antonio Vivaldi',
        totalPlays: '674',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        artist: 'Lofi Fruits Music',
        totalPlays: '639',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    }
]
  return baseData.slice(0, count)
}

function generateMockTopAlbums(count = 10): LastFmAlbum[] {
  const baseData: LastFmAlbum[] = [
    {
        album: 'Music from Before the Storm',
        artist: 'Daughter',
        plays: '1270',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/d8ac095172c560db08de8ca9829c510f.jpg'
    },
    {
        album: 'Bully (Original Soundtrack)',
        artist: 'Shawn Lee',
        plays: '680',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/fb8b7955d49546bf80f38ba8886685ab.jpg'
    },
    {
        album: 'The Sims 3 (Original Soundtrack)',
        artist: 'Steve Jablonsky',
        plays: '521',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/a4f3d74fb84f4e0bdfc0068021ea0014.jpg'
    },
    {
        album: 'Hades: Original Soundtrack',
        artist: 'Darren Korb',
        plays: '454',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/1fe70c05b6a46ce025f515c026bfc10c.jpg'
    },
    {
        album: 'Persona 3 Reload Original Soundtrack',
        artist: 'アトラスサウンドチーム',
        plays: '447',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/c43cd58536fb7ea786064d57be1b9600.jpg'
    },
    {
        album: 'Kingdom Come: Deliverance (Original Soundtrack Essentials)',
        artist: 'Jan Valta',
        plays: '439',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2b15fc6fd3745cbf23ebf1be4cedab7c.jpg'
    },
    {
        album: 'BABYMETAL',
        artist: 'BABYMETAL',
        plays: '376',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/ef534ed897b4fee346393653c0449e80.jpg'
    },
    {
        album: 'RuneScape: (Original Soundtrack Classics)',
        artist: 'Jagex Audio Team',
        plays: '376',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/574cb2c5e28f29835a61d8247ac2296f.jpg'
    },
    {
        album: 'Hypnospace Outlaw Original Soundtrack, Vol. 2',
        artist: 'Jay Tholen',
        plays: '360',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/f602427c173db819e86a1a7c20ca39c9.jpg'
    },
    {
        album: 'Everlasting Summer',
        artist: 'Seycara Orchestral',
        plays: '351',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/c245b7027d87a5a97e1c7192a6c6c600.jpg'
    }
]
  return baseData.slice(0, count)
}

function generateMockTopTracks(count = 10): TopTrack[] {
  const baseData: TopTrack[] = [
    {
        track: 'WRATH',
        artist: 'Phonkha',
        plays: '240',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Override',
        artist: 'KSLV Noh',
        plays: '220',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'LVL DEATH',
        artist: 'psychomane',
        plays: '214',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'No Below',
        artist: 'Speedy Ortiz',
        plays: '196',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Piano Fire',
        artist: 'Sparklehorse',
        plays: '195',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Disaster',
        artist: 'KSLV Noh',
        plays: '172',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Mountains',
        artist: 'Message To Bears',
        plays: '170',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: "When the Party's Over",
        artist: 'Felix Martin',
        plays: '165',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: 'Going up the Country',
        artist: 'Canned Heat',
        plays: '164',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    },
    {
        track: "Look, I'm Dancing",
        artist: 'Syncatto',
        plays: '159',
        image: 'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png'
    }
]
  return baseData.slice(0, count)
}

function generateMockFeaturedTrack(): LastFmFeaturedTrack | null {
  return {
    track: "WRATH",
    artist: "Phonkha",
    image: "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png",
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
      totalScrobbles: "153353",
      totalArtists: "11733",
      lovedTracks: "0",
    },
    featuredTrack: generateMockFeaturedTrack(),
  }
}
