/* eslint-disable max-classes-per-file */
import { Track } from "../../music-library/track.entity";
import { User } from "../../users/user.entity";
import { Listen } from "../listen.entity";

export class CreateListenRequestDto {
  track: Track;
  user: User;
  playedAt: Date;
}

export class CreateListenResponseDto {
  listen: Listen;
  isDuplicate: boolean;
}
