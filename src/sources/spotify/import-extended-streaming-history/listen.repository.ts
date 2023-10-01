import { Repository } from "typeorm";
import { EntityRepository } from "../../../database/entity-repository";
import { SpotifyExtendedStreamingHistoryListen } from "./listen.entity";

@EntityRepository(SpotifyExtendedStreamingHistoryListen)
export class SpotifyExtendedStreamingHistoryListenRepository extends Repository<SpotifyExtendedStreamingHistoryListen> {}
