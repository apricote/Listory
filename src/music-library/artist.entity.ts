import { SpotifyLibraryDetails } from "src/sources/spotify/spotify-library-details.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./album.entity";

@Entity()
export class Artist {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany((type) => Album, (album) => album.artists)
  albums?: Album[];

  @Column((type) => SpotifyLibraryDetails)
  spotify: SpotifyLibraryDetails;
}
