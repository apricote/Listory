import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany
} from "typeorm";
import { SpotifyLibraryDetails } from "src/sources/spotify/spotify-library-details.entity";
import { Artist } from "./artist.entity";
import { Track } from "./track.entity";

@Entity()
export class Album {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(
    type => Artist,
    artist => artist.albums
  )
  @JoinTable()
  artists: Artist[];

  @OneToMany(
    type => Track,
    track => track.album
  )
  tracks: Track[];

  @Column(type => SpotifyLibraryDetails)
  spotify: SpotifyLibraryDetails;
}
