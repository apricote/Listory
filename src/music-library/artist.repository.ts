import { Repository } from "typeorm";
import { EntityRepository } from "../database/entity-repository";
import { Artist } from "./artist.entity";

@EntityRepository(Artist)
export class ArtistRepository extends Repository<Artist> {}
