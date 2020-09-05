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
import { Track } from "./track.entity";

@Entity()
export class Album {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany((type) => Artist, (artist) => artist.albums)
  @JoinTable({ name: "album_artists" })
  artists: Artist[];

  @OneToMany((type) => Track, (track) => track.album)
  tracks: Track[];

  @Column((type) => SpotifyLibraryDetails)
  spotify: SpotifyLibraryDetails;
}
