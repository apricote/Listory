import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { UsersService } from "./users.service";
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
