import { Repository } from "typeorm";
import { EntityRepository } from "../database/entity-repository";
import { Album } from "./album.entity";

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {}
