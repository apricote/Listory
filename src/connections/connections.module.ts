import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionsController } from "./connections.controller";
import { ConnectionsRepository } from "./connections.repository";
import { ConnectionsService } from "./connections.service";

@Module({
  imports: [TypeOrmModule.forFeature([ConnectionsRepository])],
  controllers: [ConnectionsController],
  providers: [ConnectionsService]
})
export class ConnectionsModule {}
