export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  cover: string;
}

export type RepeatMode = 'off' | 'all' | 'one';
