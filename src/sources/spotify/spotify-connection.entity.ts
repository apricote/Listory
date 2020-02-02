import { Column } from "typeorm";

export class SpotifyConnection {
  @Column()
  id: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column({ type: "timestamp", nullable: true })
  lastRefreshTime?: Date;
}
