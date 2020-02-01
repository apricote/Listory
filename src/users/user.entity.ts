import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { SpotifyConnection } from "../sources/spotify/spotify-connection.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  photo?: string;

  @Column(type => SpotifyConnection)
  spotify: SpotifyConnection;
}
