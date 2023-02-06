import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Track } from "../../../music-library/track.entity";
import { User } from "../../../users/user.entity";
import { Listen } from "../../../listens/listen.entity";

@Entity({ name: "spotify_extended_streaming_history_listen" })
export class SpotifyExtendedStreamingHistoryListen {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: "timestamp" })
  playedAt: Date;

  @Column()
  spotifyTrackUri: string;

  @ManyToOne(() => Track, { nullable: true, eager: true })
  track?: Track;

  @ManyToOne(() => Listen, { nullable: true, eager: true })
  listen?: Listen;
}
