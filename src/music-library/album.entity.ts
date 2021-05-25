import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SpotifyLibraryDetails } from "../sources/spotify/spotify-library-details.entity";
import { Artist } from "./artist.entity";
import { Genre } from "./genre.entity";
import { Track } from "./track.entity";

@Entity()
export class Album {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Artist, (artist) => artist.albums)
  @JoinTable({ name: "album_artists" })
  artists?: Artist[];

  @OneToMany(() => Track, (track) => track.album)
  tracks?: Track[];

  @ManyToMany(() => Genre)
  genres?: Genre[];

  @Column(() => SpotifyLibraryDetails)
  spotify: SpotifyLibraryDetails;
}
