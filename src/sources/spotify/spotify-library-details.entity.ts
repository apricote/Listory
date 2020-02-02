import { Column } from "typeorm";

export class SpotifyLibraryDetails {
  @Column()
  id: string;

  @Column()
  uri: string;

  @Column()
  type: string;

  @Column()
  href: string;
}
