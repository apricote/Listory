import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Track } from "../music-library/track.entity";
import { User } from "../users/user.entity";

@Entity()
@Index(["track", "user", "playedAt"], { unique: true })
export class Listen {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne((type) => Track)
  track: Track;

  @ManyToOne((type) => User)
  user: User;

  @Column({ type: "timestamp" })
  playedAt: Date;
}
