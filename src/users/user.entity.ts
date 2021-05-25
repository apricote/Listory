import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SpotifyConnection } from "../sources/spotify/spotify-connection.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  photo?: string;

  @Column(() => SpotifyConnection)
  spotify: SpotifyConnection;
}
