import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { SpotifyLibraryDetails } from "../sources/spotify/spotify-library-details.entity";
import { Album } from "./album.entity";
import { Genre } from "./genre.entity";

@Entity()
export class Artist {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Album, (album) => album.artists)
  albums?: Album[];

  @ManyToMany(() => Genre)
  genres?: Genre[];

  @Column(() => SpotifyLibraryDetails)
  spotify: SpotifyLibraryDetails;
}
