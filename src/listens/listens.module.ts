import { Module } from "@nestjs/common";
import { ListensService } from "./listens.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ListenRepository } from "./listen.repository";

@Module({
  imports: [TypeOrmModule.forFeature([ListenRepository])],
  providers: [ListensService],
  exports: [ListensService],
})
export class ListensModule {}
