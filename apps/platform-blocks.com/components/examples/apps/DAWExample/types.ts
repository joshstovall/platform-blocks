export interface DAWTrack {
  id: string;
  name: string;
  color: string;
  muted?: boolean;
  solo?: boolean;
  armed?: boolean;
  clips: DAWClip[];
}

export interface DAWClip {
  id: string;
  start: number; // seconds
  length: number; // seconds
  color?: string;
  selected?: boolean;
}

export interface DAWTransportState {
  playing: boolean;
  position: number; // seconds
  loop: boolean;
  bpm: number;
  timeSig: string;
}
