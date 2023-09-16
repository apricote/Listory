/* eslint-disable max-classes-per-file */
import { Repository, SelectQueryBuilder } from "typeorm";
import { EntityRepository } from "../database/entity-repository";
import { Interval } from "../reports/interval";
import { User } from "../users/user.entity";
import {
  CreateListenRequestDto,
  CreateListenResponseDto,
} from "./dto/create-listen.dto";
import { Listen } from "./listen.entity";

export class ListenScopes extends SelectQueryBuilder<Listen> {
  /**
   * `byUser` scopes the query to listens created by the user.
   * @param currentUser
   */
  byUser(currentUser: User): this {
    return this.andWhere(`listen."userId" = :userID`, {
      userID: currentUser.id,
    });
  }

  /**
   * `duringInterval` scopes the query to listens played during the interval.
   * @param interval
   */
  duringInterval(interval: Interval): this {
    return this.andWhere("listen.playedAt BETWEEN :timeStart AND :timeEnd", {
      timeStart: interval.start,
      timeEnd: interval.end,
    });
  }
}

@EntityRepository(Listen)
export class ListenRepository extends Repository<Listen> {
  get scoped(): ListenScopes {
    return new ListenScopes(this.createQueryBuilder("listen"));
  }

  async insertNoConflict({
    user,
    track,
    playedAt,
  }: CreateListenRequestDto): Promise<CreateListenResponseDto> {
    const result = await this.createQueryBuilder()
      .insert()
      .values({
        user,
        track,
        playedAt,
      })
      .onConflict('("playedAt", "trackId", "userId") DO NOTHING')
      .execute();

    const [insertedRowIdentifier] = result.identifiers;

    if (!insertedRowIdentifier) {
      // We did not insert a new listen, it already existed
      return {
        listen: await this.findOneBy({ user, track, playedAt }),
        isDuplicate: true,
      };
    }

    return {
      listen: await this.findOneBy({ id: insertedRowIdentifier.id }),
      isDuplicate: false,
    };
  }

  /**
   *
   * @param rows
   * @returns A list of all new (non-duplicate) listens
   */
  async insertsNoConflict(rows: CreateListenRequestDto[]): Promise<Listen[]> {
    const result = await this.createQueryBuilder()
      .insert()
      .values(rows)
      .orIgnore()
      .execute();

    return this.findBy(
      result.identifiers.filter(Boolean).map(({ id }) => ({ id })),
    );
  }
}
