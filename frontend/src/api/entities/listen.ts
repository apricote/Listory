import { Track } from "./track";

export interface Listen {
  id: string;
  playedAt: string;
  track: Track;
}
