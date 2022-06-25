import { Module } from "@nestjs/common";
import { TypeOrmRepositoryModule } from "../database/entity-repository/typeorm-repository.module";
import { ListenRepository } from "./listen.repository";
import { ListensController } from "./listens.controller";
import { ListensService } from "./listens.service";

@Module({
  imports: [TypeOrmRepositoryModule.for([ListenRepository])],
  providers: [ListensService],
  exports: [ListensService],
  controllers: [ListensController],
})
export class ListensModule {}
