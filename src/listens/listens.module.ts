import { Module } from "@nestjs/common";
import { ListensService } from "./listens.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ListenRepository } from "./listen.repository";
import { ListensController } from "./listens.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ListenRepository])],
  providers: [ListensService],
  exports: [ListensService],
  controllers: [ListensController],
})
export class ListensModule {}
