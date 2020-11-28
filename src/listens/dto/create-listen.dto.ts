import { Track } from "../../music-library/track.entity";
import { User } from "../../users/user.entity";
import { Listen } from "../listen.entity";

// tslint:disable max-classes-per-file

export class CreateListenRequestDto {
  track: Track;
  user: User;
  playedAt: Date;
}

export class CreateListenResponseDto {
  listen: Listen;
  isDuplicate: boolean;
}
