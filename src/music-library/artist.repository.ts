import { EntityRepository, Repository } from "typeorm";
import { Artist } from "./artist.entity";

@EntityRepository(Artist)
export class ArtistRepository extends Repository<Artist> {}
