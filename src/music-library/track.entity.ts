import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SpotifyLibraryDetails } from "../sources/spotify/spotify-library-details.entity";
import { Album } from "./album.entity";
import { Artist } from "./artist.entity";

@Entity()
export class Track {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne((type) => Album, (album) => album.tracks)
  album: Album;

  @ManyToMany((type) => Artist)
  @JoinTable({ name: "track_artists" })
  artists: Artist[];

  @Column((type) => SpotifyLibraryDetails)
  spotify?: SpotifyLibraryDetails;
}
