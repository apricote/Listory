import { Track } from "../../music-library/track.entity";
import { User } from "../../users/user.entity";

export class CreateListenDto {
  track: Track;
  user: User;
  playedAt: Date;
}
