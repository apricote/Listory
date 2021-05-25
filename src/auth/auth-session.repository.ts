/* eslint-disable max-classes-per-file */
import { EntityRepository, Repository, SelectQueryBuilder } from "typeorm";
import { User } from "../users/user.entity";
import { AuthSession } from "./auth-session.entity";

export class AuthSessionScopes extends SelectQueryBuilder<AuthSession> {
  /**
   * `byUser` scopes the query to AuthSessions created by the user.
   * @param currentUser
   */
  byUser(currentUser: User): this {
    return this.andWhere(`session."userId" = :userID`, {
      userID: currentUser.id,
    });
  }
}

@EntityRepository(AuthSession)
export class AuthSessionRepository extends Repository<AuthSession> {
  get scoped(): AuthSessionScopes {
    return new AuthSessionScopes(this.createQueryBuilder("session"));
  }
}
