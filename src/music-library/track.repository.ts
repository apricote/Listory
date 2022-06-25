import { Repository } from "typeorm";
import { EntityRepository } from "../database/entity-repository";
import { Track } from "./track.entity";

@EntityRepository(Track)
export class TrackRepository extends Repository<Track> {}
