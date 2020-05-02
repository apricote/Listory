export interface Listen {
  id: string;
  playedAt: string;
  track: Track;
}

interface Track {
  id: string;
  name: string;
  album: Album;
  artists: Artist[];
  spotify?: SpotifyInfo;
}

interface Album {
  id: string;
  name: string;
  spotify?: SpotifyInfo;
}

interface Artist {
  id: string;
  name: string;
  spotify?: SpotifyInfo;
}

interface SpotifyInfo {
  id: string;
  uri: string;
  type: string;
  href: string;
}
