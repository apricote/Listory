import { PGBossModule } from "@apricote/nest-pg-boss";
import { Module } from "@nestjs/common";
import { TypeOrmRepositoryModule } from "../database/entity-repository/typeorm-repository.module";
import { ImportSpotifyJob } from "../sources/jobs";
import { UserRepository } from "./user.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmRepositoryModule.for([UserRepository]),
    PGBossModule.forJobs([ImportSpotifyJob]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
