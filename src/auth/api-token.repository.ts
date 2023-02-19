/* eslint-disable max-classes-per-file */
import { Repository, SelectQueryBuilder } from "typeorm";
import { EntityRepository } from "../database/entity-repository";
import { User } from "../users/user.entity";
import { ApiToken } from "./api-token.entity";

export class ApiTokenScopes extends SelectQueryBuilder<ApiToken> {
  /**
   * `byUser` scopes the query to ApiTokens created by the user.
   * @param currentUser
   */
  byUser(currentUser: User): this {
    return this.andWhere(`token."userId" = :userID`, {
      userID: currentUser.id,
    });
  }
}

@EntityRepository(ApiToken)
export class ApiTokenRepository extends Repository<ApiToken> {
  get scoped(): ApiTokenScopes {
    return new ApiTokenScopes(this.createQueryBuilder("token"));
  }
}
