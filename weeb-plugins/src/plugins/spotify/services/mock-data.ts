/**
 * Mock data for Spotify plugin development
 */

import type { SpotifyData } from '../types'

/**
 * Generates mock data for the Spotify plugin
 */
export function getMockSpotifyData(): SpotifyData {
  return {
    recentTracks: [
      {
        id: '1',
        name: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        duration: 200,
        externalUrl: 'https://open.spotify.com/track/0VjIjW4GlUZ9YafZejv2Hb',
      },
      {
        id: '2',
        name: 'Watermelon Sugar',
        artist: 'Harry Styles',
        album: 'Fine Line',
        image: 'https://i.scdn.co/image/ab67616d0000b273b0d4b1e8496f8a47346e17fa',
        duration: 174,
        externalUrl: 'https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY',
      },
      {
        id: '3',
        name: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        image: 'https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e',
        duration: 203,
        externalUrl: 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9',
      },
      {
        id: '4',
        name: 'Stay',
        artist: 'The Kid LAROI & Justin Bieber',
        album: 'F*CK LOVE 3: OVER YOU',
        image: 'https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a0c63c33',
        duration: 141,
        externalUrl: 'https://open.spotify.com/track/5PjdY0CKGZdEuoNab3yDmX',
      },
      {
        id: '5',
        name: 'good 4 u',
        artist: 'Olivia Rodrigo',
        album: 'SOUR',
        image: 'https://i.scdn.co/image/ab67616d0000b273173dc3be7582693a9b49c8e8',
        duration: 178,
        externalUrl: 'https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG',
      },
    ],
    topArtists: [
      {
        id: '1',
        name: 'The Weeknd',
        image: 'https://i.scdn.co/image/ab6761610000e5ebef8c75a5a9c2c74f4dbaa4d9',
        externalUrl: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ',
      },
      {
        id: '2',
        name: 'Dua Lipa',
        image: 'https://i.scdn.co/image/ab6761610000e5ebcdce7620dc2db9386d2e5c14',
        externalUrl: 'https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we',
      },
      {
        id: '3',
        name: 'Harry Styles',
        image: 'https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd',
        externalUrl: 'https://open.spotify.com/artist/6KImCVD70vtIoJWnq6nGn3',
      },
      {
        id: '4',
        name: 'Billie Eilish',
        image: 'https://i.scdn.co/image/ab6761610000e5eb72d5a94d93da5d8316c09fb1',
        externalUrl: 'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH',
      },
      {
        id: '5',
        name: 'Taylor Swift',
        image: 'https://i.scdn.co/image/ab6761610000e5ebec05963eab63676a539fef4b',
        externalUrl: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
      },
    ],
    topTracks: [
      {
        id: '1',
        name: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        duration: 200,
        externalUrl: 'https://open.spotify.com/track/0VjIjW4GlUZ9YafZejv2Hb',
      },
      {
        id: '2',
        name: 'Save Your Tears',
        artist: 'The Weeknd',
        album: 'After Hours',
        image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        duration: 215,
        externalUrl: 'https://open.spotify.com/track/5QO79kh1waicV47BqGRL3g',
      },
      {
        id: '3',
        name: 'Watermelon Sugar',
        artist: 'Harry Styles',
        album: 'Fine Line',
        image: 'https://i.scdn.co/image/ab67616d0000b273b0d4b1e8496f8a47346e17fa',
        duration: 174,
        externalUrl: 'https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY',
      },
      {
        id: '4',
        name: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        image: 'https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e',
        duration: 203,
        externalUrl: 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9',
      },
      {
        id: '5',
        name: 'Don\'t Start Now',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        image: 'https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e',
        duration: 183,
        externalUrl: 'https://open.spotify.com/track/6WrI0LAC5M1Rw2MnX2ZvEg',
      },
    ],
    currentlyPlaying: {
      track: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
      isPlaying: true,
    },
    playlists: [
      {
        id: '1',
        name: 'Discover Weekly',
        description: 'Your weekly mixtape of fresh music',
        image: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
        tracksCount: 30,
        externalUrl: 'https://open.spotify.com/playlist/37i9dQZEVXcJZyENOWUFo7',
      },
      {
        id: '2',
        name: 'Liked Songs',
        description: 'Songs you liked',
        image: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
        tracksCount: 245,
        externalUrl: 'https://open.spotify.com/collection/tracks',
      },
      {
        id: '3',
        name: 'Daily Mix 1',
        description: 'Made for you based on your listening',
        image: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
        tracksCount: 50,
        externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1E36zRrKlKHRL1',
      },
      {
        id: '4',
        name: 'Summer Vibes',
        description: 'The best songs for summer',
        image: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
        tracksCount: 75,
        externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1gRalH1mWrP',
      },
      {
        id: '5',
        name: 'Chill Hits',
        description: 'Kick back to the best new and recent chill hits',
        image: 'https://misc.scdn.co/liked-songs/liked-songs-640.png',
        tracksCount: 50,
        externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
      },
    ],
    profile: {
      id: 'mock_user',
      displayName: 'Spotify User',
      image: 'https://i.scdn.co/image/ab6775700000ee85811c8fdee689f8bfbc3a4626',
      followers: 1234,
      externalUrl: 'https://open.spotify.com/user/mock_user',
    },
    topArtistsPeriod: 'Last 6 months',
    topTracksPeriod: 'Last 6 months',
  }
}
