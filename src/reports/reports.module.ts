import { Module } from "@nestjs/common";
import { ListensModule } from "../listens/listens.module";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

@Module({
  imports: [ListensModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
