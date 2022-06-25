import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmRepositoryModule } from "../database/entity-repository/typeorm-repository.module";

@Module({
  imports: [TypeOrmRepositoryModule.for([UserRepository])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
